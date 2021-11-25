import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus } from 'enums/EnumPaymentStatus';
import * as PDFDocument from 'pdfkit'
import { Repository } from 'typeorm';
import { Orders } from './entity/orders.entity';
import Product from './entity/product.entity';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

 async generatePdf(orderId: string) {
   const order = await this.ordersRepo.findOne(orderId);

  if(!order) {
    throw new NotFoundException('order not exist');
  }

  //  if(order.paymentStatus === PaymentStatus.WAIT || order.paymentStatus === PaymentStatus.REMOVED) {
  //   throw new NotFoundException('must pay or order removed');
  //  }

  const pdfBuffer: Buffer = await new Promise(resolve => {
    const doc = new PDFDocument({
      size: 'LETTER',
      bufferPages: true,
    })

    // customize your PDF document
    doc.text(order.product.title);
    doc.moveDown();
    doc.text(`klucz: ${order.licenceKey}`);
    doc.moveDown();
    doc.text(`cena: ${order.price} zl`);
    doc.end()

    const buffer = []
    doc.on('data', buffer.push.bind(buffer))
    doc.on('end', () => {
      const data = Buffer.concat(buffer)
      resolve(data)
    })
  })

  return pdfBuffer
 }
}
