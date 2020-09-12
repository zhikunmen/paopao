class BubbleUI extends core.EUIComponent {
	public cell: Cell;
	public img: eui.Image;

	constructor(cell?: Cell) {
		super();
		this.cell = cell;
	}

	/**
	 * 显示
	 */
	protected onShow(event?: egret.Event): void {
		super.onShow(event);
		this.touchEnabled = false;
		this.touchChildren = false;
		if (this.width <= 0 || this.height <= 0)
			throw new Error('set width,height, first');

		if (this.cell && this.cell.blank) {
			return;
		}
		this.reRender();
		PropManager.getInstance().addEventListener(PropManager.PROP_OFF, this.propOffHandler, this);
	}

	protected onHide(event?: egret.Event): void {
		super.onHide(event);
		egret.Tween.removeTweens(this);
		PropManager.getInstance().removeEventListener(PropManager.PROP_OFF, this.propOffHandler, this);


	}

	public reRender() {
		this.alpha = 1;
		this.scaleX = this.scaleY = 1;
		if (this.cell.blank) {
			return;
		}

		if (this.cell.colorIndex == null) {
			debugger;
		}
		PropManager.getInstance().removeEventListener(PropManager.PROP_OFF, this.propOffHandler, this);
		PropManager.getInstance().addEventListener(PropManager.PROP_OFF, this.propOffHandler, this);
		
		if (this.cell.colorIndex == BallTypeEnum.SPECIL_BLACK_HOLE) {
			let d = AnimationManager.getInstance().getEffectByName("heidong", "heidong", "heidong", false);
			d.x = 34;
			d.y = 34;
			this.addChild(d);
			d.animation.play();
		} else {
			if (!this.img) {
				this.img = new eui.Image(`ball_${this.cell.colorIndex}_png`);
			} else {
				this.img.source = `ball_${this.cell.colorIndex}_png`;
			}

			this.addChild(this.img);
			this.img.anchorOffsetX = this.img.anchorOffsetY = 34;
			this.img.x = 34;
			this.img.y = 34;
			this.img.width = this.img.height = 68;
		}

		// let label:eui.Label = new eui.Label(this.cell.index + "");
		// this.addChild(label);
		// egret.setInterval(()=>{
		// 	if(this.cell){
		// 		label.text = this.cell.index + "";
		// 	}

		// },this,100);

	}

	public iceRender(): void {
		this.reRender();
		let d = AnimationManager.getInstance().getEffectByName("bingqiu", "bingqiu", "bingqiu", false);
		d.x = 34;
		d.y = 34;
		this.addChild(d);
		d.animation.timeScale = 1.1;
		d.animation.play('bingqiu', 1);
		d.scaleX = d.scaleY = 1.2;
		let particlView: ParticleView = new ParticleView();
		particlView.addEffect("bingqiu_lz");
		let system: particle.ParticleSystem = particlView.system;
		particlView.updatePos(34, 34);
		system.scaleX = system.scaleY = 1.2;
		system.start(4);
		this.addChild(system);
	}

	public play(diretion: string = "top"): void {
		if (!this.img) {
			return;
		}
		let tween: egret.Tween;
		if (diretion == "top") {
			tween = egret.Tween.get(this.img).to({
				y: 20,
			}, 100).to({
				y: 38
			}, 300);
			// this.img.y = 20;
		} else if (diretion == "right") {
			tween = egret.Tween.get(this.img).to({
				x: 40,
			}, 100).to({
				x: 30
			}, 300);
			// this.img.x = 40;
		} else if (diretion == "left") {
			tween = egret.Tween.get(this.img).to({
				x: 20,
			}, 100).to({
				x: 38
			}, 300);
			// this.img.x = 20;
		} else if (diretion == "left-top") {
			tween = egret.Tween.get(this.img).to({
				x: 20,
				y: 20
			}, 100).to({
				x: 30,
				y: 30
			}, 300);

			// this.img.x = 20;
			// this.img.y = 20;
		} else if (diretion == "right-top") {
			tween = egret.Tween.get(this.img).to({
				x: 40,
				y: 20
			}, 100).to({
				x: 38,
				y: 30
			}, 300);
			// this.img.x = 40;
			// this.img.y = 20;
		}

		tween.to({
			scaleX: 1, scaleY: 1, x: 34, y: 34
		}, 200);
	}

	public to(cell: Cell) {
		this.cell = cell;

		this.reRender();
	}

	public disappear(index: number, addEffect: string = '') {
		if (!this.img) {
			return;
		}
		egret.Tween.removeTweens(this.img);
		// this.img.x = this.img.y = 34;
		let color = this.cell.colorIndex;
		this.cell.colorIndex = -1;

		return new Promise<any>(resolve => {
			let img: eui.Image;
			let d: dragonBones.EgretArmatureDisplay;
			let isGift: number = 0;
			if (color == BallTypeEnum.GIFT_BALL_6 || color == BallTypeEnum.RED_BALL_7) {// 礼包球
				isGift = color;
				color = 0;
			}

			if (color == -1) {
				this.destroy();
				resolve();
				return;
			}

			let particlView: ParticleView = AnimationManager.getInstance().dispearticlView;
			particlView.changeTexture(`ball_${color}_png`);
			let system: particle.ParticleSystem = particlView.system;
			particlView.updatePos(34, 34);
			if (addEffect) {
				d = AnimationManager.getInstance().getEffectByName(addEffect, addEffect, addEffect, true);
				d.scaleX = d.scaleY = 0.5;
			} else {
				d = AnimationManager.getInstance().getdispearXiaochu(`ball_${color}`);
				d.scaleX = d.scaleY = 1.5;
			}
			d.x = d.y = 34;
			let self = this;
			d.addEventListener("complete", completeHandler, this);
			function completeHandler() {
				d.addEventListener("complete", completeHandler, self);
				d.parent && d.parent.removeChild(d);
				img && img.parent && img.parent.removeChild(img);
			}

			let label: eui.Label = new eui.Label("10");
			label.fontFamily = "dispear_font";
			label.size = 40;
			label.width = label.height = 100;
			label.textAlign = "center";
			label.anchorOffsetX = label.anchorOffsetY = 50;
			label.x = label.y = 34;

			let waitTime: number = index * 50;
			egret.setTimeout(() => {
				SoundMgr.getInstance().playPaopaocrush(1);
				this.removeChildren();

				this.addChild(d);

				system.start(3);
				this.addChild(system);

				this.addChild(label);
				egret.setTimeout(() => {
					resolve();
				}, this, 200)

				label.scaleX = label.scaleY = 0;
				egret.Tween.get(label).to({
					scaleX:1.5,
					scaleY:1.5,
				}, 120).wait(100).to({
					scaleX:1,
					scaleY:1,
				}, 200).to({
					y: -34,
					alpha: 0
				}, 600).call(() => {
					system.stop();
					this.removeChildren();
					this.reRender();
				});
				if (addEffect && isGift) {
					if (color == BallTypeEnum.GIFT_BALL_6) {
						let getGiftView: GetGiftView = new GetGiftView(PropManager.getInstance().getRandomType());
						getGiftView.popUp();
					} else if (color == BallTypeEnum.RED_BALL_7) {
					
					}
				}
			}, this, waitTime)
		});
	}

	public drop(idx: number) {
		let linePos:number = 1025;
		let _x: number = this.x;
		let _y: number = this.y;
		let color = this.cell.colorIndex;
		this.cell.colorIndex = -1;
		if (color == BallTypeEnum.GIFT_BALL_6) {// 礼包球
			color = 0;
			let getGiftView: GetGiftView = new GetGiftView(PropManager.getInstance().getRandomType());
			getGiftView.popUp();
		} else if (color == BallTypeEnum.RED_BALL_7) {
		}
		let targetX: number = core.MathUtils.random(50, 100);
		if (Math.random() > 0.5) {
			targetX = -targetX;
		}
		if (this.x + targetX + 34 > GameConfig.curWidth()) {
			targetX = 0;
		} else if (this.x + targetX - 34 < 0) {
			targetX = 0;
		}
		let targetY: number = linePos - 34;
		if (targetY > linePos - 34) {
			targetY = linePos - 34;
		}

		egret.Tween.get(this).to({
			x: this.x + targetX,
			y: targetY,
			alpha: 0.8,
		}, (linePos - this.y) * core.MathUtils.random(1.5, 3), egret.Ease.backIn).call(() => {
			if (color == BallTypeEnum.SPECIL_ICE) {
				this.removeChildren();
				return;
			}
			let d = AnimationManager.getInstance().getEffectByName("xiaochu", "xiaochu", `ball_${color}`, true);
			d.x = d.y = 34;
			let particlView: ParticleView = new ParticleView();
			particlView.addEffect("xiaochu_lz");
			particlView.changeTexture(`ball_${color}_png`);
			let system: particle.ParticleSystem = particlView.system;
			particlView.updatePos(34, 34);
			idx == 1 && SoundMgr.getInstance().playPaopaocrush(1);

			this.removeChildren();
			this.addChild(d);
			system.start(1);
			this.addChild(system);

			let label: eui.Label = new eui.Label("20");
			label.size = 40;
			label.bold = true;
			label.anchorOffsetX = label.anchorOffsetY = 0;
			this.addChild(label);
			egret.Tween.get(label).to({
				anchorOffsetY: 50,
				alpha: 0
			}, 1000, egret.Ease.sineIn).call(() => {
				system.stop();
				this.removeChildren();
				label.parent && label.parent.removeChild(label);
				this.x = _x;
				this.y = _y;
				this.destroy();
			})

			SoundMgr.getInstance().playDrop();
		})
	}

	private propparticlView: ParticleView;
	private propsystem: particle.ParticleSystem;
	private _propeffect: dragonBones.EgretArmatureDisplay;
	public showPropEffect(t: string): void {
		if (t == PropManager.PROP_RAINBOW) {
			this.img.source = "prop_rainbow_png";
		} else if (t == PropManager.PROP_LASER) {
			this.img.source = "prop_jiguan_png";
		} else if (t == PropManager.PROP_tonghang) {
			this.img.source = "prop_xiaohang_png";
		}

		if (!this.propparticlView) {
			this.propparticlView = AnimationManager.getInstance().propparticlView;
		}
		if (!this.propsystem) {
			this.propsystem = this.propparticlView.system;
		}

		this.addChild(this.propsystem);
		this.propsystem.x = this.propsystem.y = 34;
		this.propsystem.start();
		if (!this._propeffect) {
			this._propeffect = AnimationManager.getInstance().getEffectByName("shiyong_ef", "shiyong", `shiyong`, false);
		}
		this._propeffect.animation.gotoAndPlay("shiyong");
		this.addChild(this._propeffect);
		this._propeffect.x = this._propeffect.y = 34;
	}

	private propOffHandler(): void {
		// 容错 colorIndex 会出现为-1的情况，为何出现需要进一步排查
		if (this.cell.colorIndex > 0) {
			this.img.source = `ball_${this.cell.colorIndex}_png`;

		}
		if (this._propeffect && this._propeffect.parent) {
			this._propeffect.parent.removeChild(this._propeffect);
		}
		if (this.propsystem && this.propsystem.parent) {
			this.propsystem.parent.removeChild(this.propsystem);
		}
	}

	public destroy(): void {
		egret.Tween.removeTweens(this);
		this.parent && this.parent.removeChild(this);
		this.removeChildren();
	}

}

