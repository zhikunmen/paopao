class MallView extends DialogBaseView {
    public m_close: eui.Image;
    public m_total: eui.Label;
    public m_container: eui.Scroller;
    public m_list_container: eui.Group;
    public m_coin: eui.Label;
    public m_ad_pos: eui.Group;

    public constructor() {
        super();
        this.skinName = "resource/exml/MallExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();

        for (let i = 0; i < 3; i++) {
            let mallItem: MallItem = new MallItem();
            mallItem.init({ index: i })
            this.m_list_container.addChild(mallItem);
        }

    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        this.m_coin.text = Utils.nFormatter(LocalStorageController.getInstance().coin, 0);

    }
    /**
	 * 显示
	 */
    protected onHide(event?: egret.Event): void {
        super.onHide();

        if (BaskectBallManager.getInstance().isInMainGame()) {
        }
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        super.addListener();

        BaskectBallManager.getInstance().addEventListener("coin_change", this.coinChangeHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        BaskectBallManager.getInstance().removeEventListener("coin_change", this.coinChangeHandler, this);
    }

    private coinChangeHandler(evt: egret.Event): void {
        this.m_coin.text = Utils.nFormatter(LocalStorageController.getInstance().coin, 0);
    }

    private getGiftHandler(evt: egret.TouchEvent): void {

    }

    protected touchDarkEnable(): boolean {
        return false;
    }
}


