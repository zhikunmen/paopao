class CollectView extends DialogBaseView {
    public m_close: eui.Image;
    private g1;
    public image: eui.Image;

    private _isOpenLuck: boolean;
    private _isShowMainviewAd: boolean;
    
    public constructor(isOpenLuck: boolean = false,isShowMainviewAd:boolean = true) {
        super();
        this._isShowMainviewAd = isShowMainviewAd;
        this._isOpenLuck = isOpenLuck;
        this.skinName = "resource/exml/CollectExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.left = this.right = this.top = this.bottom = 0;
        this.m_close.visible = false;
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();
        if (LocalStorageController.getInstance().getcollect() == 1) {
            this.g1.play();
            this.image.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getHandler, this);
        } else {
            Utils.gray(this.image);
        }

        egret.setTimeout(() => {
            this.m_close.visible = true;
        }, this, 3000)
    }

    private getHandler(evt: egret.Event): void {
        LocalStorageController.getInstance().setcollect(2);
        PropManager.getInstance().addLimit(PropManager.PROP_LASER, true);
        PropManager.getInstance().addLimit(PropManager.PROP_RAINBOW, true);
        this.removeFromParent();
        ToastManager.addPopUp("恭喜获得全能球×1，激光球×1");
        BaskectBallManager.getInstance().dispatchEvent(new egret.Event("collect_get"));
    }

    /**
    * 显示
    */
    protected onHide(event?: egret.Event): void {
        super.onHide();
        if(this._isShowMainviewAd){
        }
        
        if (this._isOpenLuck) {
            if(!LocalStorageController.getInstance().curDayfirst || LocalStorageController.getInstance().curDayfirst != (new Date()).getDate()){
                LocalStorageController.getInstance().curDayfirst = (new Date()).getDate();
                let sevenday: SevenDayView = new SevenDayView(true);
                sevenday.popUp();
            }else{
                let accountid: string = "";
                if (LocalStorageController.getInstance().getAccountID()) {
                    accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
                }
                Http.get(GameConfig.baseurl + `getremainder?appid=${GameConfig.appid}` + accountid + `&module=lottery`).then((res) => {
                    egret.log(JSON.stringify(res));
                    if (res["remainder"]) {
                        let luckView: LuckyTurntableView = new LuckyTurntableView();
                        luckView.popUp();
                    }
                }, (res) => {
                    debugger;
                })
            }
        }
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

        this.image.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getHandler, this);

    }

    protected touchDarkEnable(): boolean {
        return false;
    }
}


