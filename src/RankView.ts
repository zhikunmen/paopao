class RankView extends DialogBaseView {
    public static CMD_CLOSE_RANK = "CMD_CLOSE_RANK";
    public static RANK_TYPE_FRIEND = "RANK_TYPE_FRIEND";
    public static RANK_OVER_FRIEND = "RANK_OVER_FRIEND";
    public static CMD_OPEN_RANK = "CMD_OPEN_RANK";

    public m_groupbtn: eui.Group;
    public m_container: eui.Group;
    public m_close: eui.Button;



    private open_data: egret.Sprite;
    private shareTicket: string = "";
    public constructor() {
        super();
        this.skinName = "resource/exml/RankViewExml.exml";
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

        this.m_container.addChild(this.open_data);
        this.open_data.y = 100;
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

        this.m_groupbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

        this.m_groupbtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shareHandler, this);
    }

    private shareHandler(): void {
    }
}


