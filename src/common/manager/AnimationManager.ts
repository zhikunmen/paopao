class AnimationManager {
	public propparticlView: ParticleView;
	private _dispearticlViewArr: ParticleView[] = [];
	private _dispearXiaochuArr: dragonBones.EgretArmatureDisplay[] = [];

	public constructor() {
		var egretFactory = dragonBones.EgretFactory.factory;
		var dragonbonesData = RES.getRes(`${"xiaochu"}_ske_json`);
		var textureData = RES.getRes(`${"xiaochu"}_tex_json`);
		var texture = RES.getRes(`${"xiaochu"}_tex_png`);
		let d = egretFactory.parseDragonBonesData(dragonbonesData);
		let d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"shiyong_ef"}_ske_json`);
		textureData = RES.getRes(`${"shiyong_ef"}_tex_json`);
		texture = RES.getRes(`${"shiyong_ef"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);


		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"fireworks"}_ske_json`);
		textureData = RES.getRes(`${"fireworks"}_tex_json`);
		texture = RES.getRes(`${"fireworks"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"prop_bcak_motion"}_ske_json`);
		textureData = RES.getRes(`${"prop_bcak_motion"}_tex_json`);
		texture = RES.getRes(`${"prop_bcak_motion"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"caihong_xiaochu"}_ske_json`);
		textureData = RES.getRes(`${"caihong_xiaochu"}_tex_json`);
		texture = RES.getRes(`${"caihong_xiaochu"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"xiaochu_yihang"}_ske_json`);
		textureData = RES.getRes(`${"xiaochu_yihang"}_tex_json`);
		texture = RES.getRes(`${"xiaochu_yihang"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"heidong"}_ske_json`);
		textureData = RES.getRes(`${"heidong"}_tex_json`);
		texture = RES.getRes(`${"heidong"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"bingqiu"}_ske_json`);
		textureData = RES.getRes(`${"bingqiu"}_tex_json`);
		texture = RES.getRes(`${"bingqiu"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"readygo_motion_4"}_ske_json`);
		textureData = RES.getRes(`${"readygo_motion_4"}_tex_json`);
		texture = RES.getRes(`${"readygo_motion_4"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		egretFactory = dragonBones.EgretFactory.factory;
		dragonbonesData = RES.getRes(`${"Rabbit"}_ske_json`);
		textureData = RES.getRes(`${"Rabbit"}_tex_json`);
		texture = RES.getRes(`${"Rabbit"}_tex_png`);
		d = egretFactory.parseDragonBonesData(dragonbonesData);
		d1 = egretFactory.parseTextureAtlasData(textureData, texture);

		this.propparticlView = new ParticleView();
		this.propparticlView.addEffect("shiyong_lz");

		for (let i = 0; i < 11; i++) {
			let dispearticlView = new ParticleView();
			dispearticlView.addEffect("xiaochu_lz");
			this._dispearticlViewArr[i] = dispearticlView
		}

		for (let i = 0; i < 10; i++) {
			let d = this.getEffectByName("xiaochu", "xiaochu", `ball_1_png`, false);
			this._dispearXiaochuArr[i] = d;
		}
	}

	private dispearindex: number = 0;
	public get dispearticlView(): ParticleView {
		this.dispearindex++;
		return this._dispearticlViewArr[this.dispearindex % 10]
	}

	private dispearxiaochuindex: number = 0;
	public getdispearXiaochu(animationName: string): dragonBones.EgretArmatureDisplay {
		this.dispearxiaochuindex++;
		let d = this._dispearXiaochuArr[this.dispearxiaochuindex % 10];
		if(!d){
			d = this.getEffectByName("xiaochu", "xiaochu", `ball_1_png`, false);
		}
		d.animation.gotoAndPlayByTime(animationName, 0, 1);
		return d;
	}

	private static _instance: AnimationManager;
	public static getInstance() {
		if (AnimationManager._instance == null) {
			AnimationManager._instance = new AnimationManager();
		}
		return AnimationManager._instance;
	}


	/**
   * 获得特效
   */
	public getEffectByName(res: string, armature: string, animationName: string, autoPlay: boolean = true): dragonBones.EgretArmatureDisplay {
		var egretFactory = dragonBones.EgretFactory.factory;
		let container = egretFactory.buildArmatureDisplay(armature);
		if (autoPlay) {
			container.animation.gotoAndPlayByTime(animationName, 0, 1);
		}
		container.touchEnabled = container.touchChildren = false;
		return container;
	}
}