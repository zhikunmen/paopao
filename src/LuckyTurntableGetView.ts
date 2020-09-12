/**
 * 转盘
 */
class LuckyTurntableGetView extends DialogBaseView {
    public m_close1: eui.Label;
    public m_add2: eui.Image;
    public m_add1: eui.Image;
    public m_prop: eui.Image;
    public m_ad_pos: eui.Group;
    public m_prop_name: eui.Label;
    public m_desc: eui.Label;
    public m_video_get: eui.Group;

    private _data: { type: string, title: string };
    constructor(data: { type: string, title: string }) {
        super();
        this._data = data;
        this.skinName = "resource/exml/LuckGetViewExml.exml";
    }

    /**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        this.addListener();
        this.left = this.right = 0;
        this.verticalCenter = 0;
        this.m_prop_name.text = this._data.title + "";
        this.m_prop.source = this._data.type;

        this.m_add1.visible = true;
        this.m_add2.visible = false;

        if (this._data.title == "激光球") {
            this.m_desc.text = "能消除直线上所有球";
            PropManager.getInstance().addLimit(PropManager.PROP_LASER, true);
        } else if (this._data.title == "万能球") {
            this.m_desc.text = "能消耗周围所有同色球";
            PropManager.getInstance().addLimit(PropManager.PROP_RAINBOW, true);
        } else if (this._data.title == "闪电球") {
            this.m_desc.text = "消除改行所有球";
            PropManager.getInstance().addLimit(PropManager.PROP_tonghang, true);
        }

        this.m_close1.visible = false;
        egret.Tween.get(this).wait(BaskectBallManager.getInstance().closeBtnTimer).call(() => {
            this.m_close1.visible = true;
        })
    }

    protected onHide(event?: egret.Event): void {
        super.onHide();

        AdManager.getInstance().removeAllAd();
        if (BaskectBallManager.getInstance().isInMainGame()) {
        }

        egret.Tween.removeTweens(this);

        BaskectBallManager.getInstance().dispatchEvent(new egret.Event("update_redPoint"));
    }

    protected addListener(): void {
        super.addListener();

        this.m_video_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartBtn, this);
        this.m_close1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close1Handler, this);
    }


    protected removeListener(): void {
        super.removeListener();

        this.m_video_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartBtn, this);
        this.m_close1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.close1Handler, this);

    }

    private btnTimer: number = 0;
    private onStartBtn(): void {
        if (egret.getTimer() - this.btnTimer < 5000) {
            return;
        }
        this.btnTimer = egret.getTimer()
    }

    private close1Handler(): void {
        this.removeFromParent();
        egret.setTimeout(() => {
            let luckView: LuckyTurntableView = new LuckyTurntableView(false);
            luckView.popUp();
        }, this, 50);

    }
}