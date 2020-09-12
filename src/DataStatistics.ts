// stone@ADD20181123: 通用数据统计;
let DataStatisticsJs = {
    init: function () {
        this.maxPostLength = 50; // 每次最大上传条数;
        this.commitDelayTime = 20; // 每次上传时间间隔;
        this.cacheMaxLength = 10000; // 最大本地存储条数;

        this.database = this.getSaveCommit();
        this.commit();
        this.setCurrentTime();
        this.startSchedule();

        this._scheduleId = 0;
    },

    // 主动调用;
    eventOnHide: function () {
        this.saveCommit();
    },

    setCurrentTime: function () {
        const timestamp = this.getTime();
        this.intervalTime = timestamp;
    },

    isFixIntervalTime: function () {
        const timestamp = this.getTime();
        const diffTime = Math.floor(timestamp - this.intervalTime)
        if (diffTime > this.commitDelayTime) {
            return true;
        }
        return false;
    },

    commit: function () {
        // 提交数据;
        const commitData = this.database;
        if (commitData.length !== 0) {
            if (commitData.length >= this.maxPostLength) {
                const tempCommitData = [];
                for (var i = 0; i < this.maxPostLength; i++) {
                    tempCommitData.push(commitData.shift())
                }
                // 上传;
                this.commitReq(tempCommitData);
            }
            else {
                // 上传;
                this.commitReq(commitData, true);
            }
        }
    },

    commitReq(cData, isClear) {
        const postData = { "events": cData };
        let account_id = LocalStorageController.getInstance().getAccountID();
        if (account_id == 'undefined') {
            account_id = '';
        }
        Http.post(GameConfig.baseurl + 'statistics/event?appid=' + GameConfig.appid + '&account_id=' + account_id, postData).then((data) => {
            if (data["code"] === 0) {
                if (isClear) {
                    this.clearSaveCommit();
                }
            }
            else {
                for (var i = 0; i < cData.length; i++) {
                    this.database.unshift(cData.pop());
                }
            }
        }, (err) => {

        }
        );
    },

    // 将数据存储到本地;
    saveCommit: function () {
        if (this.database.length > this.cacheMaxLength) {
            for (var i = this.cacheMaxLength; i < this.database.length; i++) {
                this.database.shift();
            }
        }
        let storage = window.localStorage;
        storage.setItem('wrapperbase_statistics' + LocalStorageController.getInstance().getAccountID(), JSON.stringify(this.database));
    },

    // 获取本地数据;
    getSaveCommit: function () {
        let storage = window.localStorage;
        const saveCommitData = storage.getItem('wrapperbase_statistics' + GameConfig.appid);
        // return (saveCommitData.length === 0 ? [] : JSON.parse(saveCommitData));
        if (saveCommitData) {
            let commitData = JSON.parse(saveCommitData);
            if (commitData) {
                return commitData;
            }
        }
        return [];
    },

    // 清空本地数据;
    clearSaveCommit: function () {
        let storage = window.localStorage;
        storage.setItem('wrapperbase_statistics' + GameConfig.appid, '');
        this.database = [];
    },

    // 获取日期;
    getTime: function () {
        // 获取日期;
        return Math.floor((new Date()).valueOf() / 1000);
    },

    startSchedule: function () {
        this.stopSchedule();
        this._scheduleId = setInterval(this.commit.bind(this), this.commitDelayTime * 1000);
    },

    stopSchedule: function () {
        if (this._scheduleId > 0) {
            clearInterval(this._scheduleId);
            this._scheduleId = 0;
        }
    },

    // 设置参数;
    logEvent: function (eventName, scene) {
    }
}

class DataStatistics {
    constructor() {
    }
    //初始化
    static init() {
        DataStatisticsJs.init();
    }
    // 设置参数
    static logEvent(eventName: string, scene: string = "default") {
    }
}