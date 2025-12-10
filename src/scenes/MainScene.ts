import { Application, Sprite, Graphics, Assets, Rectangle, BlurFilter, BitmapText, Container} from 'pixi.js';
import gsap from 'gsap';

import eventsSystem from '../utils/EventsSystem';
import sound from '../utils/Sound';
import PlaneBasicAnimations from '../utils/PlaneBasicAnimations';
export default class MainScene extends Container{
    private _active: boolean = true;
    private _isPaused: boolean = false;

    constructor(app: Application) {
        super();
        this._create();
        this._addEvents();
    }

    private _addEvents(): void {
        
    }

    private _create(): void {

    }

    public pause(): void {
        this._isPaused = true;
    }

    public resume(): void {
        this._isPaused = false;
    }

    public resize(width: number, height: number): void {

        
    }

    public get active(): boolean {
        return this._active;
    }
}