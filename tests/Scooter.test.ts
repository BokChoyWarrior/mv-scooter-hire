import { Scooter } from '../src/Scooter';

describe('the Scooter class', () => {
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
});
