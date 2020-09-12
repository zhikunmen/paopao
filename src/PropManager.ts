
class PropManager extends egret.EventDispatcher {
    public static PROP_ON: string = "PROP_ON";//
    public static PROP_OFF: string = "PROP_OFF";//

    public static CHANGE: string = 'change';
    public static PROP_LASER: string = "prop_jiguan";//激光道具
    public static PROP_RAINBOW: string = "prop_rainbow";//彩虹道具
    public static PROP_BOOM: string = "boom";//炸弹道具
    public static PROP_tonghang: string = "prop_xiaohang";//同行道具

    public propMode: string = "";
    public crushes: CrushedCells = null;
    public matchRainbow: number[] = [];

    public rainbowCount:number = -1;
    public raserCount:number = -1;
    public tonghangCount:number = -1;

    private static s_instance: PropManager;
    public static getInstance(): PropManager {
        if (PropManager.s_instance == null) {
            PropManager.s_instance = new PropManager();
        }
        return PropManager.s_instance;
    }

    /**
     * 在激光道具模式下发射球
     */
    public async shootLaser(parent: MainView) {
        parent.enabled = false;
        this.propContainer.removeChildren();
        parent.controlSprite.clearRayPoints();
        let rays = parent.container.reflectRays();
        let intersections: number[] = parent.container.propLaserIntersection(rays[0]);
        egret.log("---- jiguan ---", intersections);
        BaskectBallManager.getInstance().score += _.unique(intersections).length * 10;
        await this.drawLaserLine(rays);
        await parent.meshSprite.renderCrushIndex(intersections);
        let dropingIndices: number[] = parent.mesh.dropingIndices(intersections);

        BaskectBallManager.getInstance().score += _.unique(dropingIndices).length * 20;
        parent.meshSprite.renderDroping(dropingIndices);
        this.closePropMode();
        this.subLimit(PropManager.PROP_LASER);
        parent.enabled = true;

    }

    /**
     * 在彩虹道具模式下发射球
     */
    public async shootRainBow(parent: MainView) {
        parent.enabled = false;
        this.propContainer.removeChildren();
        parent.controlSprite.clearRayPoints();
        let intersections: number[] = this.matchRainbow;
        egret.log(intersections);
        BaskectBallManager.getInstance().score += _.unique(intersections).length * 10;
        SoundMgr.getInstance().playRainbow();
        await parent.meshSprite.renderCrushIndex(intersections, "caihong_xiaochu");
        let dropingIndices: number[] = parent.mesh.dropingIndices(intersections);

        BaskectBallManager.getInstance().score += _.unique(dropingIndices).length * 20;
        parent.meshSprite.renderDroping(dropingIndices);
        this.closePropMode();
        this.subLimit(PropManager.PROP_RAINBOW);
        parent.enabled = true;
    }

    /**
    * 在消同行道具模式下发射球
    */
    public async shootTonghang(parent: MainView) {
        parent.enabled = false;
        this.propContainer.removeChildren();
        parent.controlSprite.clearRayPoints();
        let intersections: number[] = this.matchRainbow;
        intersections.filter((val: number) => {
            return parent.mesh.cell(val).color != -1;
        })
        egret.log(intersections);
        BaskectBallManager.getInstance().score += _.unique(intersections).length * 10;
        SoundMgr.getInstance().playRainbow();
        await parent.meshSprite.renderCrushIndex(intersections, "xiaochu_yihang");
        let dropingIndices: number[] = parent.mesh.dropingIndices(intersections);
        parent.meshSprite.renderDroping(dropingIndices);

        BaskectBallManager.getInstance().score += _.unique(dropingIndices).length * 20;
        this.closePropMode();
        this.subLimit(PropManager.PROP_tonghang);
        parent.enabled = true;
    }


    private async drawLaserLine(rays: sharp.Ray[]) {
        return new Promise((resolve) => {
            let laserView: LaserIineView = new LaserIineView(rays);
            this.propContainer.addChild(laserView);
            SoundMgr.getInstance().playLaser();
            egret.setTimeout(() => {
                laserView.parent && laserView.parent.removeChild(laserView);
                resolve();
            }, this, 800);
        })
    }

    public openPropMode(mode: string = ""): void {
        if (this.checkPropLimit(mode)) {
            this.propMode = mode;
            this.dispatchEvent(new egret.Event(PropManager.CHANGE));
        }
    }

    public closePropMode(): void {
        this.propMode = "";
        this.crushes = null;
        this.propContainer.removeChildren();
        this.dispatchEvent(new egret.Event(PropManager.PROP_OFF));
    }

    private _propContainer: eui.Group;
    public get propContainer(): eui.Group {
        if (!this._propContainer) {
            this._propContainer = new eui.Group();
            this._propContainer.height = 1334;
            this._propContainer.verticalCenter = 0;
            this._propContainer.touchEnabled = false;

        }
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(this._propContainer);
        return this._propContainer;
    }

