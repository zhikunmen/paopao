/**
  * 游戏配置文件
  */
module GameConfig {

    //当前舞台
    export function curStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    //当前面板
    export var curPanel: egret.DisplayObjectContainer;

    //当前游戏宽度
    export function curWidth(): number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    //当前游戏宽度
    export function curHeight(): number {
        return egret.MainContext.instance.stage.stageHeight;
    }

    export var openLobby: boolean = true;
    export var httpServerBaseURL: string = "";
    export var socketBaseURL: string = "";
    export var channelId: string = "";
    export var testUid: string = "";
    export var gameName: string = "";
    export var gameVer: string = "1.0.27";

    /**
     * 微信广告id
     */
    export var adId: string = "";
    export var bannerAdId: string = "";
    /**
     * 微信分配的appid
     */
    export var wxAppId: string = "";

    //分享信息
    export var shareInfo: any[] = [
        {
            "title": "我在玩泡泡龙",
            "url": "https://res.12317wan.com/resource/game/2574//snake-zz/share/1.png"
        }
    ];

    var shareIdx: number = 0; 
    export function getKey() { return this.key };
    export function getAppCode() { return this.appCode };  

    export var openGUI: boolean = false;
    export var openMatterDebugger: boolean = false;
    
    // export var baseurl:string = "https://nanapi.szvi-bo.com/"  // 测试
    export var baseurl:string = "https://ydhwslb.szvi-bo.com/"  // 线上
    export var appid:string = "wxf83d74de62ec6abb"
    export var debugger1:boolean = false;

    window["game_config"] = {};
    
    window["game_config"].logoBase64 = "";

    export var levelConfig: ILevelConfig[] = [];
    export function setLevelConfig(config) {
        levelConfig = [];
        for (let i = 0; i < config.length; i++) {
            levelConfig.push(
                {
                    score: config[i][0],
                    row_1: config[i][1],
                    row_2: config[i][2],
                    rewardp: config[i][3],
                    bullet: config[i][4],
                    balls1: config[i][5],
                    balls2: config[i][6]
                }
            )
        }
    }
}
interface ILevelConfig {
    score: number,
    row_1: number,
    row_2: number,
    rewardp: number,
    bullet: number,
    balls1: number[],
    balls2: number[]
}