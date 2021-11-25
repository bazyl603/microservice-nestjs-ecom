import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put, Query, } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AdminGuard } from './guards/admin.guard';
import { NewOrderDto } from './dto/newOrder.dto';
import { TokenDto } from './dto/token.dto';

@Controller('/api/order')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('PRODUCTS-SERVICE') private readonly clientProducts: ClientProxy
    ) {}

  //user

  @Get('/')
  async getByUser(@Query('userId') userId: string) {
    return this.appService.getByUser(userId);
  }

  @Get('/:orderId')
  async getByOrder(@Param('orderId') orderId: string) {
    return this.appService.getByOrders(orderId);
  }

  @Get('/download/:orderId')
  async downloadKey(@Param('orderId') orderId: string) {

  }

  @Post('/')
  async newOrder(@Body() order: NewOrderDto) {
    return this.appService.createOrders(order);
  }

  @Put('/:orderId')
  async orderAnnulment(@Param('orderId') orderId: string) {
    return this.appService.ordersAnnulment(orderId);
  }

  @Post('/paymant/:orderId')
  async paymant(@Param('orderId') orderId: string, @Body() token: TokenDto) {
    const paid = await this.appService.paymant(orderId, token.token);

    if(!paid) {
      throw new NotFoundException('paymant error');
    }

    //get key from products
    this.clientProducts.emit({cmd:'GIVE_KEY'}, paid);
    
    return await this.appService.getByOrders(orderId);
  }


  //admin

  @Get('/admin/all')
  async getLikeAdmin(@Query('orderId') orderId: string | null) {
    return this.appService.getLikeAdmin(orderId);
  }

  @Delete('/admin/:orderId')
  async deleteOrder(@Param('orderId') orderId: string) {
    const order = await this.appService.getByOrders(orderId);
    if(!order) {
      throw new NotFoundException('no order');
    }
    //return key to product
    this.clientProducts.emit({cmd:'BACK_KEY'}, {productId: order.product.productId, key: order.licenceKey});
  
    return this.appService.deleteLikeAdmin(orderId);
  }

  //service

  @EventPattern({ cmd: 'RECIVE_KEY' })
  async reciveKey(payLoad: any) { //key recive to orders
    await this.appService.reciveKey(payLoad.key, payLoad.order.id);
  }
}
