/**
 * 转盘
 */
class LuckyTurntableView extends DialogBaseView {
    public zhizhenGroup: eui.Group;
    public zhuanpanGroup: eui.Group;
    public Group0: eui.Image;
    public Group1: eui.Image;
    public Group2: eui.Image;
    public Group3: eui.Image;
    public Group4: eui.Image;
    public Group5: eui.Image;
    public Group6: eui.Image;
    public Group7: eui.Image;
    public m_ad_pos: eui.Group;
    public plus_share_Btn: eui.Button;
    public plus_video_Btn: eui.Button;
    public stopBtn: eui.Button;
    public m_start_btn: eui.Button;
    public m_close: eui.Image;
    public m_lefttime_label: eui.Label;
    public m_add_btn: eui.Image;
    public m_video_icon: eui.Image;
    public zhizhen: eui.Image;

    private zhuanid: number = -1;
    private bornNum = 8;
    private deg = 0;
    private id = 0;
    private config: number[] = [180, 40, 100, 140, 20, 60, 30, 50];
    private _isShowMainviewAd: boolean;

    public leftTime: number = 0;
    public static awards: { type: string, title: string }[] = [];
    private running: boolean = false;

    constructor(isShowMainviewAd: boolean = true) {
        super();
        this._isShowMainviewAd = BaskectBallManager.getInstance().isInMainGame();
        this.skinName = "LuckyTurntableViewExml";
    }

    public static init(): void {
        let accountid: string = "";
        if (LocalStorageController.getInstance().getAccountID()) {
            accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
        }
        let self = this;
        Http.get(GameConfig.baseurl + `platformconfig?appid=${GameConfig.appid}` + accountid + `&version=${GameConfig.gameVer}`).then((res) => {
            egret.log(JSON.stringify(res));
            let awards: { award: any, title: string }[] = res["lottery"]["awards"];
            for (let i = 0; i < awards.length; i++) {
                self.awards[i] = {
                    type: awards[i].award[0].type,
                    title: awards[i].title
                }
            }
            // debugger;
        }, (res) => {
            // debugger;
        })
    }

