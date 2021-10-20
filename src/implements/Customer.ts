import { DiscountCalculator, Order } from './Order';

export default class Customer implements DiscountCalculator {
  orders: Order[] = [];

  constructor() {}

  discount() {
    if (this.orders.length > 5) {
      return 10;
    }
    return 3;
  }
}
