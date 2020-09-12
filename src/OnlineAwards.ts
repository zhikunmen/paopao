class OnlineAwards extends core.EUIComponent {
    public m_container1: eui.Group;
    public m_container: eui.Group;
    public m_count: eui.Label;
    public m_timer: eui.Label;
    public m_btn: eui.Label;
    public m_bg_mask: eui.Image;

    private _circleShape: egret.Shape;
    private _angle: number = 360;
    private _bg1Mask: egret.Shape;
    public constructor() {
        super();
        this.skinName = "resource/exml/OnlineAwardsExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        this.drawBorderProgress();
    }


    protected onHide(event?: egret.Event): void {
        super.onHide();

        egret.Tween.removeTweens(this);
        core.TimerManager.instance.removeTicks(this);
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        BaskectBallManager.getInstance().addEventListener("online_awards_geted", this.getedHandler, this);
    }

	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        BaskectBallManager.getInstance().removeEventListener("online_awards_geted", this.getedHandler, this);
    }

    public reset(): void {
        let arr: number[] = LocalStorageController.getInstance().onlineAwards;
        let onlineTime: number = (Date.now() - arr[0]) / 1000;
        if (onlineTime > 86400) {
            this.m_timer.text = "00:00";
            this.m_count.text = "15836";
        }
    }

    private drawBorderProgress() {
        let arr: number[] = LocalStorageController.getInstance().onlineAwards;
        let onlineTime: number = (Date.now() - arr[0]) / 1000;
        if (onlineTime > 86400) {
            this.m_timer.text = "00:00";
            this.m_count.text = "15836";
            return;
        }
        if (!this._bg1Mask) {
            this._bg1Mask = new egret.Shape();
            this._bg1Mask.graphics.beginFill(0xcccccc);
            this._bg1Mask.graphics.drawRect(0, 0, 105, 150);
            this._bg1Mask.graphics.endFill();
            this._bg1Mask.anchorOffsetY = 150;
            this.addChild(this._bg1Mask);
        }
        this._bg1Mask.x = this.m_container1.x;
        this._bg1Mask.y = this.m_container1.y + 150;
        this.m_container1.mask = this._bg1Mask;

        var shape: egret.Shape = new egret.Shape();
        var angle: number = 0;
        this.addChild(shape);
        this.m_container.mask = shape;
        shape.y = 40;
        shape.x = 14;
        shape.graphics.clear();
        egret.Tween.get(this, {
            onChange: () => {
                angle = parseInt(this._angle + "");
                changeGraphics(angle);
                // angle = angle % 360;
            },
            onChangeObj: this
        }).to({
            _angle: 0
        }, 10000).call(() => {
            this.update();
        })

        core.TimerManager.instance.addTick(10000, -1, () => {
            shape.graphics.clear();
            egret.Tween.get(this, {
                onChange: () => {
                    angle = parseInt(this._angle + "");
                    changeGraphics(angle);
                    // angle = angle % 360;
                },
                onChangeObj: this
            }).to({
                _angle: 0
            }, 10000).call(() => {
                this.update();
            })
        }, this)
        function changeGraphics(angle) {
            shape.graphics.lineStyle(10, 0xffffff);
            shape.graphics.drawArc(
                39, 39, 36,
                0, angle * Math.PI / 180, true
            );
            shape.graphics.endFill();
        }
        this.addChild(shape)
        this.update();
    }

    private update(): void {
        this._angle = 360;
        let arr: number[] = LocalStorageController.getInstance().onlineAwards;
        let onlineTime: number = parseInt(Math.floor((Date.now() - arr[0]) / 1000) + "");
        if (onlineTime < 7200) {
            arr[1] = 5 * Math.floor(onlineTime / 10);
        } else if (onlineTime < 14400) {
            arr[1] = 3595 + 4 * Math.floor(onlineTime / 10 - 719);
        } else if (onlineTime < 21600) {
            arr[1] = 6475 + 3 * Math.floor(onlineTime / 10 - 1439);
        } else if (onlineTime < 28800) {
            arr[1] = 8635 + 2 * Math.floor(onlineTime / 10 - 2159);
        } else if (onlineTime < 86400) {
            arr[1] = 10075 + 1 * Math.floor(onlineTime / 10 - 2879);
        }
        LocalStorageController.getInstance().onlineAwards = arr;
        this.m_count.text = arr[1] + "";

        this._bg1Mask.scaleY = onlineTime / 86400;

        var now = 86400 * 1000 + arr[0] - Date.now();
        this.m_timer.text = this.formatSeconds(now / 1000);
    }

    private formatSeconds(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60 + "");
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60 + "");
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60 + "");
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60 + "");
            }
        }

        function appendzero(obj) {
            if (obj < 10) return "0" + "" + obj;
            else return obj;
        }

        return appendzero(parseInt(hourTime + "")) + ":" + appendzero(parseInt(minuteTime + ""));
    }

    private getedHandler(evt: egret.Event): void {
        DataStatisticsJs.logEvent("get", "OnlineAwards");
        egret.Tween.removeTweens(this);
        core.TimerManager.instance.removeTicks(this);
        this._angle = 360;
        this.drawBorderProgress();
    }

    public get count(): number {
        return Number(this.m_count.text);
    }
}

window["OnlineAwards"] = OnlineAwards;