import { Body, Controller, Get, Param, Post, Query, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Express } from 'express';
import { CreateProductDto } from './dto/createProduct.dto';
import { FileService } from './file.service';

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
  async getOne(@Param('id') id: string, @Response() res) {
    const product = await this.appService.findOne(id);
    product.licenceKey = undefined;    
    const img = await this.filesService.getFile(product.image.id);
    product.image = undefined;
    return { ...product, img }
  }
  @Get('/image/:id')
  async getImg(@Param('id') id: string, @Response() res) {
    const product = await this.appService.findOne(id);
    const img = await this.filesService.getFile(product.image.id);
    res.send(img);
  }

  @Post('/admin')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createProduct: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    return this.appService.create(createProduct, file.buffer, file.originalname);
  }
  
}
