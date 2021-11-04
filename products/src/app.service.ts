import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { LicenceKey } from './entity/licenceKey.entity';
import { Products } from './entity/products.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Products) private readonly productsRepo: Repository<Products>,
    @InjectRepository(LicenceKey) private readonly licenceKeyRepo: Repository<LicenceKey>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const title = createProductDto.title
    const product = await this.productsRepo.find({title});

    if(product.length) {
      throw new BadRequestException('Product exist');
    }

    try {
      const createProduct = await this.productsRepo.create({
        title: createProductDto.title,
        price: createProductDto.price,
        image: createProductDto.image,
        description: createProductDto.description
      });

      for (const key of createProductDto.licenceKey) {
        await this.licenceKeyRepo.create({
          key: key,
          products: createProduct
        });
      }

      return createProduct;
    } catch (err) {
      console.log(err); //no production
      throw new NotFoundException('somthing is wrong');
    }
  }

  async update(id: string, attrs: Partial<Products>) {
    const product = await this.productsRepo.findOne(id);
    if(!product) {
      throw new NotFoundException('product not found');
    }

    Object.assign(product, attrs);
    return this.productsRepo.save(product);
  }

  async remove(id: string) {
    const product = await this.productsRepo.findOne(id);
    if (!product) {
      throw new NotFoundException('user not found');
    }
    return this.productsRepo.remove(product);
  }

  all() {
    return this.productsRepo.find();
  }

  find(title: string) {
    return this.productsRepo.find({ where: {title: Like(title)}});
  }

  findOne(id: string) {
    if(!id) {
      return null;
    }

    return this.productsRepo.findOne(id);
  }

  async addKey(productId: string, keys: string[]) {
    const product = await this.productsRepo.findOne(productId);

    if(!product) {
      throw new NotFoundException('product not exist');
    }

    try {
      for (const key of keys) {
        await this.licenceKeyRepo.create({
          key: key,
          products: product
        });
      }
    } catch (err) {
      console.log(err); //no production
      throw new NotFoundException('somthing is wrong');
    }    

    return product;
  }

  getOneKey(productId) {
    return this.licenceKeyRepo.findOne({where: {products: productId}});
  }

  async removeKey(keys: string[]) {
    try {
      for (const key of keys) {
        let licence = await this.licenceKeyRepo.findOne({where: {key: key}});
        if(licence) {
          await this.licenceKeyRepo.remove(licence);
        }        
      }
    } catch (err) {
      console.log(err); //no production
      throw new NotFoundException('somthing is wrong');
    }
  }

  async removeAllKey(productId) {
    const product = await this.productsRepo.findOne(productId);

    if(!product) {
      throw new NotFoundException('product not exist');
    }

    let licences = await this.licenceKeyRepo.find({where: {products: productId}});
    return await this.licenceKeyRepo.remove(licences);
  }
}
