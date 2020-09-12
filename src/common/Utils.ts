class Utils {
	public constructor() {
	}
	/**
	 * 点击改变按钮大小特效
	 * button:作为按钮的对象
	 * scale:要改变的大小
	 * initScale:初始的大小
	 */
	public static btnChangeByScale(button: any, scale: number, initScale: number) {
		SoundMgr.getInstance().playWa();
		// Utils.setAnchorCenter(button);
		egret.Tween.get(button).to({ scaleX: 0.8, scaleY: 0.8 }, 50)
			.to({ scaleX: initScale, scaleY: initScale }, 50);
	}
	/**
	 * 按钮放大缩小
	 * button:作为按钮的对象
	 * scale:要改变的大小
	 */
	public static btnScale(button: any, scale: number) {
		button.scaleX = scale;
		button.scaleY = scale;
	}

    /**
     * 设置锚点居中
     */
	public static setAnchorCenter(component: egret.DisplayObject) {
		component.anchorOffsetX = component.width / 2;
		component.anchorOffsetY = component.height / 2;
	}

	public static gray(display: egret.DisplayObject): void {
		//变灰
		var colorMatrix = [
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0.3, 0.6, 0, 0, 0,
			0, 0, 0, 1, 0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
		display.filters = [colorFlilter];
	}

	public static makeTime(t): any {
		void 0 === t && (t = -1);
		var e = null;

		if (t == -1) {
			e = new Date();
		} else {
			e = new Date(t);
		}


		return e.getFullYear() + "-" + ((e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1) + "-") + e.getDate();
	}

	public static isIphoneX(): boolean {
		var t = SystemData.model;
		if (console.log("modelmes = ", t), t && -1 != t.search("iPhone X")) return !0;
		return !1
	}

	public static nFormatter(num, digits):string {
		const si = [
			{ value: 1, symbol: "" },
			{ value: 1E6, symbol: "K" }
		];
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		let i;
		for (i = si.length - 1; i > 0; i--) {
			if (num >= si[i].value) {
				break;
			}
		}
		return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
	}
}