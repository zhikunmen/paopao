/**
 * EUIComponent为EUI容器组件，该容器自动关注添加到舞台和从舞台移除事件
 * 
 */
class MainView extends core.EUIComponent {
    public m_ball_0: eui.Image;
    public m_ball_1: eui.Image;
    public m_top_cotainer: eui.Group;
    public m_timeout: eui.BitmapLabel;
    public m_score_txt: eui.Label;
    public m_guest_nick: eui.Label;
    public m_host_nick: eui.Label;
    public m_host_avator: eui.Image;
    public m_host_avator_mask: eui.Rect;
    public m_guest_avator: eui.Image;
    public m_guest_avator_mask: eui.Rect;
    public m_prop_boom_btn: eui.Image;
    public m_prop_tonghang_btn: eui.Image;
    public m_control_panel: eui.Group;
    public m_top_container: eui.Group;
    public m_prop_xiaohang_btn: PropBtnView;
    public m_prop_rainbow_btn: PropBtnView;
    public m_prop_laser_btn: PropBtnView;
    public m_addrow_left_label: eui.Label;
    public wait_tips: eui.Label;
    public test_btn: eui.Button;

    public m_line: eui.Image;
    public m_refresh_prepare_btn: eui.Button;
    public m_ddd: eui.Label;
    public prepareBg: eui.Image;
    public m_prepare: eui.Group;
    public m_prepare_front: eui.Image;
    public m_oppScore: eui.Label;
    public m_rabbit: eui.Group;

    public static adpos: number;
    public mesh: Mesh;
    public container: MeshContainer;
    public meshSprite: MeshUI;
    public controlSprite: ControlPanel;

    private _radius: number = 34;
    private _enable: boolean = true;
    private _manager: BaskectBallManager;
    private prepareSprite: PrepareSprite;
    private _pauseView: PauseView;
    private _othergameBtn: OtherGameCeView;
    private _othergameItem: OtherGameItem;
    private _othergame2: OtherGameItem2
    private _dangerView: DangerView;
    private _guideView: GuideView;
    private _collectView: CollectView;
    public rabbit: dragonBones.EgretArmatureDisplay;

    private _fallSpeed: number = 5000;
    private _fallInterval: number = -1;
    private _scrollInterval: number = -1;

    private animState = "null"
    constructor() {
        super();
        this.skinName = "resource/exml/MainViewExml.exml";

        this._manager = BaskectBallManager.getInstance();
    }

    /**
     * 显示
     */
    protected onShow(event?: egret.Event): void {
        super.onShow(event);

        let self = this;
        this.rabbit = AnimationManager.getInstance().getEffectByName("Rabbit", "rabitArmature", `breathing_motion`, false);
        this.m_rabbit.addChild(this.rabbit);
        self.rabbit.animation.play("breathing_motion");
        this.m_timeout.text = this._manager.timeout + "";
        this.m_host_avator.mask = this.m_host_avator_mask;
        this.m_guest_avator.mask = this.m_guest_avator_mask;

        // egret.setInterval(() => {
        //     if (this.mesh) {
        //         this.m_ddd.text = this._manager._curShootIndex +',' + this._manager.getCurConfig().bullet;
        //     }
        // }, this, 100)

        SoundMgr.getInstance().playBGM();
        SoundMgr.getInstance().playGamestart1();

        this.m_prop_rainbow_btn.type = PropManager.PROP_RAINBOW;
        this.m_prop_laser_btn.type = PropManager.PROP_LASER;
        this.m_prop_xiaohang_btn.type = PropManager.PROP_tonghang;

        if (!LocalStorageController.getInstance().getPropLock() || LocalStorageController.getInstance().getPropLock() == undefined) {
            LocalStorageController.getInstance().setPropLock(1);
            this.m_prop_rainbow_btn.lock = this.m_prop_laser_btn.lock = this.m_prop_xiaohang_btn.lock = true;
        } else {
            this.m_prop_rainbow_btn.lock = this.m_prop_laser_btn.lock = this.m_prop_xiaohang_btn.lock = false;
        }



        this.restart();
        egret.Tween.get(this.m_refresh_prepare_btn, { loop: true }).to({
            alpha: 0.7
        }, 500, egret.Ease.sineIn).to({
            alpha: 1
        }, 500, egret.Ease.sineOut);
        this.gameStartHandler();
    }

    private forceQuitHandler(): void {
        this.onHide();
    }

    private playBGM(): void {
        SoundMgr.getInstance().playBGM();
    }

