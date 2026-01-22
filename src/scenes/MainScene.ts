import { Application, Sprite, Graphics, Assets, Rectangle, BlurFilter, BitmapText, Container} from 'pixi.js';
import gsap from 'gsap';
import SpineAnimation from '../helpers/SpineAnimation';

import eventsSystem from '../utils/EventsSystem';
import sound from '../utils/Sound';
import PlaneBasicAnimations from '../utils/PlaneBasicAnimations';
export default class MainScene extends Container{
    private _active: boolean = true;
    private _isPaused: boolean = false;
    private _spineTest!: SpineAnimation;

    constructor(app: Application) {
        super();
        this._create();
        this._addEvents();
        app.stage.addChild(this);
    }

    private _addEvents(): void {
        
    }

    private _create(): void {

        const bacground = new Graphics().rect(0, 0, window.innerWidth, window.innerHeight).fill(0x87ceeb);
        this.addChild(bacground);

        console.log(window.innerHeight, window.innerWidth);
        const circle = new Graphics().circle(400, 300, 100).fill(0xff0000);
        this.addChild(circle);

        this._spineTest = new SpineAnimation(400, 600, {skeleton: 'pretty_woman_json', atlas: "pretty_woman_atlas"}, true);
        this._spineTest.playAnimation('happy_food', true);
        this.addChild(this._spineTest);

        console.log(this._spineTest.getAnimations());
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