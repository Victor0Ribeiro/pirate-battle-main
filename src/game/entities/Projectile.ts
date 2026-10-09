import { Container, Graphics } from 'pixi.js';
export class Projectile {
  public view: Container; public active: boolean = true; public isEnemy: boolean;
  private speed = 8; private lifeTime = 120;
  constructor(x: number, y: number, rotation: number, isEnemy: boolean = false) {
    this.view = new Container(); this.view.x = x; this.view.y = y; this.view.rotation = rotation; this.isEnemy = isEnemy;
    const g = new Graphics(); g.circle(0, 0, 4).fill(isEnemy ? 0xFF00FF : 0xFFFF00); this.view.addChild(g);
  }
  public update(delta: number) {
    this.view.x += Math.cos(this.view.rotation) * this.speed * delta;
    this.view.y += Math.sin(this.view.rotation) * this.speed * delta;
    this.lifeTime -= delta; if (this.lifeTime <= 0) this.active = false;
  }
}