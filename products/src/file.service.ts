import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import Image from './entity/image.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    private readonly configService: ConfigService
  ) {}

  async uploadFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: dataBuffer,
      Key: `${uuid()}-${filename}`
    })
      .promise();
 
    const newFile = this.imageRepo.create({
      key: uploadResult.Key,
      url: uploadResult.Location
    });
    await this.imageRepo.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: string) {
    const file = await this.imageRepo.findOne({ id: fileId });
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    }).promise();
    await this.imageRepo.delete(fileId);
  }

  async getFile(fileId: string) {
    const file = await this.imageRepo.findOne({ id: fileId });
    const s3 = new S3();
    const img = await s3.getObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
    }).promise();

    return img;    
  }
}
