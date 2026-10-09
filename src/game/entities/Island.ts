import { Container, Graphics } from 'pixi.js';
export class Island {
  public view: Container; public radius: number;
  constructor(x: number, y: number, radius: number) {
    this.view = new Container(); this.view.x = x; this.view.y = y; this.radius = radius;
    const g = new Graphics(); g.circle(0, 0, radius).fill(0xD2B48C); this.view.addChild(g);
  }
}