    private restart(): void {

        this.isGameover = false;
        this.pause = false;
        DangerView.NextScore = 0;

        this.mesh = new Mesh(17, 11);
        this.mesh.cellColors = [
            BallTypeEnum.NORMAL_0,
            BallTypeEnum.NORMAL_1,
            BallTypeEnum.NORMAL_2,
            BallTypeEnum.NORMAL_3,
            BallTypeEnum.NORMAL_4,
            BallTypeEnum.NORMAL_5
        ];
        this.enabled = true;
        // this.mesh.createMesh(_.range1(76));
        this.mesh.initMesh();
        this.m_prop_laser_btn.canGetCount = this.m_prop_rainbow_btn.canGetCount = this.m_prop_xiaohang_btn.canGetCount = 2;

        // this.container = new MeshContainer(this.mesh, new sharp.Rectangle(GameConfig.curWidth() * .005, 0, GameConfig.curWidth() * .99, GameConfig.curHeight()), new sharp.Point(GameConfig.curWidth() / 2, this._manager.preparePosY + 34));
        this.container = new MeshContainer(this.mesh, new sharp.Rectangle(0, 0, GameConfig.curWidth(), GameConfig.curHeight()), new sharp.Point(GameConfig.curWidth() / 2, this._manager.preparePosY + 34));

        if (this.meshSprite)
            this.meshSprite.destroy();

        this.meshSprite = new MeshUI(this.container);

        this.meshSprite.touchEnabled = false;
        this.meshSprite.touchChildren = false;
        this.meshSprite.y = -500;
        this.enabled = false;

        this.container.meshUI = this.meshSprite;

        this.meshSprite.cacheAsBitmap = true;

        // let _layer = this.meshSprite.animLayer = new eui.Group();
        // _layer.name = "testtest"
        // _layer.x = 0;
        // _layer.y =  this.meshSprite.y;
        // _layer.width = this.meshSprite.width;
        // _layer.height = this.meshSprite.height;
        // let _rect = new eui.Rect();
        // _rect.fillColor = 0x44444400;
        // _rect.alpha = .5;
        // _rect.width = this.meshSprite.width;
        // _rect.height = this.meshSprite.height;
        // _layer.addChild(_rect);

        // this.addChild(_layer);

        let self = this;
        this._manager.score = 0;
        egret.Tween.get(this.meshSprite).to({
            y: -100
        }, 2000, egret.Ease.sineIn).call(() => {
            self.enabled = true;
        });

        this.prepareSprite = new PrepareSprite(this.container, this);
        this.prepareSprite.x = 0;
        this.prepareSprite.y = 0;
        this.addChild(this.prepareSprite);

        this.addChildAt(this.m_prepare_front, 9999);

        this.controlSprite = new ControlPanel(this.container, this.prepareSprite);
        this.m_prepare.addChild(this.controlSprite);

        this.addChild(this.meshSprite);

        let newBallUIs: BubbleUI[] = [];
        newBallUIs.push(this.container.createPrepareBubble(this.mesh.createPrepareBallColor()));
        newBallUIs.push(this.container.createPrepareBubble(this.mesh.createPrepareBallColor()));

        this.prepareSprite.initBubble(newBallUIs);

        this.addChild(this.m_top_cotainer);

        PropManager.getInstance().resetUseLimit();
        this.m_prop_rainbow_btn.update();
        this.m_prop_laser_btn.update();
        this.m_prop_xiaohang_btn.update();

        this.curShootChangeHandler(null);

        // let timestamp: number = Date.now();
        // setInterval(() => {
        //     let distance:number = (Date.now() - timestamp) / 100;
        //     self.meshSprite.y += distance;
        //     timestamp = Date.now();
        //     if (self.meshSprite.y > -32) {
        //         self.meshSprite.y = -32;
        //         self._manager.curFirstLineY = this.container.getCirclePos(0);
        //         self._manager.checkAddrowLess(this.container);
        //     }
        // }, 100);

        this.wait_tips.text = "Waiting for your opponet";
        this.wait_tips.visible = true;

    }

