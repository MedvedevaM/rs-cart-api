import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import { getClient } from '../../db/connection';
@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {}

  async findById(orderId: string): Promise<Order> {
    try {
      const сlient = await getClient();
      const { rows } = orderId ? await сlient.query(`
        select * 
        from orders
        where id = '${orderId}'
      `) : { rows: [] };
      return rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  async create(data: any) {
    const id = v4(v4())
    const order = {
      ...data,
      id,
      status: 'inProgress',
    };

    this.orders[ id ] = order;

    return order;
  }

  async update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[ orderId ] = {
      ...data,
      id: orderId,
    }
  }
}
