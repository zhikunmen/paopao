interface IGoodDetail {
    "id": number,
    "price": number,
    "type": string,
    "stock": number
}

class RedManager extends egret.EventDispatcher {
    public bonuses: number = 0;  //用户领取福卡的金额
    public total_money: number = 0; //用户已领取福卡的总金额
    public normal_get_num: number = 0; //普通福卡今天剩余可领次数
    public lottery_get_num: number = 0; //转盘福卡今天剩余可领取次数
    public task_get_num: number = 0; //任务福卡今天剩余可领取的次数
    public switch:boolean = false;

    public goods_detail: IGoodDetail[] = [];

    private static s_instance: RedManager;
    public static getInstance(): RedManager {
        if (RedManager.s_instance == null) {
            RedManager.s_instance = new RedManager();
        }
        return RedManager.s_instance;
    }

    public constructor() {
        super();

    }

    public init(res):void{
        RedManager.getInstance().total_money = Math.floor(res["total_money"]* 100) ;
        RedManager.getInstance().normal_get_num =  Math.floor(res["normal_get_num"]* 100) ;
        RedManager.getInstance().lottery_get_num =  Math.floor(res["lottery_get_num"]* 100);
        RedManager.getInstance().task_get_num =  Math.floor(res["task_get_num"]* 100);
        this.dispatchEvent(new egret.Event("update"));
    }

    public async getRedbag() {
        let self = this;
        return new Promise((resolve, reject) => {
            debugger;
            let account_id = LocalStorageController.getInstance().getAccountID();
            if (account_id == 'undefined') {
                account_id = '';
            }

            // code=0表示成功 其他值表示出错
            // bonuses 用户领取福卡的金额
            // total_money 用户已领取福卡的总金额
            // normal_get_num 普通福卡今天剩余可领次数
            // lottery_get_num 转盘福卡今天剩余可领取次数
            // task_get_num 任务福卡今天剩余可领取的次数
            Http.get(GameConfig.baseurl + `bomb/blesscard?appid=${GameConfig.appid}&account_id=${account_id}&system=normal`).then((res) => {
                if (res["code"] == 0) {
                    debugger;
                    this.bonuses = Math.floor(res["bonuses"]* 100) ;
                    this.total_money = Math.floor(res["total_money"]* 100) ;
                    this.normal_get_num = res["normal_get_num"];
                    this.dispatchEvent(new egret.Event("update"));
                    resolve(true);
                }else{
                    egret.log(GameConfig.baseurl + `bomb/blesscard?appid=${GameConfig.appid}&account_id=${account_id}&system=normal`);
                    egret.log(res);
                    
                    resolve(false);
                }
                resolve();
            }, (res) => {
                debugger;
            })
        })
    }

    public async getRedBagMallInfo() {
        let self = this;
        return new Promise((resolve, reject) => {
            let account_id = LocalStorageController.getInstance().getAccountID();
            if (account_id == 'undefined') {
                account_id = '';
            }
            Http.get(GameConfig.baseurl + `shopping/show?appid=${GameConfig.appid}&account_id=${account_id}&module=blesscard`).then((res) => {
                if (res["code"] == 0) {
                    self.goods_detail = res["goods_detail"];
                    this.dispatchEvent(new egret.Event("update"));
                }
                resolve();
            }, (res) => {
                debugger;
            })
        })
    }

    public buy(id:number,type:string) {
        let self = this;

        let account_id = LocalStorageController.getInstance().getAccountID();
        if (account_id == 'undefined') {
            account_id = '';
        }

        Http.get(GameConfig.baseurl + `shopping/buy?appid=${GameConfig.appid}&account_id=${account_id}&module=blesscard&id=${id}`).then((res) => {
            if (res["code"] == 0) {
                debugger;
                this.goods_detail[res["id"] -1].stock = res["stock"];
                this.total_money = Math.floor(res["total_money"]* 100) ;
                ToastManager.addPopUp("领取成功");
                debugger;
                PropManager.getInstance().addLimit(type,true);
                this.dispatchEvent(new egret.Event("update"));
            }else if(res["code"] == 100){
                ToastManager.addPopUp("余额不足");
            }else if(res["code"] == 101){
                ToastManager.addPopUp("库存不足");
            }
        }, (res) => {
            debugger;
        })
    }

}
