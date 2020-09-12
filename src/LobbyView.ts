class LobbyView extends core.EUIComponent {
    public m_scroller: eui.Scroller;
    public m_carousel: eui.Group;
    public m_hudao_2: OtherGameItem;
    public m_start_btn: eui.Group;
    public m_sound_btn: eui.Image;
    public m_rank_btn: eui.Image;
    public m_share_btn: eui.Image;
    public m_redball_btn: eui.Group;
    public m_redball_redpoint: eui.Image;
    public group: eui.Group;
    public m_luck_btn: eui.Image;
    public m_luck_redpoint: eui.Image;
    public m_groupbtn: eui.Group;
    public m_sevenday_btn: eui.Group;
    public m_seven_redpoint: eui.Image;
    public m_mall_btn: eui.Group;
    public m_online_awards_btn: OnlineAwards;
    public m_coin_container: eui.Group;
    public m_coin0: eui.Label;

    private _manager: BaskectBallManager;
    private _scrollerIndex: number = 0;
    private _othergame2: OtherGameItem2

    private g;
    public m_dd: eui.Label;
    private _luckyTurntableView: LuckyTurntableView;
    private _sevenDayView: SevenDayView;
    private _mallView: MallView;


    public constructor() {
        super();
        this.skinName = "resource/exml/LobbyExml.exml";
        this._manager = BaskectBallManager.getInstance();
    }

    public childrenCreated() {
        super.childrenCreated();
        this.left = this.right = this.top = this.bottom = 0;
        AnimationManager.getInstance();
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();
        
        egret.log("gameVer: " + GameConfig.gameVer)
        this.initOthergame();

        this.m_coin0.text = LocalStorageController.getInstance().coin + "";

        egret.Tween.get(this).wait(1000).call(() => {
            //没有弹窗的情况下清除广告
            AdManager.getInstance().removeAllAd();
            egret.log("清除广告")
        });


        egret.Tween.get(this.m_luck_btn, { loop: true }).to({
            rotation: 360
        }, 6000)

        this.m_redball_btn.visible = RedManager.getInstance().switch;

        if (LocalStorageController.getInstance().getcollect() != 2) {
            this.group.visible = true;
            egret.Tween.get(this.group, { loop: true }).to({
                rotation: -18
            }, 500).to({
                rotation: 0
            }, 500).to({
                rotation: 18
            }, 500).to({
                rotation: 0
            }, 500)

            egret.Tween.get(this).wait(6000).call(() => {
                if (this._manager.hadCollect) {
                    return;
                }
                this._manager.hadCollect = true;
                if (this._rankView && this._rankView.parent) {
                    return;
                }
                if (this._sevenDayView && this._sevenDayView.parent) {
                    return;
                }
                if (this._mallView && this._mallView.parent) {
                    return;
                }
                if (!this._luckyTurntableView || !this._luckyTurntableView.parent) {
                    this.checkCollect(true);
                }
            })
        } else {
            this.group.visible = false;
        }

        this.updateRedPoint();
    }

    private collectView: CollectView;
    private checkCollect(isOpenLuck: boolean = false): void {
        egret.log("场景值:" + BaskectBallManager.getInstance().scene, LocalStorageController.getInstance().getcollect())
        if (LocalStorageController.getInstance().getcollect() != 1 && LocalStorageController.getInstance().getcollect() != 2) {
            if ([1104, 1023, 1103].indexOf(BaskectBallManager.getInstance().scene) == -1) {
                if (this.collectView && this.collectView.parent) {
                    this.collectView.removeFromParent();
                }
                if (!this.collectView) {
                    this.collectView = new CollectView(isOpenLuck, false);
                }
                this.collectView.popUp();
            } else {
                LocalStorageController.getInstance().setcollect(1);
            }
        } else if (LocalStorageController.getInstance().getcollect() == 2) {
            DataStatisticsJs.logEvent("fromCollect", "lobbyview");
            this.group.visible = false;

            let accountid: string = "";
            if (LocalStorageController.getInstance().getAccountID()) {
                accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
            }
            Http.get(GameConfig.baseurl + `getremainder?appid=${GameConfig.appid}` + accountid + `&module=lottery`).then((res) => {
                egret.log(JSON.stringify(res));
                if (res["remainder"]) {
                    debugger;
                    this.luckBtnHandler();
                }
            }, (res) => {
                debugger;
            })

        } else {
            if (this.collectView && this.collectView.parent) {
                this.collectView.removeFromParent();
            }
            if (!this.collectView) {
                this.collectView = new CollectView(isOpenLuck, false);
            }
            this.collectView.popUp();
        }
    }

    private async initOthergame() {
    }

    protected onHide(event?: egret.Event): void {
        super.onHide();
        egret.Tween.removeAllTweens();
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        this.m_start_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gogameHandler, this);
        this.m_sound_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.soundHandler, this);
        this.m_rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);
        this.m_share_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
        BaskectBallManager.getInstance().addEventListener("switch-event", this.switchEventHandler, this);
        BaskectBallManager.getInstance().addEventListener("collect_get", this.collectGetHandler, this);
        BaskectBallManager.getInstance().addEventListener("update_redPoint", this.updateRedPoint, this);
        
        this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.collectHandler, this);
        this.m_luck_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.luckBtnHandler, this);
        this.m_groupbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler1, this);
        this.m_sevenday_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sevendayHandler, this);
        this.m_mall_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mallHandler, this);
        this.m_online_awards_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onlineAwardsHandler, this);
        
    }

	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        this.m_start_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gogameHandler, this);
        this.m_sound_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.soundHandler, this);
        this.m_rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rankHandler, this);
        this.m_share_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
        BaskectBallManager.getInstance().removeEventListener("switch-event", this.switchEventHandler, this);
        BaskectBallManager.getInstance().removeEventListener("collect_get", this.collectGetHandler, this);
        BaskectBallManager.getInstance().removeEventListener("update_redPoint", this.updateRedPoint, this);
        this.group.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.collectHandler, this);
        this.m_luck_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.luckBtnHandler, this);
        this.m_groupbtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler1, this);
        this.m_sevenday_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sevendayHandler, this);
        this.m_mall_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.mallHandler, this);
        this.m_online_awards_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onlineAwardsHandler, this);

        egret.Tween.removeTweens(this.group)
        egret.Tween.removeAllTweens();
    }

    private collectHandler(evt: egret.Event): void {
        let collectView: CollectView = new CollectView(false, false);
        collectView.popUp();
    }

    private switchEventHandler(evt: egret.Event): void {
        this.m_redball_btn.visible = RedManager.getInstance().switch;
    }

    private collectGetHandler(evt: egret.Event): void {
        this.group.visible = false;
    }

    private luckBtnHandler(): void {
        if (this._luckyTurntableView) {
            this._luckyTurntableView.removeFromParent();
            this._luckyTurntableView = null;
        }
        this._luckyTurntableView = new LuckyTurntableView(false);
        this._luckyTurntableView.popUp();
    }

    /**
     * 前往游戏
     */
    private gogameHandler(evt: egret.TouchEvent): void {
        Utils.btnChangeByScale(this.m_start_btn, 0.8, 1);
        egret.setTimeout(() => {
            this._manager.hadCollect = true;
            this._manager.initMainGame();
        }, this, 100)

        DataStatisticsJs.logEvent("startGameBtn", "lobbyview");
    }

    /**
     * 声音
     */
    private soundHandler(evt: egret.Event): void {
        // PropManager.getInstance().addLimit(PropManager.PROP_RAINBOW,true);
        // PropManager.getInstance().addLimit(PropManager.PROP_LASER,true);
        // return;
        Utils.btnChangeByScale(this.m_sound_btn, 0.8, 1);
        SoundMgr.getInstance().changeSoundStatus();
        if (SoundMgr.getInstance().isOpen) {
            this.m_sound_btn.source = "yinxiao_png";
        } else {
            this.m_sound_btn.source = "yinxiao-guan_png";
        }
    }

    private _rankView: RankView;
    private rankHandler(evt: egret.Event): void {
        // LocalStorageController.getInstance().coin += 10000;
        // ToastManager.addPopUp("领取成功");
        // PropManager.getInstance().addLimit(PropManager.PROP_tonghang,true);
        // return;

        Utils.btnChangeByScale(this.m_rank_btn, 0.8, 1);
        DataStatisticsJs.logEvent("rank", "lobbyview");

        if (this._rankView) {
            this._rankView = null;
        }
        this._rankView = new RankView();
        this._rankView.popUp();
    }

    private shareHandler1(evt: egret.Event): void {
        Utils.btnChangeByScale(this.m_groupbtn, 0.8, 1);


        DataStatisticsJs.logEvent("groupShare", "lobbyview");
    }

    private sevendayHandler(evt: egret.Event): void {
        Utils.btnChangeByScale(this.m_sevenday_btn, 0.8, 1);

        if (this._sevenDayView) {
            this._sevenDayView = null;
        }

        this._sevenDayView = new SevenDayView();
        this._sevenDayView.popUp();

        DataStatisticsJs.logEvent("sevenDay", "lobbyview");
    }

    private mallHandler(evt: egret.Event): void {
        Utils.btnChangeByScale(this.m_mall_btn, 0.8, 1);

        if (this._mallView) {
            this._mallView = null;
        }

        this._mallView = new MallView();
        this._mallView.popUp();

        DataStatisticsJs.logEvent("mallVew", "lobbyview");
    }

    private shareHandler(evt: egret.Event): void {
        Utils.btnChangeByScale(this.m_share_btn, 0.8, 1);


        DataStatisticsJs.logEvent("share", "lobbyview");
    }


    /**
    * 飞金币
    * 注意自动加钱了
    */
    public flyCoins(addMoney: number): void {
        let flyCompleteCount: number = 0;
        LocalStorageController.getInstance().onlineAwards = [Date.now(), 0];
        LocalStorageController.getInstance().coin += addMoney;
        this.m_online_awards_btn.reset();
        for (let i = 0; i < 6; i++) {
            let icon: eui.Image = new eui.Image("jinbi_png");
            icon.x = this.m_online_awards_btn.x;
            icon.y = this.m_online_awards_btn.y;
            this.addChild(icon);

            egret.Tween.get(icon).wait(Math.random() * 500).to({
                x: this.m_coin_container.x,
                y: this.m_coin_container.y
            }, 400).call(() => {
                flyCompleteCount++;
                if (flyCompleteCount == 6) {
                    this.m_coin0.text = LocalStorageController.getInstance().coin + "";
                    egret.log("flyCompleteCount", flyCompleteCount);
                    egret.setTimeout(() => {
                        ToastManager.addPopUp("获得" + addMoney + "金币");
                    }, this, 500)
                }
            })
        }
    }

    /**
     * 刷新红点的状态
     */
    private updateRedPoint():void{
        AdManager.getInstance().removeAllAd();

        let sevenday:SevenDayView = new SevenDayView();
        sevenday.init();
        sevenday = null;

        if(LocalStorageController.getInstance().getHaveRed()){
            this.m_redball_redpoint.visible = true;
        }else{
            this.m_redball_redpoint.visible = false;
        }


        let accountid: string = "";
        if (LocalStorageController.getInstance().getAccountID()) {
            accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
        }
        let self = this;
        Http.get(GameConfig.baseurl + `getremainder?appid=${GameConfig.appid}` + accountid + `&module=lottery`).then((res) => {
            if(res["remainder"]){
                this.m_luck_redpoint.visible = true;
            }else{
                this.m_luck_redpoint.visible = false;
            }
        }, (res) => {
            this.m_luck_redpoint.visible = false;
        })

        this.m_seven_redpoint.visible = false;
        for(let i = 0;i < 5;i ++){
            if(LocalStorageController.getInstance().sevendayGet[i + 1] == 1){
                this.m_seven_redpoint.visible = true;
            }
        }

        
    }

    private onlineAwardsHandler(): void {
        let onlineAwardsDlg: OnlineAwardsGetDlg = new OnlineAwardsGetDlg(this.m_online_awards_btn.count, this);
        onlineAwardsDlg.popUp();
    }
} 