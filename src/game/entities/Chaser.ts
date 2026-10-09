import { Container, Graphics } from 'pixi.js';
export class Chaser {
  public view: Container; public active: boolean = true; public health: number = 30; private speed = 2;
  constructor(x: number, y: number) {
    this.view = new Container(); this.view.x = x; this.view.y = y;
    const g = new Graphics(); g.rect(-15, -15, 30, 30).fill(0xFF0000); this.view.addChild(g);
  }
  public update(delta: number, pX: number, pY: number) {
    const angle = Math.atan2(pY - this.view.y, pX - this.view.x);
    this.view.rotation = angle;
    this.view.x += Math.cos(angle) * this.speed * delta;
    this.view.y += Math.sin(angle) * this.speed * delta;
  }
  public takeDamage(amount: number) { this.health -= amount; if (this.health <= 0) this.active = false; }
}