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

    const promise = scooter
      .charge()
      .then(() => {
        expect(scooter.batteryPercent).toBe(100);
        expect(scooter.isAvailable).toBe(true);
      })
      .catch();

    jest.advanceTimersByTime(10000);
    return promise;
  });

  // This is essentially the same test as above, but for fixing rather than charging
  it('should be fixed properly', () => {
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
    const station = new DockingStation(new Location());
    const scooter = new Scooter();
    scooter.batteryPercent = 0;
    scooter.isBroken = true;

    // Dock the broken scooter
    station.dock(scooter, true);

    // Assign an event listener for the scooter to tell us when it's available
    let availableFired = false;
    scooter.once('available', () => {
      expect(!!scooter.batteryPercent && !scooter.isBroken).toBe(true);
      expect(scooter.isAvailable).toBe(true);
      availableFired = true;
    });

    // Make sure scooter unavailable
    let p1 = scooter.fix();
    let p2 = scooter.charge();
    // Once both these promises resolve, the event should have already fired and called callback above, so test should pass.
    const promise = Promise.all([p1, p2]);
    jest.advanceTimersByTime(5000);

    // making sure that the event fired
    expect(availableFired).toBe(true);
    return promise;
  });

  it('should charge while docked', () => {
    const station = new DockingStation(new Location());
    const scooter = new Scooter();

    scooter.batteryPercent = 1;

    jest.advanceTimersByTime(1000);
    expect(scooter.batteryPercent).toBe(1);

    station.dock(scooter);
    jest.advanceTimersByTime(10000);
    expect(scooter.batteryPercent).toBe(100);
  });

  it('should discharge while hired', async () => {
    const station = new DockingStation(new Location());
    const scooter = new Scooter();
    const user = new User('1', 100, new Location());
    station.dock(scooter);
    const hiredScooter = user.hireFrom(station);

    expect(hiredScooter.batteryPercent).toBe(100);

    jest.advanceTimersByTime(10000);
    expect(hiredScooter.batteryPercent).toBeLessThan(100);

    user.dock(station, false);

    jest.advanceTimersByTime(10000);
    expect(hiredScooter.batteryPercent).toBe(100);
  });

  test('should not pass 0 battery level', async () => {
    const station = new DockingStation(new Location());
    const scooter = new Scooter();
    const user = new User('test', 48930242, new Location());

    station.dock(scooter);
    user.hireFrom(station);

    jest.advanceTimersByTime(5000);

    expect(scooter.batteryPercent).toBe(0);
  });

  it('should not be hired after it is docked', () => {
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

  it('should not discharge while docked, even if asked', async () => {
    const station = new DockingStation(new Location());
    const scooter = new Scooter();
    station.dock(scooter);

    scooter.discharge();
    // wait half an hour to see
    jest.advanceTimersByTime(500);

    expect(scooter.batteryPercent).toBe(100);
  });
});
