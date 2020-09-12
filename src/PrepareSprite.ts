class PrepareSprite extends core.EUIComponent {

	protected bubbles: BubbleUI[];
	protected container: MeshContainer;
	private _parent: MainView;
	private _manager: BaskectBallManager;

	constructor(container: MeshContainer, parent: MainView) {
		super();
		this._parent = parent;
		this.container = container;
		this.bubbles = [];
		this._manager = BaskectBallManager.getInstance();
	}

	/**
	 * 添加监听
	 */
	protected addListener(): void {
		this._parent.m_refresh_prepare_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.refreshPrepareHandler, this);
	}

	/**
	 * 删除监听
	 */
	protected removeListener(): void {
		this._parent.m_refresh_prepare_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.refreshPrepareHandler, this);
	}


	protected onHide(event?: egret.Event): void {
		super.onHide(event);
		for (let i = 0; i < this.bubbles.length; i++) {
			this.bubbles[i].parent && this.bubbles[i].parent.removeChild(this.bubbles[i]);
		}
	}

	public get prepareBubble(): BubbleUI {
		return this.bubbles[0];
	}

	public initBubble(bubbleUIarr: BubbleUI[]): void {

		this.bubbles.push(bubbleUIarr[0]);
		this.bubbles.push(bubbleUIarr[1]);

		let bubbleUI: BubbleUI = bubbleUIarr[0];
		bubbleUI.anchorOffsetX = bubbleUI.anchorOffsetY = 34;
		bubbleUI.x = GameConfig.curWidth() / 2 + 2;
		bubbleUI.y = this._manager.preparePosY + 34 - 15;
		this._parent.m_prepare.addChildAt(bubbleUI, 9999);
		bubbleUI = bubbleUIarr[1];
		let ballName: string = `ball_${bubbleUI.cell.colorIndex}`;
		var egretFactory = dragonBones.EgretFactory.factory;
		egretFactory.replaceSlotDisplay("Rabbit", "rabitArmature", "ti11", ballName, this._parent.rabbit.armature.getSlot("ti11"));
	}

	public pushBubble(newbubbleUI: BubbleUI) {
		let self = this;
		let b1: BubbleUI = this.bubbles.shift();
		if (b1.parent) {
			b1.parent.removeChild(b1);
		}
		console.warn(this.bubbles);
		let bubbleUI0 = this.bubbles[0];
		bubbleUI0.anchorOffsetX = bubbleUI0.anchorOffsetY = 34;

		this.bubbles.push(newbubbleUI);
		var bubbleUI = this.bubbles[1];
		bubbleUI.anchorOffsetX = bubbleUI.anchorOffsetX = 34;
		bubbleUI.x = 248;
		bubbleUI.y = this._manager.preparePosY + 100;
		var egretFactory = dragonBones.EgretFactory.factory;

		this._parent.rabbit.addEventListener("complete", completeHandler, this);
		this._parent.rabbit.animation.play("breathing_motion");
		function completeHandler() {
			self._parent.rabbit.removeEventListener("complete", completeHandler, this);
			self._parent.rabbit.animation.play("breathing_motion");
			bubbleUI0.scaleX = bubbleUI0.scaleY = 1;
			bubbleUI0.width = bubbleUI0.height = 68;
			bubbleUI0.x = GameConfig.curWidth() / 2 + 2;
			bubbleUI0.y = self._manager.preparePosY + 34 - 15;
			self._parent.m_prepare.addChildAt(bubbleUI0, 999);
			let ballName: string = `ball_${newbubbleUI.cell.colorIndex}`;
			egretFactory.replaceSlotDisplay("Rabbit", "rabitArmature", "ti11", ballName, this._parent.rabbit.armature.getSlot("ti11"));
		}
		this._parent.rabbit.armature.animation.play("Pendulumhead_motion", 1);

	}

	public showPropEffect(t: string): void {
		this.bubbles[0].showPropEffect(t);
	}

	protected moveBubbles() {
		let promises: Promise<any>[] = [];
		this.bubbles.forEach((bubble, i) => {
			promises.push(new Promise<any>(resolve => {
				egret.Tween.get(bubble).to({
				}, 10).call(() => {
					resolve();
				});
			}));
		})
		return Promise.all(promises);
	}

	/**
	 * 刷新位置
	 */
	private changing: boolean = false;
	private refreshPrepareHandler(evt: egret.TouchEvent): void {
		Utils.btnChangeByScale(this._parent.m_refresh_prepare_btn, 0.8, 1);
		if (this.changing) {
			return;
		}
		let self = this;
		this.changing = true;
		if (this.bubbles.length < 2) {
			return;
		}
		let bubbleUI1 = this.bubbles[0];
		this.bubbles[0] = this.bubbles[1];
		this.bubbles[1] = bubbleUI1;

		this.bubbles[1].parent && this.bubbles[1].parent.removeChild(this.bubbles[1]);
		this.bubbles[0].parent && this.bubbles[0].parent.removeChild(this.bubbles[0]);

		var egretFactory = dragonBones.EgretFactory.factory;
		this._parent.rabbit.addEventListener("complete", completeHandler, this);
		this._parent.rabbit.armature.animation.play("Pendulumhead_motion", 1);
		function completeHandler() {
			self._parent.rabbit.removeEventListener("complete", completeHandler, this);
			self._parent.rabbit.animation.play("breathing_motion");
			let ballName: string = `ball_${this.bubbles[1].cell.colorIndex}`;
			let d = egretFactory.replaceSlotDisplay("Rabbit", "rabitArmature", "ti11", ballName, this._parent.rabbit.armature.getSlot("ti11"));

			let bubbleUI0 = this.bubbles[0];
			bubbleUI0.scaleX = bubbleUI0.scaleY = 1;
			bubbleUI0.width = bubbleUI0.height = 68;
			bubbleUI0.x = GameConfig.curWidth() / 2 + 2;
			bubbleUI0.y = self._manager.preparePosY + 34 - 15;
			self._parent.m_prepare.addChildAt(bubbleUI0, 999);

			this.changing = false;
		}

		// let b0 = this.bubbles[0];
		// this._parent.m_prepare.addChild(b0);

		// let obj = { angle: 1.5 * Math.PI }
		// egret.Tween.get(obj, {
		// 	onChange: () => {
		// 		b0.scaleX = b0.scaleY = 1;
		// 		b0.width = b0.height = 68;
		// 		// bubbleUI.x = GameConfig.curWidth() / 2,
		// 		// bubbleUI.y:890 + 34
		// 		b0.x = GameConfig.curWidth() / 2 + 65 * Math.sin(obj.angle);
		// 		b0.y = this._manager.preparePosY + 65 * Math.cos(obj.angle) + 65 + 34 - 15;
		// 	},
		// 	onChangeObj: this
		// }).to({
		// 	angle: Math.PI
		// }, 300, egret.Ease.sineOut)

		// let bubbleUI = this.bubbles[1];
		// bubbleUI.anchorOffsetX = bubbleUI.anchorOffsetX = 34;
		// this._parent.m_prepare.addChild(bubbleUI);

		// // parent.swapChildrenAt(parent.getChildIndex(this.bubbles[0]), parent.getChildIndex(this.bubbles[1]))
		// egret.Tween.get(bubbleUI).to({
		// 	scaleX: 0.7, scaleY: 0.7,
		// 	x: 248, y: this._manager.preparePosY + 100
		// }, 300, egret.Ease.sineIn).call(() => {
		// 	this.changing = false;
		// })
	}
}
