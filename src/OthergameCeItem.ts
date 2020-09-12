class OthergameCeItem extends core.EUIComponent {
    public m_label: eui.Label;
    public m_container: eui.Image;

    private _manager: BaskectBallManager;
    private _othergameItem: IOthergameItem;

    private _source: string;
    public constructor(source: string) {
        super();
        this._source = source;
        this.skinName = "resource/exml/OthergameCeItemExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public init(data: IOthergameItem, index: number): void {
        this._othergameItem = data;

        this.m_container.source = this._othergameItem.icon;
        this.m_label.text = this._othergameItem.title;
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();
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

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            SoundMgr.getInstance().playWa();
            // {"appid":"xxx", "path":"xxx", "shield_ios": xxx} 
            let data = this._othergameItem.data;
            let self = this;
            wx.navigateToMiniProgram({
                appId: data.appid,
                path: data.path,
                extraData: {},
                success(res) {
                    self.upload("enable",data.appid);
                },
                fail(res) {
                    self.upload("cancel",data.appid);
                }
            })
        }, this)
    }

    private upload(action: string,target:string): void {
        let account_id = LocalStorageController.getInstance().getAccountID();
        if (account_id == 'undefined') {
            account_id = '';
        }
        Http.get(GameConfig.baseurl + `clickcount?appid=${GameConfig.appid}&account_id=${account_id}&source=${this._source}&target=${target}&action=${action}`).then((res) => {
            egret.log("ok")
            egret.log(GameConfig.baseurl + `clickcount?appid=${GameConfig.appid}&account_id=${account_id}&source=${this._source}&target=${target}&action=${action}`);
        }, (res) => {
            egret.log("no ok")
            egret.log(GameConfig.baseurl + `clickcount?appid=${GameConfig.appid}&account_id=${account_id}&source=${this._source}&target=${target}&action=${action}`);
        })
    }

	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

    }

    /**
     * 继续游戏
     */
    private goonHandler(evt: egret.TouchEvent): void {
    }

}

window['OthergameCeItem'] = OthergameCeItem;

