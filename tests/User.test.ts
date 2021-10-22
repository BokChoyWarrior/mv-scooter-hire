import { Location } from '../src/Location';
import { Person } from '../src/Person';
import { User } from '../src/User';
import { DockingStation } from '../src/DockingStation';
import { Scooter } from '../src/Scooter';

function teardownMockEnvironment() {
  Scooter.removeAll();
  User.removeAll();
  DockingStation.removeAll();
}

describe('the User (and Person) class', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    teardownMockEnvironment();
    jest.useRealTimers();
  });

  it('can register', () => {
    let person = new Person('harv', 55, new Location());
    let user = person.register();
    expect(user).toBeInstanceOf(User);
  });

  it('underage users cannot register', () => {
    let underage = new Person('person 2', 5, new Location());
    expect(() => underage.register()).toThrowError();
  });

  it('can hire/dock a scooter', async () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    const user = new User('1', 100, new Location());
    station.dock(s1);

    const nearest = user.findNearestAvailableStation();
    expect(nearest).toBe(station);

    let scooter: Scooter;

    if (!nearest) {
      return;
    }

    // Testing discharging
    scooter = user.hireFrom(nearest);

    expect(scooter.batteryPercent).toBe(100);

    //wait 0.2 secs (or 0.2 hours)
    jest.advanceTimersByTime(2000);
    expect(scooter.batteryPercent).toBeLessThan(100);
    user.dock(nearest);
  });

  it("can return the scooter to a station, and money will be taken form user's account", async () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);
    const user = new User('test', 48930242, new Location());

    const prevBalance = user.balance;
    user.hireFrom(station);
    jest.advanceTimersByTime(1000);
    user.dock(station, false);

    expect(user.balance).toBeLessThan(prevBalance);
  });

  it('cannot hire if they have no balance', () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);
    const user = new User('test', 48930242, new Location(), 0);

    expect(() => user.hireFrom(station)).toThrow();
  });

  it('cannot hire if they already have a scooter', () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    const s2 = new Scooter();
    station.dock(s1);
    station.dock(s2);
    const user = new User('test', 48930242, new Location());
    user.hireFrom(station);
    expect(() => user.hireFrom(station)).toThrow();
  });
  it('the user can mark a scooter as broken, (and can contact team to get a refund NYI)', () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);
    const user = new User('test', 48930242, new Location());

    user.hireFrom(station);

    user.dock(station, true);

    const nearest = user.findNearestAvailableStation();
    expect(nearest).toBe(false);
  });

  it("the user cannot dock a scooter if they don't have one", () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    const user = new User('test', 48930242, new Location());

    expect(() => user.dock(station, false)).toThrowError();
  });

  it('the user cannot hire from a station with no scooters', () => {
    const station = new DockingStation(new Location());
    const user = new User('test', 48930242, new Location());

    expect(() => user.hireFrom(station)).toThrowError();
  });
});
