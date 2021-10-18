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

  it('the user can register', () => {
    let person = new Person('harv', 55, new Location());
    let user = person.register();
    expect(user).toBeInstanceOf(User);
  });

  it('underage users cannot register', () => {
    let underage = new Person('person 2', 5, new Location());
    expect(() => underage.register()).toThrowError();
  });

  it.todo('The user can add payment details');

  it.todo('the user can hire a scooter');

  it.todo("the user can return the scooter to a station, and money will be taken form user's account");

  it.todo('the user can mark a scooter as broken, and can contact team to get a refund');
});
