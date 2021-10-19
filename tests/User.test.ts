import { setupMockEnvironment, teardownMockEnvironment } from '.';
import { Location } from '../src/Location';
import { Person } from '../src/Person';
import { User } from '../src/User';
import { DockingStation } from '../src/DockingStation';
import { Scooter } from '../src/Scooter';

let users, scooters, stations;

describe('the User (and Person) class', () => {
  // beforeEach(() => {
  //   return ({ scooters, users, stations } = setupMockEnvironment());
  // });

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

  it('the user can hire/dock a scooter', async () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    const s2 = new Scooter();
    const user = new User('1', 100, new Location());
    station.dock(s1);
    station.dock(s2);

    const nearest = user.findNearestAvailableStation();
    // console.log(nearest);
    expect(nearest).toBe(station);

    let scooter: Scooter;

    if (!nearest) {
      return;
    }

    // Testing discharging
    scooter = user.hireFrom(nearest);

    expect(scooter.batteryLevel).toBe(100);

    //wait 0.2 secs (or 0.2 hours)
    await new Promise(res => setTimeout(res, 200));
    expect(scooter.batteryLevel).toBeLessThan(100);
    nearest.dock(user);
  });

  it("the user can return the scooter to a station, and money will be taken form user's account", async () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);
    const user = new User('test', 48930242, new Location());

    const prevBalance = user.balance;
    user.hireFrom(station);
    await new Promise(res => setTimeout(res, 200));
    user.dock(station);

    expect(user.balance).toBeLessThan(prevBalance);
  });

  it('the user cannot hire if they have no balance', () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);
    const user = new User('test', 48930242, new Location(), 0);

    expect(() => user.hireFrom(station)).toThrow();
  });

  it('the user can mark a scooter as broken, (and can contact team to get a refund NYI)', () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);
    const user = new User('test', 48930242, new Location());

    user.hireFrom(station);

    user.dock(station);

    user.markPrevScooterBroken();

    const nearest = user.findNearestAvailableStation();
    expect(nearest).toBe(false);
  });
});
