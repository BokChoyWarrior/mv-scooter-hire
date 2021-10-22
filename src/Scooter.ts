export interface Dock {
  dock(scooter: Scooter, isBroken: boolean): void;

  onNotifyAvailable(scooter: Scooter): void;

  onNotifyUnavailable(scooter: Scooter): void;
}

/**
 * When a {@link Scooter} is docked. It will have it's chargingPort attribute set to the given
 * object which implements {@link Dock}.
 *
 * The scooter will then notify it's {@link Dock} when it is available or unavailable.
 */
export default class Scooter {
  // Static
  static all: { [key: number]: Scooter } = [];

  static lastNamedScooter = 0;

  static removeAll() {
    Scooter.all = [];
  }

  // Public
  public id = Scooter.lastNamedScooter + 1;

  public batteryDischargeRate = 50;

  public chargingPort;

  // Private
  private _batteryPercent = 100;

  private _isHired = false;

  private _isBroken = false;

  private _isBeingFixed = false;

  private _isCharging = false;

  public _isAvailable = true;

  /**
   * A promise which tracks the status of the active {@link charge} task.
   * @example
   * ```
   * let p1 = anyScooter.charge()
   * let p2 = anyScooter.charge()
   * // These statements return the same promise
   * ```
   */
  private chargingPromise: Promise<void> = new Promise((res) => res());

  /**
   * @see {@link chargingPromise} for the same implementation, but with charging.
   */
  private fixingPromise: Promise<void> = new Promise((res) => res());

  // Constructor
  constructor(chargingPort: Dock | false = false) {
    Scooter.all[this.id] = this;
    this.chargingPort = chargingPort;
  }

  // Getters + setters
  get isBroken() {
    return this._isBroken;
  }

  set isBroken(broken) {
    this._isBroken = broken;
    if (!broken) {
      this._isBeingFixed = false;
    }
    this.updateAvailability();
  }

  get batteryPercent() {
    return this._batteryPercent;
  }

  set batteryPercent(level) {
    this._batteryPercent = level;
    if (level === 100) {
      this._isCharging = false;
    }
    this.updateAvailability();
  }

  get isCharging() {
    return this._isCharging;
  }

  set isCharging(charging) {
    this._isCharging = charging;
    this.updateAvailability();
  }

  get isHired() {
    return this._isHired;
  }

  set isHired(isHired: boolean) {
    this._isHired = isHired;
    if (isHired) {
      this.isCharging = false;
      this.discharge();
    }
  }

  /**
   * Whether the scooter is at a station, charged, and not broken.
   */
  get isAvailable() {
    return this._isAvailable;
  }

  set isAvailable(available) {
    this._isAvailable = available;
    if (available) {
      this.notifyAvailable();
    } else {
      this.notifyUnavailable();
    }
  }

  // Methods

  updateAvailability() {
    if (this.isHired || this.isBroken || this.batteryPercent !== 100) {
      this.isAvailable = false;
    } else {
      this.isAvailable = true;
    }
  }

  /**
   * A function which can be called to charge the Scooter. This will set {@link chargingPromise},
   * and then return it.
   *
   * If the scooter is already charging, the current {@link chargingPromise} will
   * simply be returned.
   *
   */
  charge(): Promise<void> {
    if (!this.isCharging) {
      this.isCharging = true;

      this.chargingPromise = new Promise((resolve) => {
        setTimeout(() => {
          this.batteryPercent = 100;
          resolve();
        }, (100 - this.batteryPercent) * 20);
      });
    }
    return this.chargingPromise;
  }

  /**
   * @see {@link charge}
   *
   */
  fix(): Promise<void> {
    if (!this._isBeingFixed) {
      this._isBeingFixed = true;

      this.fixingPromise = new Promise((resolve) => {
        setTimeout(() => {
          this.isBroken = false;
          resolve();
        }, Math.random() * 5000);
      });
    }
    return this.fixingPromise;
  }

  /**
   * A recursive promise which removes some battery level while the scooter is hired. Works by
   * recursively calling a setTimeout() on itself
   *
   * Runs while {@link isHired} is `true`
   *
   * If you wish to change the rate of discharge, please change {@link batteryDischargeRate}
   */
  async discharge() {
    const interval = (1000 / this.batteryDischargeRate) * 5;
    const dischargeBy5 = async () => {
      if (this.isHired) {
        setTimeout(() => {
          if (this.batteryPercent > 1 && this.isHired) {
            this.batteryPercent -= 5;
            dischargeBy5();
          }
        }, interval);
      }
    };
    dischargeBy5();
  }

  dock(station: Dock, isBroken: boolean = false) {
    this.isBroken = isBroken;
    this.isHired = false;
    this.chargingPort = station;
    this.chargingPort.dock(this, isBroken);
    this.charge();
  }

  notifyAvailable() {
    if (!this.chargingPort) {
      return;
    }
    this.chargingPort.onNotifyAvailable(this);
  }

  notifyUnavailable() {
    if (!this.chargingPort) {
      return;
    }
    this.chargingPort.onNotifyUnavailable(this);
  }
}
