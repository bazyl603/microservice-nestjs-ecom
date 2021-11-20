import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { Cart } from './entity/cart.entity';
import { Products } from './entity/products.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Products) private readonly productsRepo: Repository<Products>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
  ) {}

  all() {
    return this.cartRepo.find();
  }

  findOne(userId: string) {
    if(!userId) {
      return null;
    }

    return this.cartRepo.findOne({where: {userId: userId}});
  }

  async addToCart(userId: string, attrs: ProductDto) {
    const cart = await this.findOne(userId);

    if(!cart) {
      const product = await this.cartRepo.create({
        userId: userId,
        products: {...attrs}
      });

      await this.cartRepo.save(product);
      return product;
    }

    return await this.cartRepo.update(cart.id, {
      products: {
        ...cart.products,
        ...attrs
      }
    });
  }

  async deleteAllCart() {
    const cart = await this.all();

    if(!cart.length) {
      throw new NotFoundException(`Some Entities not found, no changes applied!`);
    }

    await this.cartRepo.remove(cart);
  }

  async deleteProduct(userId: string, productId: string) {
    if(!userId || !productId) {
      return null;
    }

    const cart = await this.findOne(userId);

    if(!cart) {
      throw new BadRequestException(`cart not exist`);
    }

    const product = await this.productsRepo.findOne({where: {id: productId, cart: cart}});

    if(!product) {
      throw new BadRequestException(`product is not added`);
    }

    await this.productsRepo.remove(product);
  }

  async deletePostUpdate(productId: string) {
    if(!productId) {
      return null;
    }

    const product = await this.productsRepo.find({where: {id: productId}});

    if(!product.length) {
      return null;
    }

    await this.productsRepo.remove(product);
  }

  async deleteCart(userId: string) {
    if(!userId) {
      return null;
    }

    const cart = await this.findOne(userId);

    if(!cart) {
      throw new BadRequestException(`cart not exist`);
    }

    await this.cartRepo.remove(cart);
  }

  async updateProduct(productId: string, attrs: ProductDto) {
    const product = await this.productsRepo.find({where: {id: productId}});

    if (!product.length) {
      return null;
    }

    product.map(async (p) => {
      if(p.version < attrs.version) {
        await this.productsRepo.update(p.id, {
          ...attrs
        });
      }      
    });
  }
}
