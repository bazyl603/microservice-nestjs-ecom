import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { LicenceKey } from './entity/licenceKey.entity';
import { Products } from './entity/products.entity';
import { FileService } from './file.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Products) private readonly productsRepo: Repository<Products>,
    @InjectRepository(LicenceKey) private readonly licenceKeyRepo: Repository<LicenceKey>,
    private readonly filesService: FileService
  ) {}

  async create(createProductDto: CreateProductDto, imageBuffer?: Buffer, fileName?: string) {
    const title = createProductDto.title
    const product = await this.productsRepo.find({title});

    if(product.length) {
      throw new BadRequestException('Product exist');
    }

    try {
      let createProduct;
      if (imageBuffer) {
        const img = await this.filesService.uploadFile(imageBuffer, fileName);
        createProduct = await this.productsRepo.create({
        title: createProductDto.title,
        image: img,
        price: createProductDto.price,
        description: createProductDto.description
        });
      } else {
        createProduct = await this.productsRepo.create({
          title: createProductDto.title,
          image: null,
          price: createProductDto.price,
          description: createProductDto.description
          });
      }  
      
      await this.productsRepo.save(createProduct);
      return createProduct;
    } catch (err) {
      console.log(err); //no production
      throw new NotFoundException('somthing is wrong');
    }
  }  

  async remove(id: string) {
    const product = await this.productsRepo.findOne(id);
    if (!product) {
      throw new NotFoundException('user not found');
    }

    await this.productsRepo.update(id, {
      ...product,
      image: null
    });
    
    if (product.image) {
      await this.filesService.deletePublicFile(product.image.id);
    }   

    await this.removeAllKey(product.id);
   
    return await this.productsRepo.remove(product);
  }

  async update(id: string, attrs: CreateProductDto, imageBuffer?: Buffer, fileName?: string) {
    const product = await this.productsRepo.findOne(id);
    if(!product) {
      throw new NotFoundException('product not found');
    }  

    if (imageBuffer) {
      const img = await this.filesService.uploadFile(imageBuffer, fileName);
      await this.productsRepo.update(id, {
        title: attrs.title,
        price: attrs.price,
        description: attrs.description,
        image: img
      });
    }  else {
      await this.productsRepo.update(id, {
        title: attrs.title,
        price: attrs.price,
        description: attrs.description,
        image: null
      });
  
      if (product.image) {
        await this.filesService.deletePublicFile(product.image.id);
      }
    }
    
    return await this.productsRepo.findOne(id);
  }

  all() {
    return this.productsRepo.find();
  }

  find(title: string) {
    return this.productsRepo.find({ where: {title: Like('%' + title + '%')}});
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
        const check = await this.licenceKeyRepo.find({key});
        if(check.length) {
          throw new BadRequestException('key exist' + key);
        }
        const k = await this.licenceKeyRepo.create({
          key: key,
          products: product
        });
        await this.licenceKeyRepo.save(k);
      }
    } catch (err) {
      throw new NotFoundException('somthing is wrong');
    }    

    return product;
  }

  getOneKey(productId) {
    return this.licenceKeyRepo.findOne({where: {products: productId}});
  }

  getAllKey(productId) {
    return this.licenceKeyRepo.find({where: {products: productId}});
  }

  async removeKey(key: string) {
    try {
      
      let licence = await this.licenceKeyRepo.findOne({where: {key: key}});
      if(licence) {
        await this.licenceKeyRepo.remove(licence);
      }
      return licence;
    } catch (err) {
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
