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

  async all() {
    const carts = await this.cartRepo.find();
    if(!carts) {
      return null;
    }
    return carts;
  }

  findOne(userId: string) {
    if(!userId) {
      return null;
    }

    const cart = this.cartRepo.findOne({where: {userId: userId}});

    if(!cart) {
      return null;
    }

    return cart;
  }

  async addToCart(userId: string, attrs: ProductDto) {
    const cart = await this.findOne(userId);

    if(!cart) {
      const product = await this.cartRepo.create({
        userId: userId,
        products: {
          id: attrs.id,
          title: attrs.title,
          price: attrs.price,
          version: attrs.version
        }
      });

      await this.cartRepo.save(product);
      return product;
    }
    this.productsRepo.insert({id: attrs.id, title: attrs.title, price: attrs.price, version: attrs.version, cart: cart});
  }

  async deleteAllCart() {
    const cart = await this.cartRepo.find();

    if(!cart) {
      throw new NotFoundException(`Some Entities not found, no changes applied!`);
    }

    const products = await this.productsRepo.find({where: {cart: cart}});

    await this.productsRepo.remove(products);

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

    const cart = await this.cartRepo.findOne({where: {userId: userId}});

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
          title: attrs.title,
          price: attrs.price,
          version: attrs.version
        });
      }      
    });
  }
}
