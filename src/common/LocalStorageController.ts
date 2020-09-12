class LocalStorageController {
    public static STORAGE_NAME = 'paopaolong_1';
    private isLocalStorageSupported: boolean = false;
    private data = {};

    private static instance: LocalStorageController;
    public static getInstance() {
        if (LocalStorageController.instance == null) {
            LocalStorageController.instance = new LocalStorageController();
        }
        return LocalStorageController.instance;
    }

    constructor() {
        this.checkLocalStorageSupported();
    }

    public set propRainbowCount(n: number) {
        if (n <= 0) n = 0;
        this.data["propRainbowCount"] = n;
    }
    public set propRaserCount(n: number) {
        if (n <= 0) n = 0;
        this.data["propRaserCount"] = n;
    }
    public set propTonghangCount(n: number) {
        if (n <= 0) n = 0;
        this.data["propTonghangCount"] = n;
    }
    public get propRainbowCount(): number {
        if (this.data[`propRainbowCount`] == undefined) {
            this.data[`propRainbowCount`] = 0;
        }
        return this.data[`propRainbowCount`];
    }

    public get propRaserCount(): number {
        if (this.data[`propRaserCount`] == undefined) {
            this.data[`propRaserCount`] = 0;
        }
        return this.data[`propRaserCount`];
    }

    public get propTonghangCount(): number {
        if (this.data[`propTonghangCount`] == undefined) {
            this.data[`propTonghangCount`] = 0;
        }
        return this.data[`propTonghangCount`];
    }

    public set levelData(arr: number[]) {
        this.data["leveldata"] = arr;
        this.save();
    }
    public get levelData(): number[] {
        return this.data["leveldata"];
    }

    public setCoin(c: number) {
        this.data["coin"] = c;
        this.save();
    }
    public getCoin(): number {
        if (!this.data['coin']) {
            this.data['coin'] = 0;
        }
        return this.data['coin'];
    }

    /**
     * 金币，不是分数
     */
    public set coin(c: number) {
        this.data["coin1"] = c;
        this.save();
    }
    public get coin(): number {
        if (!this.data["coin1"]) {
            this.data["coin1"] = 0;
        }
        return this.data["coin1"];
    }

    public set sevendayData(data: any[]) {
        this.data["sevenday"] = data;
        this.save();
    }

    public get sevendayData(): any[] {
        let a = this.data["sevenday"];
        if (!a) {
            this.data["sevenday"] = [(new Date()).getDate(), 0, 0, 0, 0, 0];
        } else {
            if (this.data["sevenday"][0] != (new Date()).getDate()) {
                this.data["sevenday"] = [(new Date()).getDate(), 0, 0, 0, 0, 0];
            }
        }
        return this.data["sevenday"];
    }

    public set sevendayGet(data: any[]) {
        this.data["sevendayget"] = data;
        this.save();
    }

    public get sevendayGet(): any[] {
        let a = this.data["sevendayget"];
        if (!a) {
            this.data["sevendayget"] = [(new Date()).getDate(), 0, 0, 0, 0, 0];
        } else {
            if (this.data["sevendayget"][0] != (new Date()).getDate()) {
                this.data["sevendayget"] = [(new Date()).getDate(), 0, 0, 0, 0, 0];
            }
        }
        return this.data["sevendayget"];
    }

    public set sevendayCurDay(dayArr: number[]) {
        this.data["sevendayCurDay"] = dayArr;
        this.save();
    }

    public get sevendayCurDay(): number[] {
        if (!this.data["sevendayCurDay"]) {
            this.data["sevendayCurDay"] = [0, (new Date()).getDate()];
        }
        return this.data["sevendayCurDay"];
    }

    public set curDayfirst(day: number) {
        this.data["curDayfirst"] = day;
        this.save();
    }

    public get curDayfirst(): number {
        return this.data["curDayfirst"] || 0;
    }

    public setSoundOpen(b: boolean) {
        this.data["sound"] = b;
        this.save();
    }
    public getSoundOpen(): boolean {
        if (this.data["sound"] == null) {
            this.setSoundOpen(true);
        }
        return this.data["sound"];
    }

    public setGuide(b: number) {
        this.data["guide1"] = b;
        this.save();
    }
    public hadGuide(): number {
        return 1;
    }

    public setPropLock(b: number) {
        this.data["proplock"] = b;
        this.save();
    }
    public getPropLock(): number {
        return this.data["proplock"];
    }

    public setcollect(b: number) {
        this.data["collect"] = b;
        this.save();
    }
    public getcollect(): number {
        return this.data["collect"];
    }


    public setAccountID(b: string) {
        this.data["AccountID"] = b;
        this.save();
    }
    public getAccountID(): string {
        return this.data["AccountID"];
    }

    public setHaveRed(b: boolean) {
        this.data["haveRed"] = b;
        this.save();
    }

    public set onlineAwards(b: number[]) {
        this.data["onlineAwards"] = b;
        this.save();
    }

    public get onlineAwards(): number[] {
        if (!this.data["onlineAwards"]) {
            this.data["onlineAwards"] = [Date.now(), 0]
        }
        return this.data["onlineAwards"];
    }

    public set luckStep(b: number) {
        this.data["luckStep"] = b;
        this.save();
    }

    public get luckStep(): number {
        if (!this.data["luckStep"]) {
            this.data["luckStep"] = 0;
        }
        return this.data["luckStep"];
    }


    public getHaveRed(): number {
        return this.data["haveRed"];
    }

    public save() {
        if (this.isLocalStorageSupported) {
            localStorage[LocalStorageController.STORAGE_NAME] = JSON.stringify(this.data);
        }
    };
    public checkLocalStorageSupported() {
        try {
            this.isLocalStorageSupported = "localStorage" in window && window["localStorage"] !== null;
        }
        catch (e) {
            this.isLocalStorageSupported = false;
        }
    };
    public loadSave() {
        this.checkLocalStorageSupported();
        if (localStorage[LocalStorageController.STORAGE_NAME]) {
            this.data = JSON.parse(localStorage[LocalStorageController.STORAGE_NAME]);
        } else {
            localStorage[LocalStorageController.STORAGE_NAME] = JSON.stringify(this.data);
        }
    };

    /**
    * 七天登陆
    */
    public set sevenDayLastDate(data: { timestramp: Date, count: number }) {
        this.data["sevenDayLastDate"] = data;
        this.save();
    }
    public get sevenDayLastDate(): { timestramp: Date, count: number } {
        return this.data["sevenDayLastDate"];
    }
}