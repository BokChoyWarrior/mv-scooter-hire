// https://medium.com/angular-in-depth/how-to-break-a-cyclic-dependency-between-es6-modules-fd8ede198596

import App from './App';
import { User } from './User';

const app = new App([]);
const user = new User(app);

app.users.push(user);
