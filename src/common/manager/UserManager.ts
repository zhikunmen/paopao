class UserManager extends egret.EventDispatcher {
    public static USER_DATA_CHANGE: string = "user_data_change";

    private openId: string;
    private uid: string;
    private avatar_url: string;
    private nickname: string;
    private gender: string;
    private userInfo: {};
    private _maxScore: number = 0;

    private _coin: number = 0;
    private static s_instance: UserManager;
    public constructor() {
        super();
        this.uid = GameConfig.testUid;
        this.avatar_url = "";
        this.nickname = "test" + GameConfig.testUid;
        this.gender = "M";
        this.openId = "testtest" + GameConfig.testUid + "test";
        this.userInfo = {
            uid: this.uid,
            gender: this.gender,
            nickname: this.nickname,
            openId: this.openId,
            avatar_url: this.avatar_url
        }
    }

    public static getInstance(): UserManager {
        if (UserManager.s_instance == null) {
            UserManager.s_instance = new UserManager();
        }
        return UserManager.s_instance;
    }

    public getNickname() {
        return this.nickname;
    }

    public getOpenId() {
        return this.openId;
    }

    public getUid() {
        return this.uid;
    }

    public getUserData() {
        if (this.userInfo == null) {
            this.uid = GameConfig.testUid;
            this.avatar_url = "";
            this.nickname = "test" + GameConfig.testUid;
            this.gender = "M";
            this.openId = "testtest" + GameConfig.testUid + "test";
            this.userInfo = {
                uid: this.uid,
                gender: this.gender,
                nickname: this.nickname,
                openId: this.openId,
                avatar_url: this.avatar_url
            }
        }
        return JSON.parse(JSON.stringify(this.userInfo));
    }

    //最大分数
    public set maxScore(s: number) {
        this._maxScore = s;
    }
    public get maxScore(): number {
        return this._maxScore || 0;
    }


    //登录用
    public time: string;
    public token: string;

    public setUserData(userData: { userId, wxOpenId, iconUrl, nickName, gender, time?: any, token?: any }) {
        this.avatar_url = userData.iconUrl;
        this.openId = userData.wxOpenId;
        this.nickname = userData.nickName;
        this.gender = userData.gender;
        this.uid = userData.userId;
        if (userData.time) {
            this.time = userData.time;
        }

        if (userData.token) {
            this.token = userData.token;
        }

        this.userInfo = {
            uid: this.uid,
            gender: this.gender,
            nickname: this.nickname,
            openId: this.openId,
            avatar_url: this.avatar_url
        }
        this.dispatchEventWith(UserManager.USER_DATA_CHANGE);
    }

    public set coin(c: number) {
        this._coin = c;
        LocalStorageController.getInstance().setCoin(c);
        this.dispatchEventWith(UserManager.USER_DATA_CHANGE);
    }

    public get coin(): number {
        return LocalStorageController.getInstance().getCoin();
    }
}
