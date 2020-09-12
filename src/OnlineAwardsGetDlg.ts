class OnlineAwardsGetDlg extends DialogBaseView {
    public m_count: eui.Label;
    public m_normalget_btn: eui.Group;
    public m_3getBtn: eui.Group;

    private _count: number = 0;
    private _parent: LobbyView;
    public constructor(count: number, parent: LobbyView) {
        super();
        this._count = count;
        this._parent = parent;
        this.skinName = "resource/exml/OnlineAwardsDlg.exml";
    }

    public childrenCreated() {
        super.childrenCreated();


    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        this.m_count.text = this._count + "";
    }


    protected onHide(event?: egret.Event): void {
        super.onHide();


    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        super.addListener();
        this.m_normalget_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.normalgetHandler, this);
        this.m_3getBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.times3GetHandler, this);
    }

	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();
        this.m_normalget_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.normalgetHandler, this);
        this.m_3getBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.times3GetHandler, this);
    }

    /**
     * 普通领取
     */
    private normalgetHandler(evt: egret.Event): void {
        this._parent.flyCoins(this._count);
        BaskectBallManager.getInstance().dispatchEvent(new egret.Event("online_awards_geted"));
        this.removeFromParent();
    }

    /**
     * 3倍领取
     */
    private times3GetHandler(evt: egret.Event): void {
    }
}