import { EventEmitter } from 'node:events';

/**
 * Simply a physical {@link Scooter}. Has no knowledge of a {@link User} or {@link Dockingstation}
 */
export class Scooter {
  // Static
  static all: Scooter[] = [];

  static removeAll() {
    Scooter.all = [];
  }

  // Public
  public id = Scooter.all.length;
  public batteryDischargeRate = 50;

  // Private
  private _batteryPercent = 100;
  private _isBroken = false;
  private _isBeingFixed = false;
  private _isCharging = false;
  private _isHired = false;
  public _isAvailable = true;

  /**
   * An internal emitter which the {@link DockingStation} can listen to by proxying the {@link on}, {@link once}, and {@link on}
   */
  private emitter = new EventEmitter();
  /**
   * A promise which tracks the status of the active {@link charge} task.
   * @example
   * ```
   * let p1 = anyScooter.charge()
   * let p2 = anyScooter.charge()
   * // These statements return the same promise
   * ```
   */
  private chargingPromise: Promise<void> = new Promise(res => res());
  /**
   * @see {@link chargingPromise} for the same implementation, but with charging.
   */
  private fixingPromise: Promise<void> = new Promise(res => res());

  // Constructor
  constructor() {
    Scooter.all.push(this);
  }

  // Proxies for emitter
  emit(event: string) {
    this.emitter.emit(event);
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void) {
    this.emitter.on(eventName, listener);
  }

  once(eventName: string | symbol, listener: (...args: any[]) => void) {
    this.emitter.on(eventName, listener);
  }

  off(eventName: string | symbol, listener: (...args: any[]) => void) {
    this.emitter.off(eventName, listener);
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

  get isHired() {
    return this._isHired;
  }

  set isHired(hired) {
    this._isHired = hired;
    if (hired) {
      this.discharge();
    }
    this.updateAvailability();
  }

  /**
   * Whether the scooter is at a station, charged, and not broken.
   */
  get isAvailable() {
    return this._isAvailable;
  }

  set isAvailable(available) {
    this._isAvailable = available;
    available ? this.emit('available') : this.emit('unavailable');
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
   * A function which can be called to charge the Scooter. This will set {@link chargingPromise}, and then return it.
   *
   * If the scooter is already charging, the current {@link chargingPromise} will simply be returned.
   *
   */
  charge(): Promise<void> {
    if (!this._isCharging) {
      this._isCharging = true;

      this.chargingPromise = new Promise(resolve => {
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

      this.fixingPromise = new Promise(resolve => {
        setTimeout(() => {
          this.isBroken = false;
          resolve();
        }, Math.random() * 5000);
      });
    }
    return this.fixingPromise;
  }

  /**
   * A recursive promise which removes some battery level while the scooter is hired. Works by recursively calling a setTimeout() on itself
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
          if (this.batteryPercent > 1) {
            this.batteryPercent -= 5;
            dischargeBy5();
          }
        }, interval);
      }
    };
    dischargeBy5();
  }
}
