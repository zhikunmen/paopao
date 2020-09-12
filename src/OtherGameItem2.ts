class OtherGameItem2 extends core.EUIComponent {
    public m_container: eui.Group;
    public m_img: eui.Image;
    public m_name: eui.Label;


    private _manager: BaskectBallManager;
    private _othergameItem: IOthergameItem;
    private _index: number = 0;
    private _source: string;
    public constructor(source: string) {
        super();
        this._source = source;
        this.visible = false;
        this.skinName = "resource/exml/OtherGameItem2.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public init(data: IOthergameItem): void {
        this.visible = true;
        this._othergameItem = data;
        this.m_img.source = this._othergameItem.icon;
        this.m_name.text = this._othergameItem.title;
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();


        egret.Tween.get(this.m_container, { loop: true }).to({
            rotation: 20
        }, 200).to({
            rotation: -20
        }, 200).to({
            rotation: 0
        }, 200).wait(2000);
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
            DataStatisticsJs.logEvent("tryGame", "lobbyview");
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

