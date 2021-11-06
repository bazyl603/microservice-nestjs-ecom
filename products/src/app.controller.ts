import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getAll(@Query('title') title: string) {
    const products = await this.appService.find(title);
    return products;
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    const product = await this.appService.findOne(id);
    return product;
  }

  @Post('/')
  async create(@Body() createProduct: {}) {
    
  }
  
}
