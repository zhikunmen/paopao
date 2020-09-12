
enum OverType {
    TIME_OUT,
    LINE_OUT,
    OTHER_LINE_OUT
}

enum SETTLE_TYPE {
    WIN = 2,
    LOST = 4,
    DRAW = 3
}
class BaskectBallManager extends egret.EventDispatcher {
    public static SCORE_CHANGE: string = "score_change";
    public static ADD_NEW_ROW: string = "addNewRow";
    public static GO_ON_GAME: string = "goonGame";
    public static RESTART: string = "restart";
    public static REBORN: string = "reborn";
    public static OPP_SCORE_CHANGE: string = "opp_score_change";


    private _shareLimit: number = 10;
    public rebornTime: number = 0;
    private _score: number = 0;
    private _oppScore: number = 0;

    private _curShootIndex: number = 0;
    public preparePosY: number = 1195 - 34;
    private _mainView: MainView;

    public othergamePeopleCount: number[] = [200, 300, 102, 300, 313, 200, 300, 102, 300, 313];

    public dddd: number = 2.5;
    private _controlLineArr: eui.Image[] = [];

    public isFirst: boolean = true; //第一次发射不显示特效
    public hadCollect: boolean = false;

    public closeBtnTimer: number = 3000;//关闭界面延迟三秒出现

    private _timeout: number = 0;
    public timeoutLimit: number = 150;
    private _updateScoreInterval: number = -1;

    public isTouching: boolean = false;

    public curFirstLineY:sharp.Point = null;

    public overType = OverType.TIME_OUT; // 游戏结束的类型： "TIME_OUT" 时间结束 "OVER_LINE" 触碰底线

    /**
     * 场景值
     */
    public _scene: number = 0;
    public get scene(): number {
        return 0;

    }

    /**
     * 分享限制
     */
    public getShareLimit(): void {
        let accountid: string = "";
        if (LocalStorageController.getInstance().getAccountID()) {
            accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
        }
        let self = this;
        Http.get(GameConfig.baseurl + `getremainder?appid=${GameConfig.appid}` + accountid + `&module=share`).then((res) => {
            egret.log("当前剩余分享次数：" + res["remainder"])
            self.shareLimit = res["remainder"];
        }, (res) => {
        })
    }

    public get shareLimit(): number {
        return this._shareLimit;
    }
    public set shareLimit(sl: number) {
        this._shareLimit = sl;
    }

    public get curShootIndex(): number {
        return this._curShootIndex;
    }
    public set curShootIndex(sl: number) {
        this.dispatchEvent(new egret.Event("cur_shoot_change"))
        this._curShootIndex = sl;
    }

    public subShareLimit(): void {
        this.shareLimit--;

        let accountid: string = "";
        if (LocalStorageController.getInstance().getAccountID()) {
            accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
        }
        let self = this;
        Http.get(GameConfig.baseurl + `updateremainder?appid=${GameConfig.appid}` + accountid + `&module=share&action=fetch`).then((res) => {
            self.shareLimit = res["remainder"];
        }, (res) => {
            debugger;
        })
    }


    public get controlLineArr(): eui.Image[] {
        return this._controlLineArr;
    }

    public set controlLineArr(c: eui.Image[]) {
        this._controlLineArr = c;
    }

    private static s_instance: BaskectBallManager;
    public static getInstance(): BaskectBallManager {
        if (BaskectBallManager.s_instance == null) {
            BaskectBallManager.s_instance = new BaskectBallManager();
        }
        return BaskectBallManager.s_instance;
    }

    public constructor() {
        super();

        // this._updateScoreInterval = setInterval(() => {
        //     BattleManager.getInstance().postMessage({
        //         type: "score",
        //         data: {
        //             score: this._score
        //         }
        //     })
        // }, 1000);
    }

    private _clock: number = -1;
    private _clockTimeStart: number = -1;
    public startClock(): void {
        this._clockTimeStart = Date.now();
        this.timeout = this.timeoutLimit;
        let self = this;
        this._clock = setInterval(() => {
            let now = Date.now();
            if (now - self._clockTimeStart >= 1000) {
                self.timeout -= ((now / 1000 - self._clockTimeStart / 1000) >> 0);
                self._clockTimeStart = now;
            }
        }, 100)
    }

