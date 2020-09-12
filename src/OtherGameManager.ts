class OtherGameManager extends egret.EventDispatcher {
    private _othergameArr: IOthergameItem[] = [];
    private static s_instance: OtherGameManager;
    public static getInstance(): OtherGameManager {
        if (OtherGameManager.s_instance == null) {
            OtherGameManager.s_instance = new OtherGameManager();
        }
        return OtherGameManager.s_instance;
    }

    public async init() {
        let self = this;
        return new Promise((resolve, reject) => {
            if(self._othergameArr.length){
                resolve();
                return;
            }
            Http.get(GameConfig.baseurl + `newestsidebox?appid=${GameConfig.appid}&version=${GameConfig.gameVer}`).then((res) => {
                self._othergameArr = res["boxconfig"];
                egret.log("boxconfig:" + self._othergameArr );
                resolve();
            }, (res) => {
                debugger;
            })
        })
    }

    public get otherGameArr(): IOthergameItem[] {
        return this._othergameArr;
    }
}
interface IOthergameItem {
    id: string,
    title: string,
    icon: string,
    status: string,
    data: any
}