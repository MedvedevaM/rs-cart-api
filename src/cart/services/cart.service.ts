import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';

import { сlient } from '../../db/connection';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    try {
      const { rows } = userId ? await сlient.query(`
        select * 
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

  createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[userId] = userCart;

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    }

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[userId] = null;
  }

}
