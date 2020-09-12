class SystemData extends egret.EventDispatcher {

    public static SDKVersion: string = ""; //客户端基础库版本	1.1.0
    public static model: string = ""; //手机型号
    public static system: string = "";
    public static screenWidth: number = 720;
    public static screenHeight: number = 1280;
    public constructor() {
        super();
    }

    public static setSystemData(systemData: { SDKVersion, model, system, screenWidth, screenHeight }) {
        this.SDKVersion = systemData.SDKVersion;
        this.model = systemData.model;
        this.system = systemData.system;
        this.screenWidth = systemData.screenWidth;
        this.screenHeight = systemData.screenHeight;
    }
}
