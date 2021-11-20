import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { ProductDto } from './dto/product.dto';
import { DeleteProductDto } from './dto/deleteProduct.dto';

@Controller('/api/cart')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('PRODUCTS-SERVICE') private readonly clientProducts: ClientProxy
    ) {}

  @Get('/:userId')
  //@UseGuards(AuthGuard)
  async getCart(@Param('userId') id: string) {
    return this.appService.findOne(id);
    
  }

  @Post('/:userId')
  //@UseGuards(AuthGuard)
  //add in body delete product
  async addCart(@Param('userId') id: string, @Body() attrProduct: ProductDto) {
    return this.appService.addToCart(id, attrProduct);
  }

  @Delete('/:userId')
  //@UseGuards(AuthGuard)
  //add in body delete product
  async deleteCart(@Param('userId') id: string, @Body() attrProduct: DeleteProductDto) {
    return this.appService.deleteProduct(id, attrProduct.id);
  }

  @Get('/admin')
  //@UseGuards(AdminGuard)
  async getAll() {
    return this.appService.all();
  }
  
  @Delete('/admin/:userId')
  //@UseGuards(AdminGuard)
  async deleteCartAdmin(@Param('userId') id: string) {
    return this.appService.deleteCart(id);
  }

  @Delete('/admin/all')
  //@UseGuards(AdminGuard)
  async deleteAll() {
    return this.appService.deleteAllCart();
  }

  @EventPattern({ cmd: 'EDIT_PRODUCTS' })
  async editProduct(product: any) {
    return this.appService.updateProduct(product.id, product);
  }

  @EventPattern({ cmd: 'DELETE_PRODUCTS' })
  async deleteProduct(productId: any) {
    return this.appService.deletePostUpdate(productId);
  }
}
