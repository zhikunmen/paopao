declare module Game {
    /**
     * 获取游戏token
     * 游戏内自己去实现回调
     *  */
    function onGameTokenResult(params: gmbox.IUserInfo): void;
    /**退出游戏事件 */
    function OnExit(): void;
}
declare module gmbox {
    const android: any;
    const battleBridge: any;
    let gameGameInfoCallBack: any;
    /**关闭游戏的回调 */
    let exitCallBack: any;
    /** 请求登录信息 包含token*/
    function login(params: {
        loginOpts: ILoginParams;
        callback: Function;
    }): any;
    function login(params: {
        success?: ILoginParams;
        fail?: Function;
        complete?: Function;
        timeout?: Number;
    }): any;
    /**获取客户端版本号 */
    function platformVersion(): number;
    /**
     * 设置加载进度
     * @param progress {string} 设置进度
     *  */
    function setLoadingProgress(progress: any): any;
    /**
     * 加载完成，关闭挡板
     */
    function loadingComplete(): void;
    /**
     * 游戏开始
     */
    function gameStart(pkgName: string): void;
    /**
     * 游戏结束
     */
    function gameOver(pkgName: string): void;
    /**
     * 打开排行榜
     */
    function openRankPage(): void;
    /**
     * 分享
     * @param param
     * type: 1:积分 2关卡 3连胜
     */
    function share(param: {
        score: number;
    }): void;
    /**
     * 更新排行榜数据
     */
    function updateGameRank(params: IGameRankParams): void;
    /**
     * 显示Toast
     */
    function showToast(): any;
    /**
     * 获取网络状态 NetworkType
     */
    function getNetworkType(): string;
    /**
     * 给游戏调用，可以隐藏/显示回退箭头以及麦克风View
     * param：{"action":"1"} //1.隐藏回退键 2. 显示回退键 3. 隐藏麦克风 4. 显示麦克风
     */
    function updateActionView(params: string): any;
    /**
     * 用户信息返回
     *  */
    interface IUserInfo {
        /**用户id */
        userId: string;
        /**用户名 */
        userName: string;
        /**用户头像地址 */
        avatar: string;
        /**用户星座 */
        constellation: string;
        /**性别F女M男 */
        sex: string;
        /**用户所在地 */
        location: string;
        /**年龄 */
        age: string;
        /**返回信息 */
        code: number;
        /**状态码 */
        msg: string;
        /**token*/
        token: string;
    }
    /**
     * 网络状态
     */
    const NetworkType: {
        WIFI: string;
        MOBILE: string;
        UNAVAILABLE: string;
    };
    interface IBattlePlayer {
        userId: string;
        nickname: string;
        headIconUrl: string;
        sex: string;
        type: number;
    }
    interface IGameRankParams {
        type: number;
        value: number;
    }
    /**游戏属性 */
    interface ILoginParams {
        /**游戏上架时分配的Key */
        appId: string;
    }
    interface IInitBattleData {
        roomId: string;
        gameId: string;
        players: IBattlePlayer[];
    }
    class Battle {
        private _onStartcb;
        private _onMessagecb;
        private _onForceQuitcb;
        private _updateVoiceStatus;
        init(params: {
            success?: Function;
            fail?: Function;
            complete?: Function;
        }): void;
        ready(): void;
        postMessage(param: string): void;
        postResult(param: string): void;
        /**游戏开始回调 */
        onStart(callback: any): void;
        /**游戏中收到回调 */
        onMessage(callback: any): void;
        /**对方强制结束游戏收到回调 */
        onForceQuit(callback: any): void;
        /**收到语音状态通知
         * '{"userId":"10000016","status":1}'
        */
        updateVoiceStatus(callback: any): void;
    }
}
/**
 * onLoad回调
 */
declare function onLoad(): void;
/**
 * 切换后台回调
 */
declare function onEnterbackground(): void;
/**切换前台回调 */
declare function onEnterforeground(): void;
/**load finish回调 */
declare function onFinish(): void;
/**获得战斗实例 */
declare function getBattle(): any;
