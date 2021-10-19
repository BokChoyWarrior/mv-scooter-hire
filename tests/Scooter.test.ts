import { Scooter } from '../src/Scooter';
import { DockingStation } from '../src/DockingStation';
import { User } from '../src/User';
import { Location } from '../src/Location';
import { teardownMockEnvironment } from '.';

describe('the Scooter class', () => {
  afterEach(teardownMockEnvironment);

  it('should charge properly', () => {
    const scooter = new Scooter();
    expect(scooter.batteryLevel).toBe(100);

    scooter.batteryLevel = 1;
    expect(scooter.batteryLevel).toBe(1);
    expect(scooter.isAvailable).toBe(false);

    const promiseA = scooter.charge();
    const promiseB = scooter.charge();
    expect(promiseA).toBe(promiseB); // We use toBe() to check reference, not value

    // WORKS
    return scooter
      .charge()
      .then(() => {
        expect(scooter.batteryLevel).toBe(100);
        expect(scooter.isAvailable).toBe(true);
      })
      .catch();

    // Also works :)
    // await scooter.charge();
    // expect(scooter.batteryLevel).toBe(100);
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

    return scooter
      .fix()
      .then(() => {
        expect(scooter.isBroken).toBe(false);
        expect(scooter.isAvailable).toBe(true);
      })
      .catch();
  });

  it('should set itself available when charged and fixed', async () => {
    let scooterAlerter = new Scooter();
    scooterAlerter.isBroken = true;
    scooterAlerter.batteryLevel = 0;

    // Assign an event listener for the scooter to tell us when it's available
    scooterAlerter.once('available', () => {
      expect(!!scooterAlerter.batteryLevel && !scooterAlerter.isBroken).toBe(true);
      expect(scooterAlerter.isAvailable).toBe(true);
    });

    // Make sure scooter unavailable
    expect(scooterAlerter.isAvailable).toBe(false);
    let p1 = scooterAlerter.fix();
    let p2 = scooterAlerter.charge();
    // Once both these promises resolve, the event should have already fired and called callback above, so test should pass.
    await Promise.all([p1, p2]);
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

    expect(scooter.batteryLevel).toBe(100);

    //wait 0.2 secs (or 0.2 hours)
    await new Promise(res => setTimeout(res, 200));
    expect(scooter.batteryLevel).toBeLessThan(100);
    nearest.dock(user);

    // wait for charge
    await new Promise(res => setTimeout(res, 2000));
    expect(scooter.batteryLevel).toBe(100);
  });

  test('the scooter should not pass 0 battery level', async () => {
    const station = new DockingStation(new Location());
    const s1 = new Scooter();
    station.dock(s1);
    const user = new User('test', 48930242, new Location());

    s1.batteryDischargeRate = 1000;
    user.hireFrom(station);
    await new Promise(res => setTimeout(res, 500));

    expect(s1.batteryLevel).toBe(0);
  });
});
