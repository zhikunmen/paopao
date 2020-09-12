class GetGiftView extends DialogBaseView {
    public m_prop_img: eui.Image;

    private _giftType: string;
    public constructor(giftType: string) {
        super();
        this._giftType = giftType;
        this.skinName = "resource/exml/GiftExml.exml";
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
        this.m_prop_img.source = PropManager.getInstance().getSourceByType(this._giftType);
        this.openGift();
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
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();
    }

    private async openGift() {
        await new Promise((resove) => {
            this.m_prop_img.scaleX = this.m_prop_img.scaleY = 2;
            egret.Tween.get(this.m_prop_img).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.bounceInOut);
            let d = AnimationManager.getInstance().getEffectByName("fireworks", "fireworks", "fireworks", true);
            d.x = this.m_prop_img.x;
            d.y = this.m_prop_img.y;
            this.addChild(d);
            d.addEventListener("complete", completeHandler, this);
            function completeHandler() {
                d.parent && d.parent.removeChild(d);
                resove();
            }
        })
        this.m_prop_img.visible = false;
        if (this.parent) {
            let img: eui.Image = new eui.Image(PropManager.getInstance().getSourceByType(this._giftType));
            let pos: egret.Point = PropManager.getInstance().getPosByType(this._giftType);
            img.horizontalCenter = 0;
            img.verticalCenter = -100;
            this.parent.addChild(img);
            egret.Tween.get(img).to({
                horizontalCenter: pos.y,
                verticalCenter: pos.x
            }, 500, egret.Ease.circOut).call(() => {
                PropManager.getInstance().addLimit(this._giftType, true)
                img.parent && img.parent.removeChild(img);

                let d = AnimationManager.getInstance().getEffectByName("prop_bcak_motion", "Prop_bcak_motion", "newAnimation", true);
                d.x = GameConfig.curWidth() / 2 + pos.y;
                d.y = GameConfig.curHeight() / 2 + pos.x;
                this.addChild(d);
                d.addEventListener("complete", completeHandler, this);
                function completeHandler() {
                    d.parent && d.parent.removeChild(d);
                    this.removeFromParent();
                }
            })
        } else {
            PropManager.getInstance().addLimit(this._giftType, true)
        }
    }

    protected touchDarkEnable(): boolean {
        return false;
    }
}


