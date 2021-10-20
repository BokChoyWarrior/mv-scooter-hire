// import App from './App';
// import { User } from './User';

// const app = new App();
// const user = new User();

// user.hireFrom(0);

import { Order } from './Order';
import Customer from './Customer';

const cust = new Customer();
const order1 = new Order(cust, 50);

cust.orders.push(order1);
