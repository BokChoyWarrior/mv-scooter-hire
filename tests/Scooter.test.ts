import { Scooter } from '../src/Scooter';
import { DockingStation } from '../src/DockingStation';
import { User } from '../src/User';
import { Location } from '../src/Location';
function teardownMockEnvironment() {
  Scooter.removeAll();
  User.removeAll();
  DockingStation.removeAll();
}

describe('the Scooter class', () => {
  afterEach(() => {
    jest.useRealTimers();
    teardownMockEnvironment();
  });
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should charge properly', () => {
    const scooter = new Scooter();
    expect(scooter.batteryPercent).toBe(100);

    scooter.batteryPercent = 1;
    expect(scooter.batteryPercent).toBe(1);
    expect(scooter.isAvailable).toBe(false);

    const promiseA = scooter.charge();
    const promiseB = scooter.charge();
    expect(promiseA).toBe(promiseB); // We use toBe() to check reference, not value

    // WORKS
    const promise = scooter
      .charge()
      .then(() => {
        expect(scooter.batteryPercent).toBe(100);
        expect(scooter.isAvailable).toBe(true);
      })
      .catch();

    jest.runAllTimers();
    return promise;
    // Also works :)
    // await scooter.charge();
    // expect(scooter.batteryPercent).toBe(100);
    // expect(scooter.isAvailable).toBe(true);
  });

  // This is essentially the same test as above, but for fixing rather than charging
  it('should be fix properly', () => {
    const scooter = new Scooter();
    expect(scooter.isBroken).toBe(false);

    scooter.isBroken = true;
    expect(scooter.isBroken).toBe(true);
    expect(scooter.isAvailable).toBe(false);

    // Let's test the promise feature
    scooter.isBroken = true;
    const promiseA = scooter.fix();
    const promiseB = scooter.fix();
    expect(promiseA).toBe(promiseB);

    const promise = scooter
      .fix()
      .then(() => {
        expect(scooter.isBroken).toBe(false);
        expect(scooter.isAvailable).toBe(true);
      })
      .catch();
    jest.runAllTimers();
    return promise;
  });

  it('should set itself available when charged and fixed', async () => {
    let scooterAlerter = new Scooter();
    scooterAlerter.isBroken = true;
    scooterAlerter.batteryPercent = 0;

    // Assign an event listener for the scooter to tell us when it's available
    scooterAlerter.once('available', () => {
      expect(!!scooterAlerter.batteryPercent && !scooterAlerter.isBroken).toBe(true);
      expect(scooterAlerter.isAvailable).toBe(true);
    });

    // Make sure scooter unavailable
    expect(scooterAlerter.isAvailable).toBe(false);
    let p1 = scooterAlerter.fix();
    let p2 = scooterAlerter.charge();
    // Once both these promises resolve, the event should have already fired and called callback above, so test should pass.
    const promise = Promise.all([p1, p2]);
    jest.advanceTimersByTime(5000);
    return promise;
  });

  it('should discharge while hired, and charge when docked', async () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    const user = new User('1', 100, new Location());
    station.dock(s1);

    const nearest = user.findNearestAvailableStation();
    // console.log(nearest);
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
    nearest.dock(user);

    // wait for charge
    jest.advanceTimersByTime(2000);
    expect(scooter.batteryPercent).toBe(100);
  });

  test('the scooter should not pass 0 battery level', async () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);

    const user = new User('test', 48930242, new Location());

    user.hireFrom(station);
    jest.advanceTimersByTime(5000);

    expect(s1.batteryPercent).toBe(0);
  });

  test('the scooter should not be hired after it is docked', () => {
    const user = new User('1', 50, new Location());
    const station = new DockingStation(new Location());
    const scooter = new Scooter();
    station.dock(scooter);

    expect(scooter.isHired).toBe(false);
    user.hireFrom(station);
    expect(scooter.isHired).toBe(true);
    user.dock(station, false);
    expect(scooter.isHired).toBe(false);
  });
});
