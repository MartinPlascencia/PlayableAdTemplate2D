import { Container, Graphics, Application } from "pixi.js";
import gsap from "gsap";
import eventsSystem from "../utils/EventsSystem";
export default class Effects extends Container {
    private _fade!: Graphics;
    constructor(app: Application) {
        super();
        this._createFade(app);
        app.stage.addChild(this);
        this._addEvents();
    }

    private _addEvents(): void {
        eventsSystem.on('fadeIn', this.fadeIn.bind(this));
        eventsSystem.on('fadeOut', this.fadeOut.bind(this));
        eventsSystem.on('fadeInOut', this.fadeInOut.bind(this));
    }

    private _createFade(app: Application): void {
        const fade = new Graphics().rect(0, 0, app.screen.width, app.screen.height).fill(0xffffff);
        this.addChild(fade);
        fade.alpha = 0;
        this._fade = fade;
    }

    public fadeOut(duration: number = 0.4, callback: (() => void) | undefined = undefined): void {
        gsap.to(this._fade, { 
            alpha: 1, 
            duration: duration, 
            ease: 'linear',
            onComplete: () => {
                if (callback !== undefined) {
                    callback();
                }
            }
        });
    }

    public fadeIn(duration: number = 0.4): void {
        this._fade.alpha = 1;
        gsap.to(this._fade, { alpha: 0, duration: duration, ease: 'linear' });
    }

    public fadeInOut(duration: number = 0.4, delay: number = 0, callback: (() => void) | undefined = undefined): void {
        gsap.delayedCall(delay, () => {
            this.fadeOut(duration, () => {
                this.fadeIn(duration);
                if (callback !== undefined) {
                    callback();
                }
            });
        });
    }
    
    public resize(width: number, height: number): void {
        this._fade.clear().rect(0, 0, width, height).fill(0xffffff);
    }
}