class PlugPropView extends DialogBaseView {
    public m_mall_btn: eui.Group;
    public m_btn_get_mall: eui.Group;
    public m_btn_geted0: eui.Image;
    public m_coin_mall: eui.Label;
    public m_btn_go_mall_derection: eui.Group;
    public m_btn_geted1: eui.Image;
    public m_dd0: eui.Label;
    public m_luck_btn0: eui.Image;
    public m_btn_go_redbag: eui.Group;
    public m_redbagItem: eui.Group;
    public m_btn_geted2: eui.Image;
    public m_coin_redbag: eui.Label;
    public m_redbag: eui.Image;
    public m_btn_go_luck: eui.Group;
    public m_btn_go_redbag_derection: eui.Group;
    public m_close: eui.Label;

    private _type: string = '';

    public constructor(t: string) {
        super();
        this._type = t;
        this.skinName = "resource/exml/PlugPropExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        if (!RedManager.getInstance().switch) {
            this.m_redbagItem.visible = false;
        }

        let t = this._type;
        if (t == PropManager.PROP_RAINBOW) {
            this.m_coin_mall.text = 15000 + "";
        } else if (t == PropManager.PROP_LASER) {
            this.m_coin_mall.text = 35000 + "";
        } else if (t == PropManager.PROP_tonghang) {
            this.m_coin_mall.text = 35000 + "";
        }

        if (t == PropManager.PROP_RAINBOW) {
            this.m_coin_redbag.text = 25 + "";
        } else if (t == PropManager.PROP_LASER) {
            this.m_coin_redbag.text = 50 + "";
        } else if (t == PropManager.PROP_tonghang) {
            this.m_coin_redbag.text = 50 + "";
        }

        this.m_btn_go_luck.visible = this.m_btn_go_redbag_derection.visible = false;

        let self = this;
        self.m_btn_get_mall.visible = self.m_btn_go_mall_derection.visible = false;
        let coin: number = LocalStorageController.getInstance().coin;
        if (this._type == PropManager.PROP_RAINBOW) {
            if (coin < 15000) {
                self.m_btn_go_mall_derection.visible = true;
            } else {
                self.m_btn_get_mall.visible = true;
            }
        } else if (this._type == PropManager.PROP_LASER) {
            if (coin < 35000) {
                self.m_btn_go_mall_derection.visible = true;
            } else {
                self.m_btn_get_mall.visible = true;
            }
        } else if (this._type == PropManager.PROP_tonghang) {
            if (coin < 35000) {
                self.m_btn_go_mall_derection.visible = true;
            } else {
                self.m_btn_get_mall.visible = true;
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

        this.m_btn_get_mall.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goMallHandler, this);
        this.m_btn_go_redbag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goLuckHandler, this);
        this.m_btn_go_luck.addEventListener(egret.TouchEvent.TOUCH_TAP, this.redbagHandler, this);
        this.m_btn_go_mall_derection.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gomallDeretionHandler, this);
        this.m_btn_go_redbag_derection.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goredbagDeretionHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.m_btn_get_mall.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goMallHandler, this);
        this.m_btn_go_redbag.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goLuckHandler, this);
        this.m_btn_go_luck.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.redbagHandler, this);
        this.m_btn_go_mall_derection.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gomallDeretionHandler, this);
        this.m_btn_go_redbag_derection.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goredbagDeretionHandler, this);
    }

    private gomallDeretionHandler(evt: egret.Event): void {
        let mallView: MallView = new MallView();
        mallView.popUp();
    }

    private goredbagDeretionHandler(evt: egret.Event): void {
    }

    private goMallHandler(evt: egret.Event): void {
        this.removeFromParent();

        let coin: number = LocalStorageController.getInstance().coin;
        if (this._type == PropManager.PROP_RAINBOW) {
            if (coin < 15000) {
                goMall();
                return;
            } else {
                LocalStorageController.getInstance().coin -= 15000;
                PropManager.getInstance().addLimit(PropManager.PROP_RAINBOW, true);
                BaskectBallManager.getInstance().dispatchEvent(new egret.Event("coin_change"));
                ToastManager.addPopUp("购买成功");
            }
        } else if (this._type == PropManager.PROP_LASER) {
            if (coin < 35000) {
                goMall();
                return;
            } else {
                LocalStorageController.getInstance().coin -= 35000;
                PropManager.getInstance().addLimit(PropManager.PROP_LASER, true);
                BaskectBallManager.getInstance().dispatchEvent(new egret.Event("coin_change"));
                ToastManager.addPopUp("购买成功");
            }
        } else if (this._type == PropManager.PROP_tonghang) {
            if (coin < 35000) {
                goMall();
                return;
            } else {
                LocalStorageController.getInstance().coin -= 35000;
                PropManager.getInstance().addLimit(PropManager.PROP_tonghang, true);
                BaskectBallManager.getInstance().dispatchEvent(new egret.Event("coin_change"));
                ToastManager.addPopUp("购买成功");
            }
        }

        function goMall() {
            let mallView: MallView = new MallView();
            mallView.popUp();
        }

    }

    private goLuckHandler(evt: egret.Event): void {
        this.removeFromParent();
        let luckView: LuckyTurntableView = new LuckyTurntableView();
        luckView.popUp();
    }

    private redbagHandler(evt: egret.Event): void {
        this.removeFromParent();
    }

    protected touchDarkEnable(): boolean {
        return false;
    }
}