    public stopCountDown() {
        clearInterval(this._clock);
        this._clock = -1;
    }

    public set timeout(t: number) {
        this._timeout = t;
        if (this._timeout <= -1) {
            GameManager.getInstance().dispatchEvent(new egret.Event("time_up"));
            clearInterval(this._clock);
        } else {
            GameManager.getInstance().dispatchEvent(new egret.Event("clock"));
        }
    }

    public get timeout(): number {
        return this._timeout;
    }

    public get score(): number {
        return this._score;
    }

    public set score(s: number) {
        this._score = s;
        this.dispatchEvent(new egret.Event(BaskectBallManager.SCORE_CHANGE));
    }

    /**
     * 对手的分数
     */
    public get oppScore(): number {
        return this._oppScore;
    }

    public set oppScore(s: number) {
        this._oppScore = s;
        this.dispatchEvent(new egret.Event(BaskectBallManager.OPP_SCORE_CHANGE));
    }

    public getCurConfig(): ILevelConfig {
        let config = GameConfig.levelConfig;

        if (this._score > 59800) {
            if (parseInt((this._score - 59800) / 1200 + "") % 2 == 0) {
                return config[config.length - 2];
            } else {
                return config[config.length - 1];
            }
        }

        for (let i = 0; i < config.length; i++) {
            if (!config[i + 1]) {
                return config[i];
            }
            if (this._score >= config[i].score && this._score < config[i + 1].score) {
                return config[i];
            }
        }
        return null;
    }

    /**
     * 当前已经射击的个数
     */
    public hasUseProps: boolean = false;
    public async addCurShootIndex() {
        let self = this;
        return new Promise((resolve) => {
            self.curShootIndex++;
            egret.log("ShootIndex" + self.curShootIndex, this.getCurConfig().bullet);
            if (self.curShootIndex >= this.getCurConfig().bullet) {
                if (!self.hasUseProps) {
                    egret.setTimeout(() => {
                        resolve();
                    }, self, 500);
                    self.dispatchEvent(new egret.Event(BaskectBallManager.ADD_NEW_ROW));
                } else {
                    resolve();
                }
                self.curShootIndex = 0;
                self.hasUseProps = false;
            } else {
                resolve();
            }
        })

    }

    public async checkAddrowLess(meshContainer: MeshContainer) {
        let self = this;
        return new Promise((resolve) =>{
            self.curShootIndex = 0;
            self.dispatchEvent(new egret.Event(BaskectBallManager.ADD_NEW_ROW));
            resolve();
        })
    }

    /**
     * 继续游戏
     */
    public goonGame(): void {
        this.dispatchEvent(new egret.Event(BaskectBallManager.GO_ON_GAME));
    }

    public restart(): void {

        this.dispatchEvent(new egret.Event(BaskectBallManager.RESTART));
        this.reset();
        BaskectBallManager.getInstance().initMainGame();
    }

    public initMainGame(): void {
        if (this._mainView) {
            this._mainView.parent && this._mainView.parent.removeChild(this._mainView);
            this._mainView = null;
        }
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).removeChildren();
        let bg: eui.Image = new eui.Image('bg_jpg');
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(bg);
        bg.verticalCenter = 0;
        bg.horizontalCenter = 0;

        this._mainView = new MainView();
        this._mainView.verticalCenter = 0;
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(this._mainView);
    }

    public goLobby(): void {
        let lobbyView: LobbyView = new LobbyView();
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).removeChildren();
        core.LayerCenter.getInstance().getLayer(LayerEnum.UI).addChild(lobbyView);
    }

    /**
     * 是不是在主游戏界面
     */
    public isInMainGame(): boolean {
        if (this._mainView && this._mainView.parent) {
            return true;
        }
        return false;
    }


    /**
     * 重置
     */
    public reset(): void {
        this.curShootIndex = 0;
        this._score = 0;
    }

    /**
     * 复活
     */
    public reborn(): void {
        this.dispatchEvent(new egret.Event(BaskectBallManager.REBORN));
    }
}