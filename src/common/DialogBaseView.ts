class DialogBaseView extends core.EUIComponent {
	private darkSprite: egret.Sprite;
	public constructor() {
		super();
	}

	/**
	 * 显示
	 */
	protected onShow(event?: egret.Event): void {
		super.onShow();

		this.left = this.right = this.top = this.bottom = 0;
	}

	/**
     * 添加监听
     */
	protected addListener(): void {
		super.addListener();

		if (this["m_close"]) {
			this["m_close"].addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.Event) => {
				Utils.btnChangeByScale(this["m_close"], 0.8, 1);
				this.removeFromParent(0)
			}, this);
		}
	}

    /**
     * 删除监听
     */
	protected removeListener(): void {
		super.removeListener();

		if (this["m_close"]) {
			this["m_close"].removeEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.Event) => {
				this.removeFromParent(0)
			}, this);
		}

		if (this.darkSprite) {
			if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this.darkSprite)) {
				core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this.darkSprite);
			}
		}
	}

    /**
     * 释放资源
     */
	public release(): void {
		super.release();
	}


    /**
    * 添加面板方法
    * panel       		面板
    * dark        		背景是否变黑
    * popUpWidth      	指定弹窗宽度，定位使用
    * popUpHeight      	指定弹窗高度，定位使用
    * effectType        0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    * removeEffect      0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
	*/
	public popUp(dark: boolean = false, popUpWidth: number = 0, popUpHeight: number = 0, effectType: number = 0, removeEffect: number = 0, isAlert: boolean = false, darkAlpha: number = 0.7): void {
		let panel = this;
		if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(panel)) {
			return;
		}
		panel.scaleX = 1;
		panel.scaleY = 1;
		panel.left = 0;
		panel.top = 0;
		panel.alpha = 1;

		if (dark) {
			this.darkSprite = new egret.Sprite();
			this.darkSprite.graphics.clear();
			this.darkSprite.graphics.beginFill(0x000000, darkAlpha);
			this.darkSprite.graphics.drawRect(0, 0, GameConfig.curWidth(), GameConfig.curHeight());
			this.darkSprite.graphics.endFill();
			this.darkSprite.width = GameConfig.curWidth();
			this.darkSprite.height = GameConfig.curHeight();
			if (!core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this.darkSprite)) {
				core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(this.darkSprite);
			}
			this.darkSprite.touchEnabled = true;
			// this.darkSprite.touchEnabled = this.touchDarkEnable();
			// this.darkSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			// 	return false;
			// }, this,false)

			egret.Tween.get(this.darkSprite).to({ alpha: 1 }, 150);
			this.darkSprite.visible = true;
		}

		core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).addChild(panel);
		GameConfig.curPanel = panel;
		if (popUpWidth != 0) {
			panel.left = GameConfig.curWidth() / 2 - popUpWidth / 2;
			panel.top = GameConfig.curHeight() / 2 - popUpHeight / 2;
		} else {
			popUpWidth = panel.width;
			popUpHeight = panel.height;
		}

		//以下是弹窗动画
		var leftX: number = GameConfig.curWidth() / 2 - popUpWidth / 2;
		var upY: number = GameConfig.curHeight() / 2 - popUpHeight / 2;
		effectType = 0;
		switch (effectType) {
			case 0:
				break;
			case 1:
				panel.alpha = 0;
				panel.scaleX = 0.5;
				panel.scaleY = 0.5;
				panel.left = panel.left + popUpWidth / 4;
				panel.top = panel.top + popUpHeight / 4;
				egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1, left: panel.left - popUpWidth / 4, top: panel.top - popUpHeight / 4 }, 300, egret.Ease.backOut);
				break;
			case 2:
				panel.alpha = 0;
				panel.scaleX = 0.5;
				panel.scaleY = 0.5;
				panel.left = panel.left + popUpWidth / 4;
				panel.top = panel.top + popUpHeight / 4;
				egret.Tween.get(panel).to({ alpha: 1, scaleX: 1, scaleY: 1, left: panel.left - popUpWidth / 4, top: panel.top - popUpHeight / 4 }, 600, egret.Ease.elasticOut);
				break;
			case 3:
				if (isAlert) {
					panel.left = - popUpWidth;
					egret.Tween.get(panel).to({ left: leftX }, 500, egret.Ease.cubicOut);
				} else {
					panel.left = - popUpWidth;
					egret.Tween.get(panel).to({ left: 0 }, 500, egret.Ease.cubicOut);
				}
				break;
			case 4:
				if (isAlert) {
					panel.right = popUpWidth;
					egret.Tween.get(panel).to({ left: leftX }, 500, egret.Ease.cubicOut);
				} else {
					panel.right = -popUpWidth;
					egret.Tween.get(panel).to({ right: 0 }, 500, egret.Ease.cubicOut);
				}
				break;
			case 5:
				if (isAlert) {
					panel.top = - popUpHeight;
					egret.Tween.get(panel).to({ top: upY }, 500, egret.Ease.cubicOut);
				} else {
					panel.top = - popUpHeight;
					egret.Tween.get(panel).to({ top: 0 }, 500, egret.Ease.cubicOut);
				}
				break;
			case 6:
				if (isAlert) {
					panel.top = GameConfig.curHeight();
					egret.Tween.get(panel).to({ top: upY }, 500, egret.Ease.cubicOut);
				} else {
					panel.top = popUpHeight;
					egret.Tween.get(panel).to({ top: 0 }, 500, egret.Ease.cubicOut);
				}
				break;
			default:
				break;
		}
	}

    /**
    * 移除面板方法
    * panel       		面板
    * effectType        0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
    */
	public removeFromParent(effectType: number = 0): void {
		const panel = this;
		if (this.darkSprite) {
			if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(this.darkSprite)) {
				core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(this.darkSprite);
			}
		}

		//以下是弹窗动画
		effectType = 0;
		switch (effectType) {
			case 0:
				break;
			case 1:
				let popUpWidth = panel.width;
				let popUpHeight = panel.height;
				panel.left = panel.left + popUpWidth / 4;
				panel.top = panel.top + popUpHeight / 4;
				egret.Tween.get(panel).to({ alpha: 0, scaleX: 0, scaleY: 0 }, 300, egret.Ease.backIn);
				break;
			case 2:
				break;
			case 3:
				egret.Tween.get(panel).to({ right: -panel.width }, 200);
				break;
			case 4:
				egret.Tween.get(panel).to({ left: -panel.width }, 200);
				break;
			case 5:
				egret.Tween.get(panel).to({ top: panel.height }, 400);
				break;
			case 6:
				egret.Tween.get(panel).to({ top: -panel.height }, 200);
				break;
			default:
				break;
		}

		var waitTime = 500;
		if (effectType == 0) {
			waitTime = 0;
		}
		let self = this;
		egret.setTimeout(function () {
			if (core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).contains(panel)) {//判断是否包含panel
				core.LayerCenter.getInstance().getLayer(LayerEnum.POPUP).removeChild(panel);
				self.release();
			}
		}, this, waitTime);
	}

	/**
	 * 点击空白处是否关闭
	 */
	protected touchDarkEnable(): boolean {
		return true;
	}

}