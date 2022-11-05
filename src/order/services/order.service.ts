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
    const order = {
      ...data,
      status: 'inProgress',
    };

    const сlient = await getClient();
    await сlient.query(`
        insert into orders (user_id, cart_id, payment, delivery, comments, status, total) values 
        ('${data.userId}', '${data.cartId}', '${data.payment}', '${data.delivery}', '${data.comments}', '${data.status}', ${data.total})
      `);

    return order;
  }

  async update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const сlient = await getClient();
    await сlient.query(`
      update orders
      set payment = '${JSON.stringify(data.payment)}',
        delivery = '${JSON.stringify(data.delivery)}',
        comments = '${data.comments || ''}',
        status = '${data.status || ''}',
        total = '${data.total || 0}',
      where id = '${orderId}';
    `);
  }
}
