//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        // RES.setMaxLoadingThread(1);
        super.createChildren();
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }
        LocalStorageController.getInstance().loadSave();
        //inject the custom material parser
        //注入自定义的素材解析器
       
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        core.LayerCenter.getInstance().init(this.stage);
        core.LayerCenter.getInstance().addLayer(LayerEnum.UI, new core.EUILayer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.HINT, new core.EUILayer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.MENU, new core.Layer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.POPUP, new core.EUILayer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.LOADING, new core.EUILayer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.HINTSEC, new core.Layer());
        core.LayerCenter.getInstance().addLayer(LayerEnum.TOP, new core.EUILayer());
        // GameanalyticsMgr.init();//打点初始化
        game.GameanalyticsMgr.init();
        // Ga
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        GameConfig.setLevelConfig(LevelConfig);
        this.createGameScene();
        SoundMgr.getInstance();
    }

    /**
    * 登陆
    */
    private login(): void {
        console.log('获取微信code');

        wx.login({
            success(res) {
                if (res.code) {
                    let opthions = wx.getLaunchOptionsSync();
                    let extraData: any = {};
                    if (opthions) {
                        extraData["scene"] = opthions["scene"];
                        extraData["query"] = JSON.stringify(opthions["query"]);
                        extraData["referrerInfo"] = JSON.stringify(opthions["referrerInfo"]);

                        let opthionsQuery: any = opthions["query"];
                        if (opthionsQuery && opthionsQuery.sharecard_id && opthionsQuery.account_id) {
                            extraData["detail"] = JSON.stringify({
                                sharecard_id: parseInt(opthionsQuery.sharecard_id),
                                account_id: parseInt(opthionsQuery.account_id),
                                from: opthionsQuery.from
                            });
                        }
                    }
                    let debug = (GameConfig.debugger1 ? 'dev' : 'online');
                    let accountid:string = "";
                    if(LocalStorageController.getInstance().getAccountID()){
                        accountid = "&account_id=" + LocalStorageController.getInstance().getAccountID();
                    }
                    Http.get(GameConfig.baseurl + `newlogin?appid=${GameConfig.appid}&code=${res.code}`+ accountid + `&env=${debug}&version=${GameConfig.gameVer}&extra_data=${JSON.stringify(extraData)}`).then((res)=>{
                        egret.log(JSON.stringify(res));
                        LocalStorageController.getInstance().setAccountID(res["account_id"]);
                        if(res["switch"] == 'on'){
                            SwitchManager.openborn = 1;
                        }
                        RedManager.getInstance().switch = false;
                        if(res["bonus_data"]["bonus_switch"] == 'on' && SwitchManager.openborn){
                            RedManager.getInstance().switch = true;
                            RedManager.getInstance().init(res["bonus_data"]);
                        }
                        BaskectBallManager.getInstance().dispatchEvent(new egret.Event("switch-event"));

                        LuckyTurntableView.init();// 转盘
                    },(res)=>{
                        debugger;
                    })

                    BaskectBallManager.getInstance().getShareLimit();
                }
            }, fail(res) {
                debugger;
                console.log('获取微信code失败了');
            }
        });
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        BaskectBallManager.getInstance().initMainGame();
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}
