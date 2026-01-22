import gsap from "gsap";
import { Container, Sprite, Graphics } from "pixi.js";

export default class PlaneBasicAnimations {
    static _lastScale: { x: number; y: number; };
    static animateButton(buttonContainer: Container | Sprite, callback?: () => void,reactivateButton = false): void {
        buttonContainer.eventMode = "none";
        gsap.to(buttonContainer.scale, {
            x: buttonContainer.scale.x * 0.7,
            y: buttonContainer.scale.y * 0.7,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "linear",
            onComplete: () => {
                gsap.to(buttonContainer.scale, {
                    x: buttonContainer.scale.x * 0.9,
                    y: buttonContainer.scale.y * 0.9,
                    duration: 0.075,
                    yoyo: true,
                    repeat: 1,
                    ease: "linear",
                    onComplete: () => {
                        if (reactivateButton) buttonContainer.eventMode = "static";
                        callback?.();
                    },
                });
            },
        });
    }
    
    static popObject(object: Container | Sprite, callback?: ()=> void): void {
        object.scale.x == 0 && object.scale.set(1);
        object.alpha == 0 && (object.alpha = 1);
        gsap.from(object.scale, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "back.out",
            onComplete: () => { callback?.(); }
        });
    }

    static unpopObject(object: Container | Sprite): void {
        const originalScale = object.scale.x;
        gsap.to(object.scale, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "back.in",
            onComplete: () => {
                object.alpha = 0;
                object.scale.set(originalScale);
            }
        });
    }

    static fadeOut(object: Container | Sprite | Graphics, duration = 0.4): void {
        gsap.to(object, {
            alpha: 0,
            duration,
            ease: "linear",
        });
    }

    static fadeIn(object: Container | Sprite | Graphics, duration = 0.4): void {
        gsap.to(object, {
            alpha: 1,
            duration,
            ease: "linear",
        });
    }

    static wiggleObject(object: Container | Sprite, duration = 0.4): void {
        gsap.to(object.scale, {
            x: object.scale.x * 1.1,
            y: object.scale.y * 1.1,
            duration,
            ease: "linear",
            yoyo: true,
            repeat: 1,
        });
    }

    static shake(object: Container | Sprite, intensity = 15, duration = 0.25, repeatTimes = 5): void {
        const initialAngle = object.angle;
        gsap.to(object, {
            angle: initialAngle + intensity,
            duration: duration,
            ease: "linear",
            yoyo: true,
            repeat: repeatTimes,
            onComplete: () => {
                object.angle = initialAngle;
            }
        });
    }

    static pulse(object: Container | Sprite, scaleFactor = 1.1, duration = 0.5): void {
        this._lastScale = { x: object.scale.x, y: object.scale.y };
        gsap.to(object.scale, {
            x: object.scale.x * scaleFactor,
            y: object.scale.y * scaleFactor,
            duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });
    }

    static stopPulse(object: Container | Sprite): void {
        gsap.killTweensOf(object.scale);
        if (this._lastScale)
            object.scale.set(this._lastScale.x, this._lastScale.y);
    }

    static comeFromTop(object: Container | Sprite, duration = 0.4): void {
        gsap.from(object, {
            y: -object.height,
            duration,
            ease: "back.out",
        });
    }

    static hideToTop(object: Container | Sprite, duration = 0.4): void {
        gsap.to(object, {
            y: -object.height,
            duration,
            ease: "back.in",
        });
    }

    static moveTo(object: Container | Sprite, x: number, y: number, duration = 0.5, callback?: () => void): void {
        gsap.to(object, {
            x,
            y,
            duration,
            ease: "back.out",
            onComplete: () => {
                callback?.();
            },
        });
    }

    static disappear(object: Container | Sprite, duration = 0.4): void {
        const originalScale = { x: object.scale.x, y: object.scale.y };
        gsap.to(object.scale, {
            x: originalScale.x * 1.2,
            y: originalScale.y * 1.2,
            duration,
            ease: "linear",
            onComplete: () => {
                object.scale.set(originalScale.x, originalScale.y);
            }
        });

        gsap.to(object, {
            alpha: 0,
            duration,
            ease: "linear",
        });
    }
}
