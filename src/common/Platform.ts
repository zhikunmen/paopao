/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */

declare interface Platform {

    getFriendCloudStorage(): Promise<any>;

    getUserInfo(): Promise<any>;

    login(): Promise<any>;

    setKVData(data): Promise<any>;

    auth(jsCode: String, iv: String, encryptedData: String): Promise<any>;

    showAuthModal(): Promise<any>;

    shake(): void;
    shakeShort(): void;
}

class WxPlatform implements Platform {

    name = 'wxgame'
    header = {}

    // 开放域获取好友排行
    public async getFriendCloudStorage() {
        return new Promise((resolve, reject) => {
            wx.getFriendCloudStorage({
                keyList: ["socre", "date"],
                success: (res) => {
                    console.log(res);
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            })
        })
    }

    public async setKVData(data) {
        return new Promise((resolve, reject) => {
            let dataList = [];
            for (let key in data) {
                dataList.push({ key: key, value: data[key] });
            }

        });
    }


    public async login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    resolve(res);
                }, fail: (err) => {
                    reject(err);
                }
            });
        });
    }

    public async auth(jsCode, rawData) {
        return new Promise((resolve, reject) => {
            let data = {
                "rawData": rawData,
                "sessionKey": jsCode,
                "appid": GameConfig.appid,
                "channel": GameConfig.channelId
            }
            let that = this
            wx.request({
                url: GameConfig.httpServerBaseURL + "/user/login",
                method: 'POST',
                data: data,
                success: function (res) {
                    if (!res.data.data) {
                        ToastManager.addPopUp("登录失败");
                        return;
                    }
                    that.header = {
                        Authorization: res.data.data.openId
                    }
                    wx.hideLoading()
                    resolve(res)
                },
                fail: function (err) {
                    reject(err);
                },
                complete: function (err) {
                    reject(err);
                }

            });
        });
    }

    public async getUserInfo() {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                success: function (res) {
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    userInfo.encryptedData = res.encryptedData;
                    userInfo.iv = res.iv;
                    userInfo.rawData = res.rawData;
                    resolve(userInfo);
                }, fail: function (err) {
                    reject(err);
                }
            });
        });
    }


    public async showAuthModal() {
        wx.hideLoading();
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '提示',
                content: '请您进行登陆授权',
                showCancel: false,
                cancelText: '',
                confirmText: '去授权',
                success: function (res) {
                    wx.openSetting({
                        success: function (result) {
                            resolve(result);
                        },
                        fail: function (err) {
                            reject(err);
                        }
                    })

                },
            })
        })
    }

    public shake(): void {
    }

    public shakeShort(): void {
    }

    private  dateRange = [];
    public  isInTimeRange(timeStr) {
        if (timeStr) {
            let recordTime = new Date(timeStr.replace(/-/g, '/')).getTime();
            return recordTime > this.dateRange[0] && recordTime < this.dateRange[1];
        } else {
            return false;
        }

    }

    public  transObj(kvData) {
        let res = {};
        kvData.map((data) => {
            res[data.key] = data.value;
        })
        return res;
    }

}


if (!window.platform) {
    window.platform = new WxPlatform();
}



declare let platform: Platform;

declare interface Window {

    platform: Platform
}
