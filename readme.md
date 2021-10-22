## **Update**:

Originally, branch v2 was created to solve my cyclic dependency in the system. This turned out to be a fool's errand because, with a little reorganisation of logic, I have now managed to remove the cyclic dependency in V1 while structuring the program more logically.

My tests are much cleaner in v2, but the program is way easier to follow logically in v1

### Usage

A test environment can be set up with scooters, users and stations very easily. See `./src/index.js`

```TS
// @ts-nocheck
// ^ important otherwise we have to check for false values all the time x)
// Install ts-node globally `npm i -g ts-node` and then run `ts-node src` to run this file
import { DockingStation } from './DockingStation';
import { Scooter } from './Scooter';
import { User } from './User';
import { Location } from './Location';

const station1 = new DockingStation(new Location(1, 1));
const station2 = new DockingStation(new Location(5, 10));
const scoot1 = new Scooter();
const scoot2 = new Scooter();
station1.dock(scoot1);
station2.dock(scoot2);

// balance is optional
const user1 = new User('Daniel Miller', 30, new Location(2, 2));

// You should then be able to interact with the whole system from a user's PoV
const nearest = user1.findNearestAvailableStation();
console.log(nearest.location); // { x: 1, y: 1}

user1.hireFrom(nearest);
console.log(user1.scooter.id);

// . . .
const broken = true;
user1.dock(station2, broken);

```

### What went well:

- I think I used asynchronous JS nicely for the scooter charging and discharging functionality.
- I enjoyed using typescript and was able to see that it can be very helpful to code with
- TDD became very powerful and useful once I got it

### What didn't go well

- I probably should have created an "App" class which handles interactions between Users, Scooters, and Stations
- My tests could have been organised better
- Lack of documentation - JS-doc for next project?

---

## UML Diagrams

### Class

![](./UML-diagrams/images/class-diagram.png)

### Lifetime

![](./UML-diagrams/images/lifetime-diagram.png)

### Class

![](./UML-diagrams/images/use-case-diagram.png)

```

```
