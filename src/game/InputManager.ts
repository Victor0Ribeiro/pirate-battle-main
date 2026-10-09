export class InputManager {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => { this.keys[e.code] = true; };
  private handleKeyUp = (e: KeyboardEvent) => { this.keys[e.code] = false; };

  public isKeyDown(codeOrCodes: string | string[]): boolean {
    if (Array.isArray(codeOrCodes)) {
      return codeOrCodes.some(code => this.keys[code]);
    }
    return !!this.keys[codeOrCodes];
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}