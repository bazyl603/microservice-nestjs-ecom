import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Orders } from './entity/orders.entity';
import { PaymentStatus } from 'enums/EnumPaymentStatus';
import { NewOrderDto } from './dto/newOrder.dto';
import Product from './entity/product.entity';
import { StripeService } from './stripe.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly stripeService: StripeService
  ) {}

  async getByUser(userId: string) {
    const orders = await this.ordersRepo.find({where: {userId: userId}});

    if(!orders.length) {
      throw new NotFoundException('no orders');
    }

    return orders;
  }

  async getByOrders(orderId: string) {
    const orders = await this.ordersRepo.findOne({where: {id: orderId}});
    
    if(!orders) {
      throw new NotFoundException('no order');
    }

    return orders;
  }

  async createOrders(attrs: NewOrderDto) {
    const product = await this.productRepo.create({
      productId: attrs.productId,
      title: attrs.title,
      version: parseInt(attrs.productVersion)
    });
    await this.productRepo.save(product);

    const createOrders = await this.ordersRepo.create({
      price: Number(attrs.price),
      userId: attrs.userId,
      paymentStatus: PaymentStatus.WAIT,
      product: product
    });

    await this.ordersRepo.save(createOrders);
    return createOrders;
  }

  async ordersAnnulment(orderId: string) {
    const orders = await this.ordersRepo.findOne({where: {id: orderId}});

    await this.ordersRepo.update(orders.id, {
      paymentStatus: PaymentStatus.REMOVED
    });

    return await this.ordersRepo.findOne({where: {id: orderId}});;
  }

  async getLikeAdmin(orderId: string | null) {
    if(orderId) {
      const orders = await this.ordersRepo.findOne({where: {id: orderId}});

    
    if(!orders) {
      throw new NotFoundException('no order with this id');
    }

    return orders;
    }

    const orders = await this.ordersRepo.find();

    if (!orders.length) {
      throw new NotFoundException('no orders');
    }

    return orders;
  }

  async deleteLikeAdmin(orderId: string) {    
    const order = await this.ordersRepo.findOne(orderId);

    if(!order) {
      throw new NotFoundException('no order, no delete');
    }

    const product = await this.productRepo.findOne(order.product.id);

    await this.ordersRepo.update(order.id, {
      product: null
    });

    await this.productRepo.remove(product);

    return await this.ordersRepo.remove(order);
  }

  async reciveKey(key: string, orderId: string) {
    const order = await this.ordersRepo.findOne({where: {id: orderId}});

    if(!order) {
      throw new NotFoundException('no order, no added key');
    }

    return await this.ordersRepo.update(orderId, {
      licenceKey: key
    });
  }

  async paymant(orderId: string, token: string) {
    const order = await this.ordersRepo.findOne(orderId);

    if(!order) {
      throw new NotFoundException('missing order');
    }

    if(order.paymentStatus === PaymentStatus.REMOVED || order.paymentStatus === PaymentStatus.PAID)  {
      throw new BadRequestException('you can not pay from paied or removed orders');
    }

    const charge = await this.stripeService.charge(order.price * 100, token);

    if(!charge.id) {
      throw new NotFoundException('payment error');
    }

    await this.ordersRepo.update(orderId, {
      paymentStatus: PaymentStatus.PAID,
      stripeId: charge.id
    });

    return await this.ordersRepo.findOne(orderId);
  }
}
