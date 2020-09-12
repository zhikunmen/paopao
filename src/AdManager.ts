class AdManager extends egret.EventDispatcher {

    private static s_instance: AdManager;
    public static getInstance(): AdManager {
        if (AdManager.s_instance == null) {
            AdManager.s_instance = new AdManager();
        }
        return AdManager.s_instance;
    }

    public constructor() {
        super();
    }

    public removeAllAd():void{
        // for(let i =0;i < WxKit.adArr.length;i ++){
        //     WxKit.adArr[i].hide();
        // }
    }

    public gameoverBanner:any;
    public getGiftBanner:any;
    public pauseViewBanner:any;
    public rebornViewBanner:any;
    public luckViewBanner:any;
}