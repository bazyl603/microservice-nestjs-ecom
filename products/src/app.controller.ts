import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Express } from 'express';
import { CreateProductDto } from './dto/createProduct.dto';
import { FileService } from './file.service';
import { LicenceKeyDto } from './dto/licenceKey.dto';
import { LicenceKeyDeleteDto } from './dto/licenceKeyDelete.dto';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { AdminGuard } from './guards/admin.guard';

@Controller('api/products')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly filesService: FileService,
    @Inject('CART-SERVICE') private readonly clientCart: ClientProxy,
    @Inject('ORDER-SERVICE') private readonly clientOrder: ClientProxy
    ) {}

  @Get('/')
  async getAll(@Query('title') title: string) {
    const products = await this.appService.find(title);
    return products;
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    const product = await this.appService.findOne(id);
    return product
  }
  @Get('/image/:id')
  async getImg(@Param('id') id: string, @Response() res: any) {
    const product = await this.appService.findOne(id);
    const img = await this.filesService.getFile(product.image.id);
    res.send(img)
  }

  @Post('/admin')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createProduct: CreateProductDto, @UploadedFile() file: Express.Multer.File | undefined) {
    if (file) {
      return this.appService.create(createProduct, file.buffer, file.originalname);
    }
    
    return this.appService.create(createProduct);
    
  }
  
  @Put('/admin/:id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async edit(@Param('id') id: string, @Body() attrsProduct: CreateProductDto, @UploadedFile() file: Express.Multer.File | undefined) {
        
    if (file) {
      const product = await this.appService.update(id, attrsProduct, file.buffer, file.originalname);

      product.image = undefined;
      product.licenceKey = undefined;

      this.clientCart.emit('EDIT_PRODUCT', product);

      return product;
    } 

    const product = await this.appService.update(id, attrsProduct);

    product.image = undefined;
    product.licenceKey = undefined;

    this.clientCart.emit('EDIT_PRODUCT', product);

    return product;    
    
  }

  @Delete('/admin/:id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    const product = await this.appService.remove(id);
    this.clientCart.emit('DELETE_PRODUCT', product.id);
    return product;
  }

  @Get('/key/admin/:id')
  @UseGuards(AdminGuard)
  async key(@Param('id') id: string) {
    return this.appService.getAllKey(id);    
  }

  @Post('/key/admin/:id')
  @UseGuards(AdminGuard)
  async addKey(@Body() licenceKey: LicenceKeyDto, @Param('id') id: string) {
    return this.appService.addKey(id, licenceKey.licenceKey);    
  }

  @Delete('/key/admin')
  @UseGuards(AdminGuard)
  async deleteKey(@Body() key: LicenceKeyDeleteDto) {
    return this.appService.removeKey(key.licenceKey);
  }

  @EventPattern('GIVE_KEY')
  async giveKey(productId: string) {
    const key = await this.appService.getOneKey(productId);

    this.clientOrder.emit('RECIVE_KEY', key.key);

    await this.appService.removeKey(key.key);
  }

  @EventPattern('BACK_KEY')
  async backKey(payLoad: {productId: string, key: string}) {
    await this.appService.addKey(payLoad.productId, Array(payLoad.key));
  }
}
