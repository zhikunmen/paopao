class ShareManager {
    public static shareJson = [];
    public static shareTime = 0;
    public static currentGroup = 1
    public static shareValue = 0
    public static shareDataArr: IShareItem[] = [];

    public static init(): void {
        let self = this;
    }

    public static getQuery(t) {
        if (!t) return "";
        var e = "";
        for (var i in t) e += i + "=" + t[i] + "&";
        return e;
    }
    public static queryAddShareInfo(t, e, i) {
        return i ? (i.title = t, i.imageUrl = e, i.sendOpenid = "") : i = {
            title: t,
            imageUrl: e,
            sendOpenid: ""
        }
    }


    private static shareTimes: number = 0;
    public static share(title: string = "", url: string = "", query: string = "", cb: Function = null) {
        var a = this;
        let trytime: number = 0;
        let shareInfo = this.shareDataArr[core.MathUtils.random(0, this.shareDataArr.length)];
        if (title == "") {
            title = shareInfo.title;
            url = shareInfo.img;
        }
        this.shareTime = egret.getTimer();

        wx.shareAppMessage({
            title: title, imageUrl: url, query: this.getQuery(query),
            cancel: (res) => {
            }

        });
        var fun = function () {
            if(!cb){
                return;
            }
            egret.setTimeout(() => {
                if (egret.getTimer() - ShareManager.shareTime >= 3000) {
                    if (Math.random() > 0.1) {
                        cb && cb(true);
                        toast(true);
                    } else {
                        cb && cb(false);
                        toast(false);
                    }
                } else {
                    if (Math.random() > 0.8) { //3秒以内 20%成功率 3秒以上90%成功率
                        cb && cb(true);
                        toast(true);
                    } else {
                        if (a.shareTimes == 1) {
                            cb && cb(false);
                            toast(false);
                            a.shareTimes = 0;
                            return;
                        }
                        toast(false);
                        if (cb) {
                            egret.setTimeout(() => {
                                wx.showModal({
                                    title: '提示', content: "获取失败，换换其他的好友试试吧", showCancel: true, cancelText: "知道了", confirmText: "重新获取",
                                    success(res) {
                                        if (res.confirm) {
                                            a.shareTimes++;
                                            a.share(title, url, query, cb);
                                        } else if (res.cancel) {
                                            console.log('用户点击确定')
                                        }
                                    }
                                })
                            }, this, 1000)
                        }
                    }
                }
            }, this, 1000);
            wx.offShow(fun);
        }
        wx.onShow(fun);

        function toast(suc: boolean) {
            if (!cb) {
                return;
            }
            let ran: number;
            if (suc) {
                ran = core.MathUtils.random(0, 3) - 1;
                if (ran < 0) {
                    ran = 0;
                }
                ToastManager.addPopUp(["多分享到不同的群，你会获得钻石奖励", "新人通过分享进去，你会获得钻石"][ran]);
            } else {
                ran = core.MathUtils.random(0, 4) - 1;
                if (ran < 0) {
                    ran = 0;
                }
                ToastManager.addPopUp(["换换其他群试试吧", "今天这个群已经用过了哦", "今天这些好友已经帮助过你了哦"][ran]);
            }
        }
    }
}

interface IShareItem {
    id: number,
    img: string,
    title: string
}