    protected scrollMeshSprite(speed = 100): number {

        let _interval = -1;

        let timestamp: number = Date.now();
        _interval = setInterval(() => {
            var lastBubblePos = this.container.getCellRectangle(0);
            for (var i = this.mesh.cells.length - 1; i > 0; i--) {
                if (!this.mesh.at(i).blank) {

                    lastBubblePos = this.container.getCellRectangle(i);
                    break;
                }
            }

            var _meshY = this.meshSprite.y;
            var _lineY = this.m_line.y;

            // 当最底下的球超过线游戏结束
            if (lastBubblePos.y + _meshY + 68 >= _lineY) {
                this.gameover(OverType.LINE_OUT);
                return;
            }

            // 
            let _solid = this.mesh.solidIndices();
            if ((_lineY - (lastBubblePos.y + _meshY + 68) >= 500)) {
                speed = 6;
            } else {
                speed = 75;
            }

            // speed = 10

            let distance: number = (Date.now() - timestamp) / speed;

            // 暂停住了只是暂停了往下滚动
            if (!this.pause) {
                this.meshSprite.y += distance;

            }
            // console.log('---------', this.meshSprite.y, this.meshSprite.height, this.m_line.y)
            timestamp = Date.now();
            if (this.meshSprite.y > -32) {
                this.meshSprite.y = -32;
                // 消除动画过后才继续添加
                if (this.animState != "Fullfilled") {
                    this._manager.checkAddrowLess(this.container);
                }
            }
            // this.meshSprite.animLayer.y = this.meshSprite.y;
        }, 16);
        return _interval

    }