    /**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        this.addListener();

        this.m_close.top = this.m_ad_pos.y + 80;
        DataStatisticsJs.logEvent("open", "lottery");
        this.left = this.right = 0;
        this.verticalCenter = 0;


        for (let i = 0; i < LuckyTurntableView.awards.length; i++) {
            this["Group" + i].source = LuckyTurntableView.awards[i].type;
        }

        this.m_lefttime_label.text = "";
        let accountid: string = "";
        if (LocalStorageController.getInstance().getAccountID()) {
            accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
        }
        let self = this;
        Http.get(GameConfig.baseurl + `getremainder?appid=${GameConfig.appid}` + accountid + `&module=lottery`).then((res) => {
            egret.log(JSON.stringify(res));
            self.leftTime = res["remainder"];
            self.m_lefttime_label.text = "剩余次数: " + self.leftTime;
            if (self.leftTime <= 0) {
                self.m_video_icon.visible = true;
            } else {
                self.m_video_icon.visible = false;
            }
        }, (res) => {
            debugger;
        })

        this.initUI();
        // this.onStartBtn();
        // BaskectBallManager.getInstance().pauseRounTimer();

    }

    protected onHide(event?: egret.Event): void {
        super.onHide();
        this.running = false;

        AdManager.getInstance().removeAllAd();

        egret.Tween.removeTweens(this);

        BaskectBallManager.getInstance().dispatchEvent(new egret.Event("update_redPoint"));
    }

    protected addListener(): void {
        if (this["m_close"]) {
            this["m_close"].addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.Event) => {
                this.removeFromParent();
            }, this);
        }

        this.m_start_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartHandler, this);
        this.m_add_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandle, this);
    }


    protected removeListener(): void {
        super.removeListener();

        this.m_start_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartHandler, this);
        this.m_add_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandle, this);
    }

    private stopHandle(): void {
        Utils.btnChangeByScale(this.stopBtn, 0.8, 1);
        egret.clearInterval(this.zhuanid);
        Utils.gray(this.stopBtn);
        this.stopBtn.enabled = false;
        let self = this;
        egret.Tween.get(this.zhizhenGroup).to({
            rotation: this.deg
        }, 2000, egret.Ease.circOut).call(function () {
            self.running = false;
            egret.Tween.removeTweens(self);
            self.removeFromParent();
            egret.setTimeout(() => {
                let luckyTurntableGetView: LuckyTurntableGetView = new LuckyTurntableGetView(LuckyTurntableView.awards[self.id])
                luckyTurntableGetView.popUp();
            }, this, 50)
        }, this, []);

        let arr: any = LocalStorageController.getInstance().sevendayData;
        if (arr[5] < 2) {
            arr[5] += 1;
            LocalStorageController.getInstance().sevendayData = arr;
        }
    }

    private btn1Timer: number = 0;
    private shareHandle(): void {
        if (egret.getTimer() - this.btn1Timer < 5000) {
            return;
        }
        this.btn1Timer = egret.getTimer()
    }

    private flyCoins(): void {
        // GetCoinView.flyCoins(this.config[this.id - 1], () => {
        //     this.stopBtn.visible = false;
        //     if (SwitchManager.openborn) {
        //         this.plus_video_Btn.visible = false;
        //         this.plus_share_Btn.visible = true;
        //         this.m_close.visible = true;
        //     }
        // }, this);

        // for (let i = 0; i < this.config[this.id -1] /10; i++) {
        //     let icon: eui.Image = new eui.Image("play_coin_icon_png");
        //     icon.x = this.stage.stageWidth / 2 + Math.random() * 400 - 200;
        //     icon.y = this.stage.stageHeight / 2 + Math.random() * 400 - 200;
        //     this.addChild(icon);
        //     egret.Tween.get(icon).to({
        //         x: this.m_coin.x,
        //         y: this.m_coin.y
        //     }, 800 * Math.random(), egret.Ease.bounceOut).call(()=>{
        //         icon.parent && icon.parent.removeChild(icon);
        //         UserManager.getInstance().coin += 10;
        //         this.m_coin.text = UserManager.getInstance().coin + "";
        //         this.stopBtn.visible = false;
        //         if(SwitchManager.openborn){
        //             this.plus_video_Btn.visible = false;
        //             this.plus_share_Btn.visible = true;
        //         }
        //     })
        // }


    }

    public initUI() {
    }

    private btnTimer: number = 0;
    private onStartHandler(): void {
        Utils.btnChangeByScale(this.m_start_btn, 0.8, 1);

        if (egret.getTimer() - this.btnTimer < 5000) {
            return;
        }
        this.btnTimer = egret.getTimer()

        this.onStartBtn();
    }

    public onStartBtn(ensure: boolean = false) {
        // let ran: number = Math.random();
        // if (ran < 0.3) {
        //     this.id = 5;
        // } else if (ran < 0.4) {
        //     this.id = 6;
        // } else if (ran < 0.5) {
        //     this.id = 7;
        // } else if (ran < 0.6) {
        //     this.id = 8;
        // } else if (ran < 0.7) {
        //     this.id = 1;
        // } else if (ran < 0.8) {
        //     this.id = 2;
        // } else if (ran < 0.9) {
        //     this.id = 3;
        // } else if (ran < 1) {
        //     this.id = 4;
        // }
        if (this.running) {
            return;
        }
        if (this.leftTime <= 0) {
            this.shareHandle();
            return;
        }


        let self = this;
        let accountid: string = "";
        if (LocalStorageController.getInstance().getAccountID()) {
            accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
        }
        let ensurestr: string = "";
        if (ensure) {
            ensurestr = "&ensure=true";
        }
        Http.get(GameConfig.baseurl + `lottery?appid=${GameConfig.appid}` + accountid + `&version=${GameConfig.gameVer}` + ensurestr).then((res) => {
            DataStatisticsJs.logEvent("startBtn", "lottery");
            if (ensure) {
                this.leftTime--;
                if (this.leftTime <= 0) {
                    this.leftTime = 0;
                }
                this.m_lefttime_label.text = "剩余次数: " + this.leftTime + "";
                if (this.leftTime <= 0) {
                    this.m_video_icon.visible = true;
                } else {
                    this.m_video_icon.visible = false;
                }
            } else {
                this.m_lefttime_label.text = "剩余次数: " + res["remainder"];
                this.leftTime = res["remainder"];
                if (this.leftTime <= 0) {
                    this.m_video_icon.visible = true;
                } else {
                    this.m_video_icon.visible = false;
                }
            }
            egret.log(JSON.stringify(res));
            this.id = res["id"] - 1;
            this.deg = 360 * 10 + this.id * 45;
            this.initZhuanPanGroup();
        }, (res) => {
            debugger;
        })

    }


    public initZhuanPanGroup() {
        this.running = true;
        var t = this;
        this.initUI();

        this.zhuanid = egret.setInterval(() => {
            this.zhizhenGroup.rotation += 10;
        }, this, 16);

        egret.Tween.get(this).wait(1000).call(() => {
            this.stopHandle()
        })
    }

    public onCloseBtn() {
        this.removeFromParent();
    }

    public dispose() {
    }
}