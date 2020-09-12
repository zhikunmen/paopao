class SevendayItem extends core.EUIComponent {
    public m_btn_get: eui.Image;
    public m_btn_go: eui.Image;
    public m_btn_geted: eui.Image;
    public m_progressbar: eui.ProgressBar;
    public m_title: eui.Label;
    public m_coin: eui.Label;

    private _index: number;
    private _parent: SevenDayView;
    public constructor() {
        super();
        this.skinName = "resource/exml/SevendayItemExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public init(index: number, parent: SevenDayView): void {
        this._index = index;
        this._parent = parent;
        let arr = LocalStorageController.getInstance().sevendayData;

        switch (index) {
            case 0:
                this.m_title.text = "消除100个泡泡";
                this.m_progressbar.maximum = 100;
                this.m_progressbar.value = arr[1];
                this.m_coin.text = "x10000"
                break;
            case 1:
                this.m_title.text = "邀请1位好友";
                this.m_progressbar.maximum = 1;
                this.m_progressbar.value = arr[2];
                this.m_coin.text = "x10000"
                break;
            case 2:
                this.m_title.text = "进行10分钟游戏";
                this.m_progressbar.maximum = 600;
                this.m_progressbar.value = arr[3];
                this.m_coin.text = "x10000"
                break;
            case 3:
                this.m_title.text = "使用任意一个道具";
                this.m_progressbar.maximum = 1;
                this.m_progressbar.value = arr[4];
                this.m_coin.text = "x10000"
                break;
            case 4:
                this.m_title.text = "进行2次转盘抽奖";
                this.m_progressbar.maximum = 2;
                this.m_progressbar.value = arr[5];
                this.m_coin.text = "x10000"
                break;
        }

        this.updateBtn();
    }

    private updateBtn(): void {
        if (this.m_progressbar.maximum <= this.m_progressbar.value){
            if(LocalStorageController.getInstance().sevendayGet[this._index + 1] == 0){
                LocalStorageController.getInstance().sevendayGet[this._index + 1] = 1;
            }
        }
        if (this.m_progressbar.maximum <= this.m_progressbar.value && LocalStorageController.getInstance().sevendayGet[this._index + 1] == 1) {
            this.m_btn_go.visible =
                this.m_btn_geted.visible = false;
            this.m_btn_get.visible = true;
        } else if (this.m_progressbar.maximum <= this.m_progressbar.value && LocalStorageController.getInstance().sevendayGet[this._index + 1] == 2) {
            this.m_btn_go.visible =
                this.m_btn_get.visible = false;
            this.m_btn_geted.visible = true;
        } else {
            this.m_btn_go.visible = true;
            this.m_btn_geted.visible =
                this.m_btn_get.visible = false;
        }
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

        this.m_btn_go.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goonHandler, this);
        this.m_btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.m_btn_go.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goonHandler, this);
        this.m_btn_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getHandler, this);
    }

    private getHandler(evt: egret.TouchEvent): void {
        LocalStorageController.getInstance().coin += 10000;
        ToastManager.addPopUp("恭喜获得10000金币");
        LocalStorageController.getInstance().sevendayGet[this._index + 1] = 2;
        this.updateBtn();
    }

    /**
     * 继续游戏
     */
    private goonHandler(evt: egret.TouchEvent): void {
        //  0〉〉点击前往游戏界面
        //  1〉〉点击前往按钮时关闭每日任务面板，打开邀请好友界面
        //  2〉〉点击前往游戏界面
        //  3〉〉点击前往游戏界面
        //  4〉〉点击前往转盘界面
        let manager: BaskectBallManager = BaskectBallManager.getInstance();
        this._parent.removeFromParent();
        switch (this._index) {
            case 0:
                if (manager.isInMainGame()) {
                } else {
                    manager.initMainGame();
                }
                break;
            case 1:
                break;
            case 2:
                if (manager.isInMainGame()) {
                } else {
                    manager.initMainGame();
                }
                break;
            case 3:
                if (manager.isInMainGame()) {
                } else {
                    manager.initMainGame();
                }
                break;
            case 4:
                let luckView: LuckyTurntableView = new LuckyTurntableView();
                luckView.popUp();
                break;
        }
    }

}

window['SevendayItem'] = SevendayItem;

