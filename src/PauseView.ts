class PauseView extends DialogBaseView {
    public othergameitem_5: OtherGameItem;
    public othergameitem_0: OtherGameItem;
    public othergameitem_1: OtherGameItem;
    public othergameitem_2: OtherGameItem;
    public othergameitem_3: OtherGameItem;
    public othergameitem_4: OtherGameItem;
    public m_score_txt: eui.BitmapLabel;
    public m_goon_btn: eui.Button;
    public m_refresh_btn: eui.Button;
    public m_home_btn: eui.Button;
    public m_ad_pos: eui.Group;
    public m_bottom_group: eui.Group;

    private _manager: BaskectBallManager;

    public constructor() {
        super();
        this.skinName = "resource/exml/PauseExml.exml";
        this._manager = BaskectBallManager.getInstance();
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
        this.m_score_txt.text = this._manager.score + "";
        this.initOthergame();
    }

    private async initOthergame() {
    }
    /**
	 * 显示
	 */
    protected onHide(event?: egret.Event): void {
        super.onHide();
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        super.addListener();

        this.m_goon_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goonHandler, this);
        this.m_refresh_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.refreshHandler, this);
        this.m_home_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.homeHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.m_goon_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goonHandler, this);
        this.m_refresh_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.refreshHandler, this);
        this.m_home_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.homeHandler, this);
    }

    /**
     * 继续游戏
     */
    private goonHandler(evt: egret.TouchEvent): void {
        Utils.btnChangeByScale(this.m_goon_btn, 0.8, 1);
        egret.setTimeout(() => {
            this.removeFromParent();
            this._manager.goonGame();
        }, this, 100);
        DataStatisticsJs.logEvent("goonGameBtn", "pauseView");
    }

    /**
     * 重新开始
     */
    private refreshHandler(evt: egret.TouchEvent): void {
        DataStatisticsJs.logEvent("replayBtn", "pauseView");
        Utils.btnChangeByScale(this.m_refresh_btn, 0.8, 1);
        LocalStorageController.getInstance().levelData = [];
        LocalStorageController.getInstance().setCoin(0);
        BaskectBallManager.getInstance().score = 0;
        egret.setTimeout(() => {
            this.removeFromParent();
            this._manager.restart();
        }, this, 100);
    }

    private homeHandler(evt: egret.TouchEvent): void {
        Utils.btnChangeByScale(this.m_home_btn, 0.8, 1);
        DataStatisticsJs.logEvent("homeBtn", "pauseView");
        egret.setTimeout(() => {
            this.removeFromParent();
            this._manager.goLobby();
        }, this, 100);
    }

}


