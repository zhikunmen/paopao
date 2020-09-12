class GetBagView extends DialogBaseView {
    public nm_getBtn: eui.Image;
    public m_count: eui.Label;
    public m_close: eui.Image;

    public constructor() {
        super();
        this.skinName = "resource/exml/RebBagGetExml.exml";
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

        this.m_count.text = "福券X" + RedManager.getInstance().bonuses + "";
       
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
        this.nm_getBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.getGiftHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.nm_getBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.getGiftHandler, this);
    }

    private getGiftHandler(evt: egret.TouchEvent): void {
        Utils.btnChangeByScale(this.nm_getBtn, 0.8, 1);
        DataStatisticsJs.logEvent("goMallBtn", "redbagView");
        let self = this;
        egret.setTimeout(()=>{
            this.removeFromParent();
        },this,100)
    }

    private passHandler(): void {
        DataStatisticsJs.logEvent("passBtn", "redbagView");
        Utils.btnChangeByScale(this.m_close, 0.8, 1);
        this.removeFromParent();
    }

    private openGift(): void {

    }

    protected touchDarkEnable(): boolean {
        return false;
    }
}


