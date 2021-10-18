export class Location {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Location): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2 + Math.pow(this.y - other.y, 2)));
  }
}
