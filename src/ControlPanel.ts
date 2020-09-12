class ControlPanel extends core.EUIComponent {
    public container: MeshContainer;
    private jetSprite: egret.Sprite;
    private perAngle: number;
    private rayPoints: any[] = [];
    private raySprite: egret.Shape;
    private prepareSprite: PrepareSprite;
    private rayPointContainer: egret.Sprite;

    private rayPoint: eui.Image;

    constructor(container: MeshContainer, prepareSprite: PrepareSprite) {
        super();
        this.container = container;
        this.prepareSprite = prepareSprite;
        for (let i = 0; i < 20; i++) {
            core.CachePool.addObj("rayPoint", new eui.Image(`ballline_1_png`));
        }
    }

    /**
     * 添加监听
     */
    protected addListener(): void {
        // core.TimerManager.instance.addTick(16, -1, this.addTweens, this);
        this.addTweens();
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
        core.TimerManager.instance.removeTicks(this);
    }

    private _timer: number = 0;
    private evenObj = 1.7
    private oddObj = 0.9;
    private addTweens() {
        egret.Tween.get(this, {
            loop: true, onChange: () => {
                for (let i = 0; i < this.rayPointContainer.numChildren; i++) {
                    let rayP = this.rayPointContainer.getChildAt(i) as eui.Image;
                    if (rayP.y <= -900) {
                        continue;
                    }
                    if (i % 2) {
                        rayP.scaleX = rayP.scaleY = this.oddObj;
                    } else {
                        rayP.scaleX = rayP.scaleY = this.evenObj;
                    }

                }
            }, onChangeObj: this
        }).call(() => {
            this.evenObj = 1.7,
                this.oddObj = 0.9
        }).to({
            evenObj: 0.9,
            oddObj: 1.7
        }, 800).to({
            evenObj: 1.7,
            oddObj: 0.9
        }, 600)
    }
    private obj = { speed: 0 };
    private _v: number;
    public set shootAngle(v: number) {
        this._v = v;
        this.obj = {
            speed: this.container.shootAngle
        }
        egret.Tween.removeTweens(this.obj)
        if (v == -1) {
            this.clearRay();
            return;
        }
        if (v < 190)
            v = 190;
        else if (v > 350)
            v = 350;
        // console.log(v);
        this.container.shootAngle = v;
        this.drawRay();
        return;
        let self = this;
        egret.Tween.get(this.obj, {
            onChange: () => {
                self.container.shootAngle = this.obj.speed;
                egret.log(this.obj.speed, v, this._v);
                if (this._v == -1) {
                    this.clearRay();
                } else {
                    // console.log("----chixu")
                    self.drawRay();
                }
            }
        }).to({
            speed: v
        }, Math.abs(this.container.shootAngle - v), egret.Ease.sineInOut).call(() => {
            if (this._v == -1) {
                this.clearRay();
            }
        })
    }


    public get shootAngle(): number {
        return this.container.shootAngle;
    }


    private dd: egret.Shape;
    public async renderShooting(prepareBubble: BubbleUI, traces: sharp.Point[],firstPoint:sharp.Point) {
        let duration = (p1: sharp.Point, p2: sharp.Point) => {
            return parseInt(sharp.distance(p1, p2) / BaskectBallManager.getInstance().dddd + ""); // 1px per 1ms 2.5
        }
        traces[traces.length - 1] = firstPoint;
        let ts = [...traces];
        let lastPoint = ts.shift();
        SoundMgr.getInstance().playFantan();
        let totalTime: number = 0;
        let curTimer: number = egret.getTimer();
        await new Promise(reslove => {
            totalTime += 100;
            egret.Tween.get(prepareBubble)
                .to({
                    x: lastPoint.x,
                    y: lastPoint.y
                }, 100).call(() => {
                    reslove();
                });
        })
        for (let trace of ts) {
            await new Promise(reslove => {
                let d = duration(trace, lastPoint);
                totalTime += d;
                egret.Tween.get(prepareBubble).to({
                    x: trace.x,
                    y: trace.y
                }, d, egret.Ease.sineIn).call(() => {
                    reslove();
                });
                lastPoint = trace;
            })
        }
        let d = totalTime - egret.getTimer() + curTimer;
        await new Promise(reslove => {
            egret.Tween.get(prepareBubble).to({
                x: lastPoint.x,
                y: lastPoint.y
            }, d, egret.Ease.sineIn).call(() => {
                reslove();
            });
        })

        // if (!this.dd) {
        //     this.dd = new egret.Shape();
        // }
        // this.dd.graphics.clear();
        // this.dd.graphics.beginFill(0xccc);
        // this.dd.graphics.drawCircle(lastPoint.x, lastPoint.y, 34);
        // this.dd.graphics.endFill();
        // prepareBubble.parent.addChild(this.dd);
    }

    private localStageY(stageY: number): number {
        return stageY - (GameConfig.curHeight() / 2 - 1334 / 2)
    }

    protected onShow(event?: egret.Event): void {
        super.onShow(event);

        let raySprite = new egret.Shape();
        raySprite.x = 0;
        raySprite.y = 0;
        raySprite.width = this.stage.stageWidth;
        raySprite.height = this.stage.stageHeight;
        this.stage.addChild(raySprite);
        this.raySprite = raySprite;

        this.rayPointContainer = new egret.Sprite();
        this.addChild(this.rayPointContainer);
        this.rayPointContainer.touchEnabled = false;
        this.rayPointContainer.touchChildren = false;
    }
    private s: egret.Shape;
    private tempP1: egret.Point = new egret.Point();
    private tempP2: egret.Point = new egret.Point();

    private _drawRayTimeout:number = -1;
    private drawRay() {
        let self = this;
        clearTimeout(this._drawRayTimeout);
        if(BaskectBallManager.getInstance().isTouching){
            // egret.log("-----定时器不停增加")
            this._drawRayTimeout = setTimeout(()=>{
                // console.log("huaxian -----")
                self.drawRay();
            }, 16);
        }else{
            clearTimeout(this._drawRayTimeout);
            this._drawRayTimeout = -1;
            this.clearRayPoints();
            return;
        }

        if (PropManager.getInstance().propMode == PropManager.PROP_LASER) {
            this.drawRayPropLaser();
            return;
        }

        // let p1 = this.container.localToGlobal(0, 0);
        // this.raySprite.graphics.clear();
        // this.raySprite.graphics.lineStyle(1, 0xffffff);
        // this.raySprite.graphics.drawRect(p1.x, p1.y, this.container.rect.width, this.container.rect.height);
        // this.raySprite.graphics.lineStyle(1, 0xffffff);

        // let lastPoint1 = this.container.jetPoint;

        // this.container.reflectRays().forEach(ray => {
        //     this.raySprite.graphics.moveTo(lastPoint1.x, lastPoint1.y);
        //     this.raySprite.graphics.lineTo(ray.x, ray.y);
        //     this.raySprite.graphics.drawCircle(ray.x, ray.y, 1);
        //     this.raySprite.graphics.drawCircle(ray.x, ray.y, 10);
        //     this.raySprite.graphics.moveTo(ray.x, ray.y);
        //     lastPoint1 = ray.start;
        // });

        // this.raySprite.graphics.lineStyle(1, 0xffffff);
        // this.raySprite.graphics.beginFill(1, 0xffffff);
        // lastPoint1 = this.container.jetPoint;
        // let rays1 = this.container.reflectRays(),
        //     intersection1 = this.container.intersectsBubble(rays1),
        //     traces1 = this.container.circleTraces(rays1, intersection1);
        // traces1.forEach(p => {
        //     this.raySprite.graphics.moveTo(lastPoint1.x, lastPoint1.y);
        //     this.raySprite.graphics.lineTo(p.x, p.y);
        //     this.raySprite.graphics.drawCircle(p.x, p.y, 2);
        //     lastPoint1 = p;
        // });
        // this.raySprite.graphics.endFill();
        // this.raySprite.graphics.drawCircle(lastPoint1.x, lastPoint1.y, this.container.radius);


        //上面是测试
        this.clearRayPoints();
        let lastPoint = this.container.jetPoint;
        let rays = this.container.reflectRays();

        // else {
        //     this.shootAngle += 3;
        //     egret.log("shootAngle + 3")
        //     return;
        // }

        if (PropManager.getInstance().propMode == PropManager.PROP_RAINBOW) {
            let intersection;
            if (rays.length >= 3) {
                intersection = this.container.intersectsBubble(rays, 2)
            } else {
                intersection = this.container.intersectsBubble(rays, 2);
            }
            // let traces = this.container.circleTraces(rays, intersection);
            let rect = null;
            if (intersection && intersection.cell) {
                egret.log("intersection index" + intersection.cell.index);
            }
            this.dealRainbowProp(intersection);
        } else if (PropManager.getInstance().propMode == PropManager.PROP_tonghang) {
            let intersection;
            if (rays.length >= 3) {
                intersection = this.container.intersectsBubble(rays, 2)
            } else {
                intersection = this.container.intersectsBubble(rays, 2);
            }
            // let traces = this.container.circleTraces(rays, intersection);
            let rect = null;
            if (intersection && intersection.cell) {
                egret.log("intersection index" + intersection.cell.index);
            }
            this.dealXiaohangProp(intersection);
        }

        let maxY: number = 0;
        let stop: boolean = false;
        rays.forEach(p => {
            self.tempP1.x = p.x;
            self.tempP1.y = p.y;
            self.tempP2.x = lastPoint.x;
            self.tempP2.y = lastPoint.y;
            let distance: number = Math.abs(egret.Point.distance(self.tempP1, self.tempP2));

            if (distance > 0) {
                for (let i = 0; i < 1; i += 40 / distance) {
                    if (stop) {
                        continue;
                    }
                    let point: sharp.Point = self.getPointOnLine(lastPoint, p.start, i);
                    for (let i = 0; i < self.container.mesh.cells.length; i++) {
                        if (!self.container.mesh.blank(i) && sharp.circleHitPoint(point, 34 + 34 / 2, self.container.getCirclePos(i)) || point.y < 95) {
                            // if (!self.container.mesh.blank(i) && sharp.circleHitPoint(point, 34 + 34 / 2, self.container.getCirclePos(i)) || point.y < 86) {
                            stop = true;
                        }
                    }
                    if (point.y > BaskectBallManager.getInstance().preparePosY - 20) {
                        continue;
                    }
                    let rayPoint: eui.Image = core.CachePool.getObj("rayPoint");
                    if (!rayPoint) {
                        rayPoint = new eui.Image(`ballline_${self.prepareSprite.prepareBubble.cell.color}_png`);
                    }

                    if (PropManager.getInstance().propMode == "") {
                        rayPoint.source = `ballline_${self.prepareSprite.prepareBubble.cell.color}_png`;
                    } else if (PropManager.getInstance().propMode == PropManager.PROP_RAINBOW) {
                        rayPoint.source = `propranbowP_png`;
                    } else if (PropManager.getInstance().propMode == PropManager.PROP_LASER) {
                        rayPoint.source = `proplaserP_png`
                    } else if (PropManager.getInstance().propMode == PropManager.PROP_tonghang) {
                        rayPoint.source = `proptonghangP_png`
                    } else if (PropManager.getInstance().propMode == "") {

                    }
                    self.rayPointContainer.addChild(rayPoint);
                    self.rayPoints.push(rayPoint);
                    rayPoint.width = rayPoint.height = 15;
                    rayPoint.anchorOffsetX = rayPoint.anchorOffsetY = 15 / 2;

                    rayPoint.x = point.x;
                    rayPoint.y = point.y;
                }
            }
            lastPoint = p.start;
        });
    }

    /**
     * 道具的线
     */
    public drawRayPropLaser(): void {
        if (PropManager.getInstance().propMode == PropManager.PROP_LASER) {
            this.clearRayPoints();
            let p = this.container.localToGlobal(0, 0);

            let lastPoint = this.container.jetPoint;
            let rays = this.container.reflectRays();
            let intersections: number[] = this.container.propLaserIntersection(rays[0]);
            PropManager.getInstance().drawCircle(this.container, intersections);

            let tempP1: egret.Point = new egret.Point();
            let tempP2: egret.Point = new egret.Point();
            rays = [rays[0], rays[1]];
            rays.forEach(p => {
                tempP1.x = p.x;
                tempP1.y = p.y;
                tempP2.x = lastPoint.x;
                tempP2.y = lastPoint.y;
                let distance: number = Math.abs(egret.Point.distance(tempP1, tempP2));
                if (distance > 0) {
                    for (let i = 0; i < 1; i += 40 / distance) {
                        let point: sharp.Point = this.getPointOnLine(p.start, lastPoint, i);
                        let rayPoint: eui.Image = core.CachePool.getObj("rayPoint");
                        if (!rayPoint) {
                            rayPoint = new eui.Image(`ball_${this.prepareSprite.prepareBubble.cell.color}_png`);
                        }
                        if (PropManager.getInstance().propMode == "") {
                            rayPoint.source = `ballline_${this.prepareSprite.prepareBubble.cell.color}_png`;
                        }
                        else if (PropManager.getInstance().propMode == PropManager.PROP_RAINBOW) {
                            rayPoint.source = `propranbowP_png`;
                        } else if (PropManager.getInstance().propMode == PropManager.PROP_LASER) {
                            rayPoint.source = `proplaserP_png`
                        } else if (PropManager.getInstance().propMode == "") {

                        }


                        this.rayPoints.push(rayPoint);

                        rayPoint.width = rayPoint.height = 15;
                        rayPoint.anchorOffsetX = rayPoint.anchorOffsetY = 15 / 2;
                        this.rayPointContainer.addChild(rayPoint);
                        rayPoint.x = point.x;
                        rayPoint.y = point.y;
                    }
                }
                lastPoint = p.start;
            });
        }
    }

    private rainbowIntersectionIndex: number = -1;
    private dealRainbowProp(intersection): void {
        if (!intersection || !intersection.cell) {
            return;
        }
        if (this.rainbowIntersectionIndex == intersection.cell.index) {
            return;
        }
        this.rainbowIntersectionIndex = intersection.cell.index;

        let mesh: Mesh = this.container.mesh;
        let mathArr: number[] = [];
        let closestIndices = mesh.closestIndices(intersection.cell.index, true).filter(i => {
            return !mesh.blank(i)
        });

        if (!PropManager.getInstance().crushes) {
            PropManager.getInstance().crushes = this.container.mesh.crushedCells()
        }
        for (let i = 0; i < closestIndices.length; i++) {
            let crushedGroup: CrushedGroup = PropManager.getInstance().crushes.cellInGroup(closestIndices[i]);
            mathArr.push(...crushedGroup.cellIndices);

            let closestIndices1: number[] = mesh.closestIndices(closestIndices[i], true).filter(i => {
                return !mesh.blank(i)
            });
            for (let j = 0; j < closestIndices1.length; j++) {
                if (mesh.at(closestIndices1[j]).sameColor(mesh.at(closestIndices[i]))) {
                    mathArr.push(closestIndices1[j]);
                }
            }
        }
        mathArr.push(...closestIndices);
        mathArr.push(intersection.cell.index);
        mathArr = _.uniq(mathArr);
        PropManager.getInstance().drawCircle(this.container, mathArr);
        PropManager.getInstance().matchRainbow = mathArr;
    }

    private xiaohangIntersectionIndex: number = -1;
    private dealXiaohangProp(intersection): void {
        if (!intersection || !intersection.cell) {
            return;
        }
        if (this.xiaohangIntersectionIndex == intersection.cell.index) {
            return;
        }
        this.xiaohangIntersectionIndex = intersection.cell.index;

        let mesh: Mesh = this.container.mesh;
        let mathArr: number[] = [];
        if (!PropManager.getInstance().crushes) {
            PropManager.getInstance().crushes = this.container.mesh.crushedCells()
        }
        mathArr.push(...mesh.sameRow(intersection.cell.index));
        mathArr = _.uniq(mathArr);
        mathArr = mathArr.filter((val) => {
            if (this.container.mesh.at(val).colorIndex == BallTypeEnum.SPECIL_IRON) {
                return false;
            }
            return true;
        })
        PropManager.getInstance().drawCircle(this.container, mathArr);
        PropManager.getInstance().matchRainbow = mathArr;
    }


    private tempP: sharp.Point = new sharp.Point();
    private getPointOnLine(start: sharp.Point, final: sharp.Point, progress: number): sharp.Point {
        this.tempP.x = start.x + (final.x - start.x) * progress;
        this.tempP.y = start.y + (final.y - start.y) * progress;
        return this.tempP;
    }

    public clearRayPoints(): void {
        for (let i = 0; i < this.rayPoints.length; i++) {
            this.rayPoints[i].y = -1000;
            egret.Tween.removeTweens(this.rayPoints[i]);
            core.CachePool.addObj("rayPoint", this.rayPoints[i]);
        }
        this.rayPoints = [];
    }

    private clearRay(): void {
        this.clearRayPoints();
    }
}

