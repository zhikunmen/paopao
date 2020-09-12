class RedBagMallItem extends eui.Component {
    public m_limit_text: eui.Label;
    public m_prop: eui.Image;
    public m_hot: eui.Image;
    public m_btn: eui.Image;
    public m_count: eui.Label;

    private _manager: BaskectBallManager;
    private _data: IGoodDetail;

    public constructor(data: IGoodDetail) {
        super();
        this._data = data;
        this.skinName = "resource/exml/RedBagMallItemExml.exml";
        this.onShow();
        this.addListener();
    }


	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        this.m_limit_text.text = "限购:" + this._data.stock + "";
        this.m_count.text = Math.floor(this._data.price * 100) + "";
        this.m_prop.source = this._data.type + "_png";
    }

    public get type():string{
        return this._data.type;
    }

    /**
	 * 显示
	 */
    protected onHide(event?: egret.Event): void {

    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        this.m_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goonHandler, this)
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        this.m_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goonHandler, this)
    }

    /**
     * 继续游戏
     */
    public goonHandler(evt: egret.TouchEvent): void {
        Utils.btnChangeByScale(this.m_btn, 0.8, 1);
        RedManager.getInstance().buy(this._data.id,this._data.type);
    }

    public get checkBonuses():boolean{
        return RedManager.getInstance().total_money >= this._data.price * 100 && this._data.stock > 0;
    }
}

window['RedBagMallItem'] = RedBagMallItem;

