class MallItem extends core.EUIComponent {
    public m_prop: eui.Image;
    public m_btn: eui.Group;
    public m_count: eui.Label;

    private _data: any;

    public constructor() {
        super();
        this.skinName = "resource/exml/MallItemExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        this.updateBtn();
    }

    private updateBtn():void{
        let coin: number = LocalStorageController.getInstance().coin;
        if (this._data.index == 0) {
            if (coin < 15000) {
                Utils.gray(this.m_btn);
            } else {
                this.m_btn.filters = [];
            }
        } else if (this._data.index == 1) {
            if (coin < 35000) {
                Utils.gray(this.m_btn);
            } else {
                this.m_btn.filters = [];
            }
        } else if (this._data.index == 2) {
            if (coin < 35000) {
                Utils.gray(this.m_btn);
            } else {
                this.m_btn.filters = [];
            }
        }
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

        this.m_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.m_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getHandler, this);
    }

    public init(data: any): void {
        this._data = data;

        if (data.index == 0) {
            this.m_count.text = 15000 + "";
            this.m_prop.source = "prop_rainbow_png";
        } else if (data.index == 1) {
            this.m_count.text = 35000 + "";
            this.m_prop.source = "prop_jiguan_png";
        } else if (data.index == 2) {
            this.m_count.text = 35000 + "";
            this.m_prop.source = "prop_xiaohang_png";
        }
    }

    private getHandler(evt: egret.TouchEvent): void {
        let coin: number = LocalStorageController.getInstance().coin;
        if (this._data.index == 0) {
            if (coin < 15000) {
                ToastManager.addPopUp("金币不足");
                return;
            } else {
                LocalStorageController.getInstance().coin -= 15000;
                PropManager.getInstance().addLimit(PropManager.PROP_RAINBOW, true);
                BaskectBallManager.getInstance().dispatchEvent(new egret.Event("coin_change"));
                ToastManager.addPopUp("购买成功");
                this.updateBtn();
            }
        } else if (this._data.index == 1) {
            if (coin < 35000) {
                ToastManager.addPopUp("金币不足");
                return;
            } else {
                LocalStorageController.getInstance().coin -= 35000;
                PropManager.getInstance().addLimit(PropManager.PROP_LASER, true);
                BaskectBallManager.getInstance().dispatchEvent(new egret.Event("coin_change"));
                ToastManager.addPopUp("购买成功");
                this.updateBtn();
            }
        }else if (this._data.index == 2) {
            if (coin < 35000) {
                ToastManager.addPopUp("金币不足");
                return;
            } else {
                LocalStorageController.getInstance().coin -= 35000;
                PropManager.getInstance().addLimit(PropManager.PROP_tonghang, true);
                BaskectBallManager.getInstance().dispatchEvent(new egret.Event("coin_change"));
                ToastManager.addPopUp("购买成功");
                this.updateBtn();
            }
        }
    }
}

window['MallItem'] = MallItem;