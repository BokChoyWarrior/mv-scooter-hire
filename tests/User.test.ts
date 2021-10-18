import { setupMockEnvironment, teardownMockEnvironment } from '.';
import { Location } from '../src/Location';
import { Person } from '../src/Person';
import { User } from '../src/User';

let users, scooters, stations;

describe('the User (and Person) class', () => {
  beforeEach(() => {
    return ({ scooters, users, stations } = setupMockEnvironment());
  });

  afterEach(teardownMockEnvironment);

  test('the user can register', () => {
    let person = new Person('harv', 55, new Location());
    let user = person.register();
    expect(user).toBeInstanceOf(User);
  });

  test('"underage users cannot register', () => {
    let underage = new Person('person 2', 5, new Location());
    expect(() => underage.register()).toThrowError();
  });
});
