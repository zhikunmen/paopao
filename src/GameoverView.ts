class GameoverView extends DialogBaseView {
    public m_score_txt: eui.BitmapLabel;
    public draw_group: eui.Group;
    public lose_group: eui.Group;
    public win_group: eui.Group;

    private _manager: BaskectBallManager;

    public constructor() {
        super();
        this.skinName = "resource/exml/GameOverExml.exml";
        this._manager = BaskectBallManager.getInstance();
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

        LocalStorageController.getInstance().levelData = [];
        LocalStorageController.getInstance().setCoin(0);
        let manager: BaskectBallManager = BaskectBallManager.getInstance();
        this.m_score_txt.text = manager.score + "";

        let selfScore = manager.score;
        let otherScore = manager.oppScore;
        this.win_group.visible = this.lose_group.visible = this.draw_group.visible = false;
        // 当非常规结束游戏 直接判定为输
        egret.log("游戏正常结束", '本人分数', selfScore, '---', "对手分数", "---", otherScore)
        var settleType = SETTLE_TYPE.DRAW; // 默认值
        if (manager.overType == OverType.LINE_OUT) {
            // 先弹出游戏结算界面，然后通知对手
            SoundMgr.getInstance().playLose();
            this.lose_group.visible = true;

            settleType = SETTLE_TYPE.LOST;
        } else if (manager.overType == OverType.OTHER_LINE_OUT)  {
            // 对手已经碰线 判定己方赢
            settleType = SETTLE_TYPE.WIN;
            this.win_group.visible = true;
            SoundMgr.getInstance().playWin();
        }else {
            if (selfScore < otherScore) { //输
                settleType = SETTLE_TYPE.LOST;
                SoundMgr.getInstance().playLose();
                this.lose_group.visible = true;
            } else if (selfScore > otherScore) { //赢了
                settleType = SETTLE_TYPE.WIN;
                this.win_group.visible = true;
                SoundMgr.getInstance().playWin();
            } else { //平局
                settleType = SETTLE_TYPE.DRAW;
                this.draw_group.visible = true;
                SoundMgr.getInstance().playDraw();
            }
        }


        let self = this;
        setTimeout(this.postResult.bind(this, settleType), 2000);

    }

    protected postResult(type:number) {
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
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();
    }

    private closeBtnClicked(): void {
        let manager: BaskectBallManager = BaskectBallManager.getInstance();
        let selfScore = manager.score;
        let otherScore = manager.oppScore;

    }
}