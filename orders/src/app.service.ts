import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Orders } from './entity/orders.entity';
import { PaymentStatus } from 'enums/EnumPaymentStatus';
import { NewOrderDto } from './dto/newOrder.dto';
import Product from './entity/product.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async getByUser(userId: string) {
    const orders = await this.ordersRepo.find({where: {userId: userId}});

    if(!orders.length) {
      throw new NotFoundException('no orders');
    }

    return orders;
  }

  async getByOrders(orderId: string) {
    const orders = await this.ordersRepo.findOne(orderId);

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
      price: attrs.price,
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
      const order = await this.ordersRepo.findOne({where: {id: orderId}});

      if(!order) {
        throw new NotFoundException('no order');
      }

      return order
    }

    const orders = await this.ordersRepo.find();

    if (!orders.length) {
      throw new NotFoundException('no orders');
    }

    return orders;
  }

  async deleteLikeAdmin(orderId: string) {    
    const order = await this.ordersRepo.findOne({where: {id: orderId}});

    if(!order) {
      throw new NotFoundException('no order, no delete');
    }

    await this.productRepo.remove(order.product);

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
}