    /**
     * 画圆
     */
    public drawCircle(container: MeshContainer, indexs: number[]) {
        this.propContainer.removeChildren();
        for (let i = 0; i < indexs.length; i++) {
            let ball: eui.Image = new eui.Image("propselected_png");
            ball.alpha = .5;
            ball.width = ball.height = 68;
            ball.anchorOffsetX = 34;
            ball.anchorOffsetY = 34;
            ball.x = container.getCirclePos(indexs[i]).x;
            ball.y = container.getCirclePos(indexs[i]).y;
            this.propContainer.addChild(ball);
        }
    }

    /**
     * 复位道具使用
     */
    public resetUseLimit(): void {
        // if(!LocalStorageController.getInstance().propRaserCount){
        //     LocalStorageController.getInstance().propRaserCount = 2;
        // }
        // if(!LocalStorageController.getInstance().propRainbowCount){
        //     LocalStorageController.getInstance().propRainbowCount = 2;
        // }
    }

    public getUseLimit(type: string): number {
        if (type == PropManager.PROP_RAINBOW) {
            return LocalStorageController.getInstance().propRainbowCount;
        } else if (type == PropManager.PROP_LASER) {
            return LocalStorageController.getInstance().propRaserCount;
        } else if (type == PropManager.PROP_tonghang) {
            return LocalStorageController.getInstance().propTonghangCount;
        }
    }

    /**
     * 能不能使用道具
     */
    public checkPropLimit(type: string): boolean {
        if (this.propMode == type) {
            return;
        }
        if (type == PropManager.PROP_RAINBOW) {
            if (LocalStorageController.getInstance().propRainbowCount <= 0) {
                return false;
            }
        } else if (type == PropManager.PROP_LASER) {
            if (LocalStorageController.getInstance().propRaserCount <= 0) {
                return false;
            }
        } else if (type == PropManager.PROP_tonghang) {
            if (LocalStorageController.getInstance().propTonghangCount <= 0) {
                return false;
            }
        }
        return true;
    }

    public addLimit(type: string, force: boolean = false): void {
        if (type == PropManager.PROP_RAINBOW) {
            if (!force) {
                if (LocalStorageController.getInstance().propRainbowCount == 0) {
                    LocalStorageController.getInstance().propRainbowCount += 1;
                }
            } else {
                LocalStorageController.getInstance().propRainbowCount += 1;
            }
        } else if (type == PropManager.PROP_LASER) {
            if (!force) {
                if (LocalStorageController.getInstance().propRaserCount == 0) {
                    LocalStorageController.getInstance().propRaserCount += 1;
                }
            } else {
                LocalStorageController.getInstance().propRaserCount += 1;
            }
        } else if (type == PropManager.PROP_tonghang) {
            if (!force) {
                if (LocalStorageController.getInstance().propTonghangCount == 0) {
                    LocalStorageController.getInstance().propTonghangCount += 1;
                }
            } else {
                LocalStorageController.getInstance().propTonghangCount += 1;
            }
        }
        this.dispatchEvent(new egret.Event(PropManager.CHANGE));
    }

    public subLimit(type: string): void {
        if (type == PropManager.PROP_RAINBOW) {
            if (LocalStorageController.getInstance().propRainbowCount > 0) {
                LocalStorageController.getInstance().propRainbowCount -= 1;
            }
        } else if (type == PropManager.PROP_LASER) {
            if (LocalStorageController.getInstance().propRaserCount > 0) {
                LocalStorageController.getInstance().propRaserCount -= 1;
            }
        } else if (type == PropManager.PROP_tonghang) {
            if (LocalStorageController.getInstance().propTonghangCount > 0) {
                LocalStorageController.getInstance().propTonghangCount -= 1;
            }
        }
        this.dispatchEvent(new egret.Event(PropManager.CHANGE));
    }

    public getSourceByType(type: string): string {
        if (PropManager.PROP_LASER == type) {
            return "prop_jiguan_png"
        } else if (PropManager.PROP_RAINBOW == type) {
            return "prop_rainbow_png"
        } else if (PropManager.PROP_tonghang == type) {
            return "prop_xiaohang_png"
        }
        return "";
    }

    public getPosByType(type: string): egret.Point {
        if (PropManager.PROP_LASER == type) {
            return new egret.Point(556.5, 295.5);
        } else if (PropManager.PROP_RAINBOW == type) {
            return new egret.Point(556.5, 187.5);
        } else if (PropManager.PROP_tonghang == type) { //暂时先这样写
            return new egret.Point(554.5, -274.5);
        }
    }



    public getRandomType(): string {
        if (Math.random() < 0.1) {
            return PropManager.PROP_LASER;
        } else if (Math.random() < 0.2) {
            return PropManager.PROP_tonghang;
        }
        return PropManager.PROP_RAINBOW;

// 彩虹道具被隐藏，获取道具的概率需要调整
        // if (Math.random() < 0.2) {
        //     return PropManager.PROP_LASER;
        // } else {
        //     return PropManager.PROP_tonghang;
        // }
    }
}