    protected onHide(event?: egret.Event): void {

        SoundMgr.getInstance().stopBGM();
        egret.Tween.removeAllTweens();
        super.onHide(event);

        core.LayerCenter.getInstance().getLayer(LayerEnum.MENU).removeChildren();
    }
    /**
     * 添加监听
     */
    protected addListener(): void {

        // this._bubbleData.addEventListener(BubbleEvent.UPDATE, updateHandler);
        // this._bubbleData.addEventListener(BubbleEvent.REMOVE_BUBBLE, removeBubbleHandler);

        // this.test_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.testStop, this);


        this._manager.addEventListener(BaskectBallManager.SCORE_CHANGE, this.changeScoreHandler, this);
        this._manager.addEventListener(BaskectBallManager.ADD_NEW_ROW, this.addNewRowHandler, this);
        this._manager.addEventListener(BaskectBallManager.GO_ON_GAME, this.gononGameHandler, this);
        this._manager.addEventListener(BaskectBallManager.REBORN, this.rebornHandler, this);
        this._manager.addEventListener("cur_shoot_change", this.curShootChangeHandler, this);
        this._manager.addEventListener(BaskectBallManager.OPP_SCORE_CHANGE, this.updateOppScoreHandler, this);

        this.m_prop_laser_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.laserPropHandler, this);
        this.m_prop_boom_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.boomPropHandler, this);
        this.m_prop_rainbow_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rainbowPropHandler, this);
        this.m_prop_xiaohang_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tonghangPropHandler, this);

        PropManager.getInstance().addEventListener(PropManager.PROP_OFF, this.propOffHandler, this);

        let gameManager = GameManager.getInstance();
        gameManager.addEventListener("game_start", this.gameStartHandler, this);
        // gameManager.addEventListener("score_update", this.scoreUpdateHandler,this);
        // gameManager.addEventListener("restart", this.restartHandler,this);
        // gameManager.addEventListener("gameover", this.restartHandler,this);
        gameManager.addEventListener("force_quit", this.forceQuitHandler, this);
        gameManager.addEventListener("on_message", this.onMessageHandler, this);
        gameManager.addEventListener("clock", this.clockHandler, this);
        gameManager.addEventListener("time_up", this.clockTimeupHandler, this);
        // gameManager.addEventListener("voice_change", this.voiceChangeHandler,this);
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveHandler, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.moveHandler, this)
        this._manager.removeEventListener(BaskectBallManager.SCORE_CHANGE, this.changeScoreHandler, this);
        this._manager.removeEventListener(BaskectBallManager.ADD_NEW_ROW, this.addNewRowHandler, this);
        this._manager.removeEventListener(BaskectBallManager.GO_ON_GAME, this.gononGameHandler, this);
        this._manager.removeEventListener(BaskectBallManager.REBORN, this.rebornHandler, this);
        this._manager.removeEventListener("cur_shoot_change", this.curShootChangeHandler, this);
        this.m_prop_laser_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.laserPropHandler, this);
        this.m_prop_boom_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.boomPropHandler, this);
        this.m_prop_rainbow_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rainbowPropHandler, this);
        this.m_prop_xiaohang_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tonghangPropHandler, this);

        PropManager.getInstance().removeEventListener(PropManager.PROP_OFF, this.propOffHandler, this);
    }

    /**
     * 游戏开始
     */
    private _robertInterval: number = -1;
    private gameStartHandler(): void {
        this.wait_tips.visible = false;
        let self = this;
        let d = AnimationManager.getInstance().getEffectByName("readygo_motion_4", "armatureName", ``, false);
        d.addEventListener("complete", completeHandler, this);
        d.x = GameConfig.curWidth() / 2;
        d.y = GameConfig.curHeight() / 2;
        this.addChild(d);
        d.animation.gotoAndPlayByTime("newAnimation", 0, 1);
        SoundMgr.getInstance().playReady();
        function completeHandler() {
            d.removeEventListener("complete", completeHandler, self);
            d.parent && d.parent.removeChild(d);
            self._manager.startClock();

            // 只有收到游戏开始才下降
            this._scrollInterval = this.scrollMeshSprite();

            self.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveHandler, this);
            self.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.moveHandler, this);
        }

        this._robertInterval = setInterval(() => {
            if (Math.random() > 0.5) {
                self._manager.oppScore += Math.round(core.MathUtils.random(80, 100) / 10) * 10;
            }
        }, 1000, this);
    }

    private onMessageHandler(event): void {
        var data = event.data || {};
        if (data.type == 'score') {
            this._manager.oppScore = data.data.score;
        } else if (data.type == "other_force_quit") {
        } else if (data.type == "touch_line") {
            this.gameover(OverType.OTHER_LINE_OUT)
        }
    }

    private clockHandler(): void {
        this.m_timeout.text = this._manager.timeout + "";
        if (this._manager.timeout <= 5) {
            SoundMgr.getInstance().playCountdown();
        }
    }

    private clockTimeupHandler(): void {
        this.gameover(OverType.TIME_OUT);
    }


    private _moveTimer: number = 0;
    private newPoint: sharp.Point = new sharp.Point();
    private moveHandler(evt: egret.TouchEvent): void {
        this._manager.isTouching = true;

        if (this._guideView && this._guideView.parent) {
            this._guideView.parent.removeChild(this._guideView);
        }

        if (!this.hasEventListener(egret.TouchEvent.TOUCH_END)) {
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEndHandler, this);
        }

        this.newPoint.x = evt.stageX;
        this.newPoint.y = this.localStageY(evt.stageY);
        let angle = sharp.slopeDegree(this.container.jetPoint, this.newPoint);
        let theta = Math.abs(angle - this.controlSprite.shootAngle);

        // console.log("paotai-----------", this.prepareBg.anchorOffsetX, this.prepareBg.x)    

        if (this.localStageY(evt.stageY) > this.m_line.y + 100) { //暂时这样
            // 移动到线以下就不再画瞄准线了
            this._manager.isTouching = false;
            this.controlSprite.shootAngle = -1;
            this.m_prepare_front.rotation = 0;
            this.prepareBg.rotation = 0;
        } else {

            this.controlSprite.shootAngle = angle;
            this.m_prepare_front.rotation = angle + 90;
            this.prepareBg.rotation = angle + 90;
        }
    }

    private touchEndHandler(evt: egret.TouchEvent): void {
        this._manager.isTouching = false;
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEndHandler, this);
        if (this.localStageY(evt.stageY) > this.m_line.y + 100) { //暂时这样
            this.controlSprite.shootAngle = -1;
            return;
        }
        this.shoot();
    }

    private localStageY(stageY: number): number {
        return stageY - (GameConfig.curHeight() / 2 - 1334 / 2)
    }

    public async shoot() {
        if (!this.enabled) return;
        try {

            this.m_prop_laser_btn.hideEffect();
            this.m_prop_rainbow_btn.hideEffect();
            this.m_prop_xiaohang_btn.hideEffect();

            let gift: number = 0;
            let giftRedball: number = 0;

            if (PropManager.getInstance().propMode) {
                this._manager.hasUseProps = true; //使用道具后不下降
            }

            this.enabled = false;
            let prepareBubble = this.prepareSprite.prepareBubble;
            if (prepareBubble.cell.blank) {
                this.enabled = true;
                return;
            }

            let rays = this.container.reflectRays();
            egret.log(11111, '---反射线---', rays);
            let intersection;
            if (rays.length >= 3) {
                intersection = this.container.intersectsBubble(rays, 2)
            } else {
                intersection = this.container.intersectsBubble(rays, 2);
            }

            // this.insectBall = intersection;

            let traces = this.container.circleTraces(rays, intersection);


            egret.log(11111, '---球运行路径---', traces);

            if (intersection && intersection.cell) {
                // if (intersection.cell == 55) {
                //     debugger
                // }
            } else {
                this.controlSprite.container.shootAngle += 1;
                this.enabled = true;
                this.shoot();
                return;
            }
            egret.log(2222);

            if (intersection.rayIndex < 0) {
                debugger;
                return;
            }

            egret.log(3333, "最终位置", intersection);
            prepareBubble.cell.index = intersection.cell.index;
            if (intersection.cell.index == null) {
                debugger;
            }

            this.controlSprite.shootAngle = -1;
            egret.log(4444);

            //激光道具
            if (PropManager.getInstance().propMode == PropManager.PROP_LASER) {
                this.meshSprite.replaceBubbleUI(prepareBubble);
                await PropManager.getInstance().shootLaser(this);
                // this._manager.checkAddrowLess(this.container);
                //创建新的预备球
                let newBall: number = this.mesh.createPrepareBallColor();
                egret.log("jiguang创建新的球-----", newBall)
                this.prepareSprite.pushBubble(this.container.createPrepareBubble(newBall))
                this.mesh.saveLevelData();
                this.enabled = true;
                this.pause = false;
                return;
            }

            SoundMgr.getInstance().playShoot();
            let originPos: number = this.m_prepare_front.y;
            egret.Tween.get(this.m_prepare_front).to({
                scaleY: 0.8,
                y: originPos + 15
            }, 130, egret.Ease.backIn).to({
                scaleY: 1.05
            }, 130, egret.Ease.backOut).to({
                scaleY: 1,
                y: originPos
            }, 130, egret.Ease.backOut);
            egret.Tween.get(this.prepareBg).to({
                scaleY: 0.8,
                y: originPos + 15
            }, 130, egret.Ease.backIn).to({
                scaleY: 1.05
            }, 130, egret.Ease.backOut).to({
                scaleY: 1,
                y: originPos
            }, 130, egret.Ease.backOut);

            await this.controlSprite.renderShooting(prepareBubble, traces, this.meshSprite.container.getCirclePos(prepareBubble.cell.index));
            egret.log(55555);
            // if (intersection.cell && intersection.cell.row >= this.mesh.rows - 1) // 最后一行被填值
            //     return this.stop();


            let prepareBubbleIndex: number = prepareBubble.cell.index;
            this.meshSprite.replaceBubbleUI(prepareBubble);
            egret.log("被替换的位置。。", prepareBubbleIndex)


            //彩虹道具
            if (PropManager.getInstance().propMode == PropManager.PROP_RAINBOW) {
                await PropManager.getInstance().shootRainBow(this);
                // this._manager.checkAddrowLess(this.container);
                //创建新的预备球
                let newBall: number = this.mesh.createPrepareBallColor();
                egret.log("caihong创建新的球-----", newBall)
                this.prepareSprite.pushBubble(this.container.createPrepareBubble(newBall))
                this.enabled = true;
                this.mesh.saveLevelData();
                this.pause = false;
                return;
            }

            //消一行道具
            if (PropManager.getInstance().propMode == PropManager.PROP_tonghang) {
                await PropManager.getInstance().shootTonghang(this);
                // this._manager.checkAddrowLess(this.container);
                //创建新的预备球
                let newBall: number = this.mesh.createPrepareBallColor();
                egret.log("xiaoyihang创建新的球-----", newBall)

                this.prepareSprite.pushBubble(this.container.createPrepareBubble(newBall))
                this.enabled = true;
                this.mesh.saveLevelData();
                this.pause = false;
                return;
            }

            //创建新的预备球
            let newBall: number = this.mesh.createPrepareBallColor();
            this.prepareSprite.pushBubble(this.container.createPrepareBubble(newBall))

            let crushes: CrushedCells = this.mesh.crushedCells(),
                crushedGroup: CrushedGroup = crushes.cellInGroup(prepareBubbleIndex);




            egret.log(66666, prepareBubbleIndex, "最终被消除球", crushedGroup);

            if (!crushedGroup.cellIndices.length) {
                gift = this.checkHasGift(this.mesh.closestIndices(prepareBubbleIndex))
                if (gift != -1) { //礼包球
                    crushedGroup.cellIndices.push(prepareBubbleIndex, gift);
                    gift = 1;
                }
                giftRedball = this.checkHasRedBall(this.mesh.closestIndices(prepareBubbleIndex))
                if (giftRedball != -1) { //红包球
                    crushedGroup.cellIndices.push(prepareBubbleIndex, giftRedball);
                    giftRedball = 1;
                }
            } else {
                let dropingIndices: number[] = this.mesh.dropingIndices(crushedGroup.cellIndices);
                if (this.checkHasGift(dropingIndices) != -1) {
                    gift = 1;
                }
                if (this.checkHasGift(crushedGroup.cellIndices) != -1) {
                    gift = 1;
                }
                if (this.checkHasRedBall(dropingIndices) != -1) {
                    giftRedball = 1;
                }
                if (this.checkHasRedBall(crushedGroup.cellIndices) != -1) {
                    giftRedball = 1;
                }
            }
            egret.log(77777, crushedGroup.cellIndices.length + "aaa");

            if (crushedGroup.cellIndices.length > 0) { // 有消除的 
                this.enabled = false;
                egret.log(8888);
                //加分数
                this._manager.score += _.unique(crushedGroup.cellIndices).length * 10;
                let dropingIndices: number[] = this.mesh.dropingIndices(crushedGroup.cellIndices);
                this._manager.score += _.unique(dropingIndices).length * 20;
                this.meshSprite.renderDroping(dropingIndices);

                this.animState = "Fullfilled"
                await this.meshSprite.renderCrush(crushedGroup, prepareBubbleIndex);
                this.animState = "resolve"

                this._manager.isFirst = false;
                this.showHint(crushedGroup.cellIndices.length + dropingIndices.length);
                // if (dropingIndices.length) {
                //     await new Promise(resolve => {
                //         egret.setTimeout(() => {
                //             resolve();
                //         }, this, 1000);
                //     })
                // }
                // await this._manager.checkAddrowLess(this.container);
                // if (Math.random() > this._manager.getCurConfig().rewardp) {
                //     await this._manager.addCurShootIndex();
                // }
            } else {
                let index: number = this.mesh.checkBlackHole(prepareBubbleIndex);
                if (index != -1) {
                    await this.meshSprite.renderBlackHole(index, prepareBubbleIndex);
                } else {
                    await this.meshSprite.play(prepareBubbleIndex);
                    egret.log(9999);
                    //发射球计时器
                    this.enabled = false;
                    // await this._manager.addCurShootIndex();
                    egret.log(1122);
                }
            }

            // if (this.mesh.isTouchLine()) {
            //     this.gameover();
            // }
            if (this.mesh.isLeft2Line()) {
                // if (!this.isGameover && (DangerView.NextScore == 0 || DangerView.NextScore < this._manager.score)) {
                //     this.m_prop_rainbow_btn.lock = this.m_prop_laser_btn.lock = this.m_prop_xiaohang_btn.lock = false;
                //     if (this._dangerView) {
                //         this._dangerView.removeFromParent();
                //     }
                //     this._dangerView = new DangerView(PropManager.getInstance().getRandomType());
                //     this._dangerView.popUp();
                //     DangerView.NextScore += this._manager.score + 4000;
                // }

                // if (LocalStorageController.getInstance().propRaserCount == LocalStorageController.getInstance().propRainbowCount) {
                //     if (Math.random() > 0.5) {
                //         this.m_rainbow_tip.visible = true;
                //     } else {
                //         this.m_laser_tip.visible = true;
                //     }
                // } 
                // else if (LocalStorageController.getInstance().propRaserCount > 0) {
                //     this.m_laser_tip.visible = true;
                // } else if (LocalStorageController.getInstance().propRainbowCount > 0) {
                //     this.m_rainbow_tip.visible = true;
                // } else if (LocalStorageController.getInstance().propTonghangCount > 0) {
                //     this.m_tonghang_tip.visible = true;
                // }

                egret.Tween.get(this.m_line, {
                    loop: true
                }).to({
                    alpha: 0.2
                }, 500).to({
                    alpha: 1
                }, 500)
            } else {
                egret.Tween.removeTweens(this.m_line);
            }
            this.enabled = true;

            if (gift != -1 && gift != 0) {
                this.checkGift();
            }
            if (giftRedball != -1 && giftRedball != 0) {
                this.checkGiftRedBall();
            }

        } catch (err) {
            egret.log(err);
        }
    }

    private checkHasGift(indexs: number[]): number {
        for (let i = 0; i < indexs.length; i++) {
            if (this.mesh.at(indexs[i]).colorIndex == BallTypeEnum.GIFT_BALL_6) {
                return indexs[i];
            }
        }
        return -1;
    }

    private checkHasRedBall(indexs: number[]): number {
        return -1;
    }

    /**
     * 分数改变
     */
    private changeScoreHandler(evt: egret.Event): void {
        let target: number = this._manager.score;
        if (this.m_score_txt.text == "0" && this._manager.score > 100) {
            this.m_score_txt.text = target + "";
            return;
        }
        let curScore: number = Number(this.m_score_txt.text);
        let obj = {
            score: curScore / 10
        }
        egret.Tween.get(obj, {
            onChange: () => {
                this.m_score_txt.text = ~~obj.score * 10 + "";
            }
        }).to({
            score: target / 10
        }, Math.pow(target - curScore, 0.5) * 80).call(() => {
            this.m_score_txt.text = target + "";
        })
    }

    /**
     * 增加新的行
     */
    private addNewRowHandler(evt: egret.Event): void {
        // egret.setTimeout(() => {
        // this.enabled = false;
        this.mesh.addNewRows();
        this.meshSprite.renderMesh1();
        this.meshSprite.y = - 68 * 2 + 18 - 32;

        // 当触发了增加两行的操作的时候 cells 数组往下移动了两行，所以要将发射出去的球的索引移动往下移动两行
        this.prepareSprite.prepareBubble.cell.index += 22;
        // if (this.insectBall && this.insectBall.cell) {
        //     this.insectBall.cell.index += 22;
        // }

        // this.meshSprite.$children.forEach((value: BubbleUI, index) => {
        //     if (value.state == "playing") {
        //         value.y += (- 68 * 2 + 18 - 32)
        //     }
        // })
        // let targetY: number = 0;
        // egret.Tween.get(this.meshSprite).to({
        //     y: 0
        // }, 500, egret.Ease.sineOut).call(() => {
        //     // this.enabled = true;
        //     if (this.mesh.isTouchLine()) {
        //         this.gameover();
        //     }
        // }).call(() => {
        //     // this.enabled = true;
        // });
        // }, this, 1000)
    }

    /**
     * 使用激光道具
     */
    private laserPropHandler(evt: egret.TouchEvent): void {
        let arr: any = LocalStorageController.getInstance().sevendayData;
        if (arr[4] == 0) {
            arr[4] = 1;
            LocalStorageController.getInstance().sevendayData = arr;
        }

        // this._manager.dddd += 0.1;
        // egret.log(this._manager.dddd);
        // return;
        DataStatisticsJs.logEvent("layserBtn", "mainview");
        SoundMgr.getInstance().playWa();
        if (this.m_prop_laser_btn.lock) {
            ToastManager.addPopUp("技能暂未开始");
            return;
        }
        if (PropManager.getInstance().propMode != "") {
            if (PropManager.getInstance().propMode == PropManager.PROP_LASER) {
                this.pause = false;
                PropManager.getInstance().closePropMode();
                return;
            }
        }
        // PropManager.getInstance().closePropMode();
        if (PropManager.getInstance().checkPropLimit(PropManager.PROP_LASER)) {
            PropManager.getInstance().openPropMode(PropManager.PROP_LASER);
            this.pause = true;
            this.m_prop_laser_btn.showEffect();
            this.prepareSprite.showPropEffect(PropManager.PROP_LASER);
        } else {
            if (this.m_prop_laser_btn.canGetCount > 0) {
            } else {
                this.dispatchEvent(new egret.Event(PropManager.CHANGE));
                // ToastManager.addPopUp("本局‘激光球’使用次数已达上限")
            }
        }
    }
    private rainbowPropHandler(evt: egret.TouchEvent): void {
        // this._manager.dddd -= 0.1;
        // egret.log(this._manager.dddd);
        // return;

        let arr: any = LocalStorageController.getInstance().sevendayData;
        if (arr[4] == 0) {
            arr[4] = 1;
            LocalStorageController.getInstance().sevendayData = arr;
        }

        SoundMgr.getInstance().playWa();
        if (this.m_prop_rainbow_btn.lock) {
            ToastManager.addPopUp("技能暂未开始");
            return;
        }
        DataStatisticsJs.logEvent("rainbownBtn", "mainview");
        if (PropManager.getInstance().propMode != "") {
            if (PropManager.getInstance().propMode == PropManager.PROP_RAINBOW) {
                this.pause = false;
                PropManager.getInstance().closePropMode();
                return;
            }
        }
        // PropManager.getInstance().closePropMode();

        if (PropManager.getInstance().checkPropLimit(PropManager.PROP_RAINBOW)) {
            PropManager.getInstance().openPropMode(PropManager.PROP_RAINBOW);
            this.pause = true;
            this.m_prop_rainbow_btn.showEffect();
            this.prepareSprite.showPropEffect(PropManager.PROP_RAINBOW);
        } else {
            if (this.m_prop_rainbow_btn.canGetCount > 0) {
            } else {
                this.dispatchEvent(new egret.Event(PropManager.CHANGE));
                //ToastManager.addPopUp("本局‘万能球’使用次数已达上限");
            }
        }

    }
    private boomPropHandler(evt: egret.TouchEvent): void {
        SoundMgr.getInstance().playWa();
        PropManager.getInstance().openPropMode(PropManager.PROP_BOOM);
    }
    private tonghangPropHandler(evt: egret.TouchEvent): void {

        SoundMgr.getInstance().playWa();
        let arr: any = LocalStorageController.getInstance().sevendayData;
        if (arr[4] == 0) {
            arr[4] = 1;
            LocalStorageController.getInstance().sevendayData = arr;
        }

        if (this.m_prop_xiaohang_btn.lock) {
            ToastManager.addPopUp("技能暂未开始");
            return;
        }

        DataStatisticsJs.logEvent("tonghangBtn", "mainview");
        if (PropManager.getInstance().propMode != "") {
            if (PropManager.getInstance().propMode == PropManager.PROP_tonghang) {
                this.pause = false;
                PropManager.getInstance().closePropMode();
                return;
            }
        }
        // PropManager.getInstance().closePropMode();

        if (PropManager.getInstance().checkPropLimit(PropManager.PROP_tonghang)) {
            PropManager.getInstance().openPropMode(PropManager.PROP_tonghang);
            this.pause = true;
            this.m_prop_xiaohang_btn.showEffect();
            this.prepareSprite.showPropEffect(PropManager.PROP_tonghang);
        } else {
            if (this.m_prop_xiaohang_btn.canGetCount > 0) {
            } else {
                this.dispatchEvent(new egret.Event(PropManager.CHANGE));
                // ToastManager.addPopUp("本局‘闪电球’使用次数已达上限");
            }
        }
    }

    private propOffHandler(evt: egret.TouchEvent): void {
        this.m_prop_rainbow_btn.hideEffect();
        this.m_prop_laser_btn.hideEffect();
        this.m_prop_xiaohang_btn.hideEffect();
    }

    /**
     * 继续游戏
     */
    private gononGameHandler(evt: egret.TouchEvent): void {
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveHandler, this)
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.moveHandler, this)
    }

    /**
     * 复活
     */
    private rebornHandler(evt: egret.Event): void {
        this.isGameover = false;
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.moveHandler, this)

        this.mesh.reborn();
        this.meshSprite.renderMesh1();
    }

    /**
     * 暂停
     */
    private pauseHandler(evt: egret.TouchEvent): void {
        SoundMgr.getInstance().playWa();
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.moveHandler, this)
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.moveHandler, this)
        this._pauseView = new PauseView();
        this._pauseView.popUp(true);
    }

    /**
     * 游戏结束
     * type: "timeout" 倒数结束；"overline" 触碰底线
     */
    private gameoverView: GameoverView;
    private rebornView: RebornView;
    private isGameover: boolean = false;
    private gameover(type): void {
        clearInterval(this._robertInterval);
        clearInterval(this._fallInterval);
        clearInterval(this._scrollInterval);

        this._manager.stopCountDown();

        this._manager.overType = type;

        if (this.isGameover) {
            return;
        }
        if (!this.gameoverView) {
            this.gameoverView = new GameoverView();
        }
        this.gameoverView.popUp(true);
    }

    private checkGift(): void {
        let getGiftView: GetGiftView = new GetGiftView(PropManager.getInstance().getRandomType());
        getGiftView.popUp();
    }

    private checkGiftRedBall(): void {

    }

    /**
     *  good：5≤总消除+掉落≤6
        great：7≤总消除+掉落≤8
        excellent：9≤总消除+掉落
     */
    private showHint(count: number): void {
        if (count >= 5) {
            let img: egret.MovieClip;
            if (count >= 5 && count <= 6) {
                img = core.MCFactory.instance.getMovieClip('good_motion_json', 'good_motion_png', 'motion', true, 'play_good');
                SoundMgr.getInstance().playGood();
            } else if (count >= 7 && count <= 8) {
                img = core.MCFactory.instance.getMovieClip('good_motion_json', 'good_motion_png', 'motion', true, 'play_nice');
                SoundMgr.getInstance().playNice();
            } else {
                img = core.MCFactory.instance.getMovieClip('good_motion_json', 'good_motion_png', 'motion', true, 'play_perfect');
                SoundMgr.getInstance().playPerfect();
            }
            core.LayerCenter.getInstance().getLayer(LayerEnum.HINT).addChild(img);
            img.x = GameConfig.curWidth() / 2;
            img.y = GameConfig.curHeight() / 2;
            img.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
                img.parent && img.parent.removeChild(img);
            }, this);
            img.play(1);
        }
    }

    /**
     * 当前距离
     */
    private curShootChangeHandler(evt: egret.Event): void {
        let left: number = 5 - this._manager.curShootIndex - 1;
        left = left <= 0 ? 5 : left;
        this.m_addrow_left_label.text = left + "";
    }

    private updateOppScoreHandler(): void {
        this.m_oppScore.text = this._manager.oppScore + "";
    }

    public pause: boolean = false;
    private testStop() {
        this.pause = !this.pause;
    }
}
