import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  async charge(amount: number, token: string) {
    return this.stripe.charges.create({
      currency: this.configService.get('STRIPE_CURRENCY'),
      amount: amount,
      source: token
    });
  }
}
