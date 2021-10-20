export class Order {
  constructor(private discount: DiscountCalculator, private amount: number) {}

  discountedAmount() {
    return (100 - this.discount.discount()) * this.amount;
  }
}

export interface DiscountCalculator {
  discount(): number;
}
