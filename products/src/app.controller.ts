import { Body, Controller, Delete, Get, Param, Post, Put, Query, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Express } from 'express';
import { CreateProductDto } from './dto/createProduct.dto';
import { FileService } from './file.service';
import { LicenceKeyDto } from './dto/licenceKey.dto';
import { LicenceKeyDeleteDto } from './dto/licenceKeyDelete.dto';

@Controller('api/products')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly filesService: FileService
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
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createProduct: CreateProductDto, @UploadedFile() file: Express.Multer.File | undefined) {
    if (file) {
      return this.appService.create(createProduct, file.buffer, file.originalname);
    }
    
    return this.appService.create(createProduct);
    
  }
  
  @Put('/admin/:id')
  @UseInterceptors(FileInterceptor('file'))
  async edit(@Param('id') id: string, @Body() attrsProduct: CreateProductDto, @UploadedFile() file: Express.Multer.File | undefined) {
    //TODO adding rabbitmq send to update
    
    if (file) {
      return this.appService.update(id, attrsProduct, file.buffer, file.originalname);
    } 

    return this.appService.update(id, attrsProduct);
    
    
  }

  @Delete('/admin/:id')
  async delete(@Param('id') id: string) {
    //TODO rabbitmq delete send
    return this.appService.remove(id);
  }

  @Get('/key/admin/:id')
  async key(@Param('id') id: string) {
    return this.appService.getAllKey(id);    
  }

  @Post('/key/admin/:id')
  async addKey(@Body() licenceKey: LicenceKeyDto, @Param('id') id: string) {
    return this.appService.addKey(id, licenceKey.licenceKey);    
  }

  @Delete('/key/admin')
  async deleteKey(@Body() key: LicenceKeyDeleteDto) {
    return this.appService.removeKey(key.licenceKey);
  }
}
