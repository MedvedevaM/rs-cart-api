import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';

import { getClient } from '../../db/connection';
@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    try {
      const сlient = await getClient();
      const { rows } = userId ? await сlient.query(`
        select 
          c.id,
          o.user_id
        from carts c
        join orders as o 
        on c.id = o.cart_id
        where o.user_id = '${userId}'
      `) : { rows: [] };
      return rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  async createByUserId(userId: string) {
    const id = v4(v4());
    try {
      const сlient = await getClient();
      await сlient.query(`
        insert into carts (id) values 
        ('${id}')
      `);
      await сlient.query(`
        insert into orders (user_id, cart_id, payment, delivery, comments, status, total) values 
        ('${userId}', '${id}', '{}', '{}', '', '', 0)
      `);
      return {
        id,
        userId,
        items: []
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    }

    const сlient = await getClient();
    try {
      const query = `${items.reduce((query, item) => {
        return `${query} ('${id}', '${item.product}', '${item.count}')`
      }, 'INSERT INTO cart_items (cart_id, product_id, count) VALUES')}
        ON CONFLICT (cart_id, product_id) 
        DO 
         UPDATE SET count = EXCLUDED.count;`
      await сlient.query(query);
    } catch (error) {
      console.log(error);
    }

    return { ...updatedCart };
  }

  async removeByUserId(userId): Promise<void> {
    try {
      const сlient = await getClient();
      await сlient.query(`
        delete from carts c
        using orders as o
        where o.cart_id = carts.id
          and o.user_id = '${userId}'
      `);
    } catch (error) {
      console.log(error);
    }
  }

}
