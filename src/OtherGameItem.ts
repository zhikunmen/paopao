class OtherGameItem extends core.EUIComponent {
    public m_label: eui.Label;
    public m_index_0: eui.Image;
    public m_index_5: eui.Image;
    public m_index_1: eui.Image;
    public m_index_2: eui.Image;
    public m_index_3: eui.Image;
    public m_index_4: eui.Image;
    public m_container: eui.Image;
    public m_label_playercount: eui.Label;

    private _manager: BaskectBallManager;
    private _othergameItem: IOthergameItem;
    private _index: number = 0;
    private _source: string;
    public constructor(source: string) {
        super();
        this._source = source;
        this.visible = false;
        this.skinName = "resource/exml/OtherGameExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();

    }

    public set source(s:string){
        this._source = s;
    }

    public init(data: IOthergameItem, index: number): void {
        this._othergameItem = data;
        this._index = index;
        this.visible = true;

        this["m_index_" + this._index % 4].visible = true;
        this.m_label_playercount.text = BaskectBallManager.getInstance().othergamePeopleCount[this._index] + "万人在玩";
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
            DataStatisticsJs.logEvent("recommonGame", "lobbyview");
            SoundMgr.getInstance().playWa();
            // {"appid":"xxx", "path":"xxx", "shield_ios": xxx} 
            let data = this._othergameItem.data;
            let self = this;
            wx.navigateToMiniProgram({
                appId: data.appid,
                path: data.path,
                extraData: {},
                success(res) {
                    self.upload("enable", data.appid);
                },
                fail(res) {
                    self.upload("cancel", data.appid);
                }
            })
        }, this)
    }

    private upload(action: string, target: string): void {
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

window['OtherGameItem'] = OtherGameItem;

