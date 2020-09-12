class RebornView extends DialogBaseView {
    public m_hudao_0: OtherGameItem;
    public m_hudao_1: OtherGameItem;
    public m_hudao_2: OtherGameItem;
    public m_pass_btn: eui.Label;
    public m_left_text: eui.Label;
    public m_shareBtn: eui.Group;
    public m_video_btn: eui.Group;
    public n_countdown_txt: eui.BitmapLabel;

    private _manager: BaskectBallManager;
    private _countdown: number = 5;
    private _mainview: MainView;
    public constructor(mainview: MainView) {
        super();
        this.skinName = "resource/exml/RebornExml.exml";
        this._manager = BaskectBallManager.getInstance();

        this._mainview = mainview;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.left = this.right = this.top = this.bottom = 0;
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        LocalStorageController.getInstance().levelData = [];
        LocalStorageController.getInstance().setCoin(0);

        this._manager.rebornTime++;
        this.countdown();
        this.m_left_text.text = `还有${3 - this._manager.rebornTime + 1}次复活机会`;
        this.initOthergame();
        this.m_shareBtn.visible = true;
        this.m_video_btn.visible = false;

        if (!SwitchManager.openborn) {
            this.passHandler(null);
        }
    }

    private countdown(): void {
        core.TimerManager.instance.removeTicks(this);
        this.n_countdown_txt.text = 5 + "";
        this._countdown = 5;
        let { screenWidth, screenHeight } = wx.getSystemInfoSync()
        // if (GameConfig.gameType == 'wx') {
        //     WxKit.getCurBanner(0);
        //     // this.m_pass_btn.visible = false;
        //     // egret.setTimeout(() => {
        //     //     this.m_pass_btn.visible = true;
        //     //     this.m_pass_btn.bottom = GameConfig.curHeight() / screenHeight * WxKit.bannerId.style.realHeight + 10;
        //     // }, this, 3000);
        // }
        this.m_pass_btn.bottom = 200;
        core.TimerManager.instance.addTick(1000, 5, () => {
            this._countdown--;
            this.n_countdown_txt.text = this._countdown + "";
            if (this._countdown == 0) {
                core.TimerManager.instance.removeTicks(this);
            } else if (this._countdown == 4) {
            }
        }, this);
    }

    private async initOthergame() {
    }
    /**
	 * 显示
	 */
    protected onHide(event?: egret.Event): void {
        super.onHide();
        core.TimerManager.instance.removeTicks(this);

        egret.Tween.removeTweens(this);
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        super.addListener();

        this.m_shareBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shareHandler, this);
        this.m_video_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.videoHandler, this);
        this.m_pass_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.passHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.m_shareBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.shareHandler, this);
        this.m_video_btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.videoHandler, this);
        this.m_pass_btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.passHandler, this);
    }

    /**
     * 继续游戏
     */
    private shareHandler(evt: egret.TouchEvent): void {
        SoundMgr.getInstance().playWa();
        DataStatisticsJs.logEvent("shareReborn", "rebornView");
    }

    /**
     * 重新开始
     */
    private videoHandler(evt: egret.TouchEvent): void {
        SoundMgr.getInstance().playWa();
        DataStatisticsJs.logEvent("videoReborn", "rebornView");
    }

    private passHandler(evt: egret.TouchEvent): void {
        SoundMgr.getInstance().playWa();
        DataStatisticsJs.logEvent("passBtn", "rebornView");
        if (!this.m_video_btn.visible) {
            this.m_shareBtn.visible = false;
            this.m_video_btn.visible = true;
            this.countdown();
        } else {
            this.removeFromParent();
            if (this._mainview.parent) {
                this._mainview.parent.removeChild(this._mainview);
            }
            let gameover: GameoverView = new GameoverView();
            gameover.popUp();
        }
    }

    /**
	 * 点击空白处是否关闭
	 */
    protected touchDarkEnable(): boolean {
        return false;
    }

}