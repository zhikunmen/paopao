class DangerView extends DialogBaseView {
    public static NextScore: number = 0;

    public m_get_btn: eui.Group;
    public m_video_btn: eui.Group;
    public m_share_btn: eui.Group;
    public m_pass_btn: eui.Label;
    private _giftType: string;


    public constructor(giftType: string) {
        super();
        this.skinName = "resource/exml/DangerTipView.exml";
        this._giftType = giftType;
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

        this.m_share_btn.visible = this.m_video_btn.visible = false;

        // this.m_pass_btn.visible = false;
        // egret.Tween.get(this).wait(BaskectBallManager.getInstance().closeBtnTimer).call(() => {
        //     this.m_pass_btn.visible = true;
        // })

        let { screenWidth, screenHeight } = wx.getSystemInfoSync()
        this.m_pass_btn.bottom = 100;
    }

    /**
    * 显示
    */
    protected onHide(event?: egret.Event): void {
        super.onHide();

        egret.Tween.removeTweens(this);
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        super.addListener();
        this.m_get_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.getGiftHandler, this);
        this.m_pass_btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.passHandler, this);
    }

    /**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.m_get_btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.getGiftHandler, this);
        this.m_pass_btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.passHandler, this);
    }

    private getGiftHandler(evt: egret.TouchEvent): void {
        SoundMgr.getInstance().playWa();
        DataStatisticsJs.logEvent("getGiftBtn", "dangerview");
        let self = this;
        self.openGift();
    }

    // 1、危险提示
    // 2、随机礼包
    // 3、点击道具
    // 4、福卡礼包

    private openGift(): void {
        let img: eui.Image = new eui.Image(PropManager.getInstance().getSourceByType(this._giftType));
        let pos: egret.Point = PropManager.getInstance().getPosByType(this._giftType);
        img.horizontalCenter = 0;
        img.top = 300;
        core.LayerCenter.getInstance().getLayer(LayerEnum.TOP).addChild(img);
        egret.Tween.get(img).wait(1000).to({
            horizontalCenter: pos.x,
            top: GameConfig.curHeight() / 2 + pos.y
        }, 1500, egret.Ease.circOut).call(() => {
            PropManager.getInstance().addLimit(this._giftType, true)
            img && img.parent && img.parent.removeChild(img);
        })
        this.removeFromParent();
    }

    private passHandler(): void {
        DataStatisticsJs.logEvent("passBtn", "dangerview");
        this.removeFromParent();
    }


    protected touchDarkEnable(): boolean {
        return false;
    }
}


