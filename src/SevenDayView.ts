class SevenDayView extends DialogBaseView {
    public m_item0: SevendayItem;
    public m_item1: SevendayItem;
    public m_item2: SevendayItem;
    public m_item3: SevendayItem;
    public m_item4: SevendayItem;
    public m_close: eui.Label;
    public m_day: eui.Label;
    private _isOpenLuck: boolean;

    public constructor(isOpenLuck: boolean = false) {
        super();
        this._isOpenLuck = isOpenLuck;
        this.skinName = "resource/exml/SevenDayExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public init(): void {
        for (let i = 0; i < 5; i++) {
            (this["m_item" + i] as SevendayItem).init(i, this);
        }
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        DataStatisticsJs.logEvent("open", "SevenDayView");

        for (let i = 0; i < 5; i++) {
            (this["m_item" + i] as SevendayItem).init(i, this);
        }

        if (LocalStorageController.getInstance().sevendayCurDay[1] != (new Date()).getDate()) {
            LocalStorageController.getInstance().sevendayCurDay[0]++;
            LocalStorageController.getInstance().sevendayCurDay[1] = (new Date()).getDate();
        }

        this.m_day.text = LocalStorageController.getInstance().sevendayCurDay[0] % 7 + 1 + "";

        this.m_close.visible = false;
        egret.Tween.get(this).wait(BaskectBallManager.getInstance().closeBtnTimer).call(() => {
            this.m_close.visible = true;
        })
    }
    /**
	 * 显示
	 */
    protected onHide(event?: egret.Event): void {
        super.onHide();

        if (this._isOpenLuck) {
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
        egret.Tween.removeTweens(this);
        BaskectBallManager.getInstance().dispatchEvent(new egret.Event("update_redPoint"));
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

    private getGiftHandler(evt: egret.TouchEvent): void {

    }

    protected touchDarkEnable(): boolean {
        return false;
    }
}


