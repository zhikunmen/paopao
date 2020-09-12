class SoundMgr {
	private static _instance: SoundMgr;
	public static getInstance(): SoundMgr {
		if (SoundMgr._instance == null) {
			SoundMgr._instance = new SoundMgr();
		}
		return SoundMgr._instance;
	}

	private _bg: egret.Sound;
	private click_waArr: HTMLAudioElement[] = [];
	private gameover: egret.Sound;
	private gamestart0: egret.Sound;
	private gamestart1: egret.Sound;
	private paopaocrush: egret.Sound;
	private paopaocrushArr: HTMLAudioElement[] = [];
	private paopaoon: egret.Sound;
	private paopaoonArr: HTMLAudioElement[] = [];
	private paopaofantan: egret.Sound;
	private shoot: egret.Sound;
	private shootArr: HTMLAudioElement[] = [];
	private propLaser: egret.Sound;
	private propRainbow: egret.Sound;
	private _good: egret.Sound;
	private _perfect: egret.Sound;
	private _nice: egret.Sound;
	private _countdown: egret.Sound;
	private _win: egret.Sound;
	private _draw: egret.Sound;
	private _lose: egret.Sound;
	private _readyGo: egret.Sound;
	private _drop: egret.Sound;
	private _touch: egret.Sound;

	/**
	 * 开启或关闭音乐和音效
	 */
	public _isOpen: boolean;
	public set isOpen(b: boolean) {
		this._isOpen = b;
		LocalStorageController.getInstance().setSoundOpen(b);
	}
	public get isOpen(): boolean {
		return LocalStorageController.getInstance().getSoundOpen();
	}

	public constructor() {
		this.initSounds();
	}

	private async initSounds() {
		let prefix: string = "";
		RES.getResByUrl(prefix + "bg_mp3", (val) => {
			this._bg = val;
			if (this.isOpen) {
				this._bgSoundChannel = this._bg.play(0, -1);
			}
		}, this, "sound");

		RES.getResByUrl(prefix + "gameover_mp3", (val) => {
			this.gameover = val;
		}, this, "sound");

		RES.getResByUrl(prefix + "gamestart0_mp3", (val) => {
			this.gamestart0 = val;
		}, this, "sound");

		RES.getResByUrl(prefix + "gamestart1_mp3", (val) => {
			this.gamestart1 = val;
		}, this, "sound");

		// RES.getResByUrl(prefix + "paopaoon_mp3", (val) => {
		// 	this.paopaoon = val;
		// }, this, "sound");

		RES.getResByUrl(prefix + "paopaofantan_mp3", (val) => {
			this.paopaofantan = val;
		}, this, "sound");

		// RES.getResByUrl(prefix + "shoot_mp3", (val) => {
		// 	this.shoot = val;
		// }, this, "sound");
		RES.getResByUrl(prefix + "rainbow_mp3", (val) => {
			this.propRainbow = val;
		}, this, "sound");
		RES.getResByUrl(prefix + "lightning_mp3", (val) => {
			this.propLaser = val;
		}, this, "sound");

		RES.getResByUrl(prefix + "good_mp3", (val) => {
			this._good = val;
		}, this, "sound");
		RES.getResByUrl(prefix + "perfect_mp3", (val) => {
			this._perfect = val;
		}, this, "sound");
		RES.getResByUrl(prefix + "nice_mp3", (val) => {
			this._nice = val;
		}, this, "sound");
		RES.getResByUrl(prefix + "countDown_mp3", (val) => {
			this._countdown = val;
		}, this, "sound");

		RES.getResByUrl(prefix + "win_mp3", (val) => {
			this._win = val;
		}, this, "sound");
		RES.getResByUrl(prefix + "lose_mp3", (val) => {
			this._lose = val;
		}, this, "sound");
		RES.getResByUrl(prefix + "draw_mp3", (val) => {
			this._draw = val;
		}, this, "sound");

		RES.getResByUrl(prefix + "readyGo_mp3", (val) => {
			this._readyGo = val;
		}, this, "sound");

		RES.getResByUrl(prefix + "drop_mp3", (val) => {
			this._drop = val;
		}, this, "sound");

		RES.getResByUrl(prefix + "touch_mp3", (val) => {
			this._touch = val;
		}, this, "sound");
		

		for (let i = 0; i < 10; i++) {
			let rushAudio = new Audio();
			rushAudio.src = "resource/assets/paopao/sound/paopaocrush1.mp3";
			this.paopaocrushArr[i] = rushAudio
		}
		for (let i = 0; i < 5; i++) {
			let rushAudio = new Audio();
			rushAudio.src = "resource/assets/paopao/sound/paopaoon.mp3";
			this.paopaoonArr[i] = rushAudio
		}
		for (let i = 0; i < 5; i++) {
			let rushAudio = new Audio();
			rushAudio.src = "resource/assets/paopao/sound/shoot.mp3";
			this.shootArr[i] = rushAudio;
		}
		for (let i = 0; i < 5; i++) {
			let rushAudio = new Audio();
			rushAudio.src = "resource/assets/paopao/sound/click.mp3";
			this.click_waArr[i] = rushAudio;
		}
	}


	private playwaindex: number = 0;
	public playWa() {
		if (!this.isOpen) {
			return;
		}
		if (this.click_waArr[this.playwaindex % 5] != null) {
			this.click_waArr[this.playwaindex % 5].play();
		}
		this.playwaindex++;
	}



	public playGameover() {
		if (!this.isOpen) {
			return;
		}
		this.gameover && this.gameover.play(0, 1);
	}

	public playGamestart1() {
		if (!this.isOpen) {
			return;
		}
		if (this.gamestart1) {
			let soundchannel: egret.SoundChannel = this.gamestart1.play(0, 1);
			soundchannel && soundchannel.addEventListener(egret.Event.SOUND_COMPLETE, () => {
				let s = this.gamestart0 && this.gamestart0.play(0, 1);
			}, this);
		}
	}

	private curcrushArr: number = 0;
	private c1: egret.SoundChannel;
	private c2: egret.SoundChannel;
	public playPaopaocrush(loop: number) {
		if (!this.isOpen) {
			return;
		}
		// if (this.curcrushArr % 2) {
		// 	this.c1 = RES.getRes("paopaocrush1_mp3").play(0, 1);
		// } else {
		// 	this.c2 = RES.getRes("paopaocrush_mp3").play(0, 1);
		// }
		if (this.paopaocrushArr[this.curcrushArr % 10] != null) {
			this.paopaocrushArr[this.curcrushArr % 10].play();
		}
		this.curcrushArr++;
	}

	private playonindex: number = 0;
	public playPaopaoon() {
		if (!this.isOpen) {
			return;
		}
		if (this.paopaoonArr[this.playonindex % 5] != null) {
			this.paopaoonArr[this.playonindex % 5].play();
		}
		this.playonindex++;
	}

	public playCountdown() {
		if (!this.isOpen) {
			return;
		}
		this._countdown && this._countdown.play(0, 1);
	}

	public playFantan() {
		return;
		if (!this.isOpen) {
			return;
		}
		this.paopaofantan && this.paopaofantan.play(0, 1);
	}
	private playShootindex: number = 0;
	public playShoot(): void {
		if (!this.isOpen) {
			return;
		}
		if (this.shootArr[this.playShootindex % 5] != null) {
			this.shootArr[this.playShootindex % 5].play();
		}
		this.playShootindex++;
	}

	public playRainbow(): void {
		if (!this.isOpen) {
			return;
		}
		this.propRainbow && this.propRainbow.play(0, 1);
	}

	public playLaser(): void {
		if (!this.isOpen) {
			return;
		}
		this.propLaser && this.propLaser.play(0, 1);
	}

	public playGood(): void {
		if (!this.isOpen) {
			return;
		}
		this._good && this._good.play(0, 1);
	}

	public playNice(): void {
		if (!this.isOpen) {
			return;
		}
		this._nice && this._nice.play(0, 1);
	}

	public playPerfect(): void {
		if (!this.isOpen) {
			return;
		}
		this._perfect && this._perfect.play(0, 1);
	}

	public playWin(): void {
		if (!this.isOpen) {
			return;
		}
		this._win && this._win.play(0, 1);
	}
	public playLose(): void {
		if (!this.isOpen) {
			return;
		}
		this._lose && this._lose.play(0, 1);
	}
	public playDraw(): void {
		if (!this.isOpen) {
			return;
		}
		this._draw && this._draw.play(0, 1);
	}

	public playReady(): void {
		if (!this.isOpen) {
			return;
		}
		this._readyGo && this._readyGo.play(0, 1);
	}

	public playDrop(): void {
		if (!this.isOpen) {
			return;
		}
		this._drop && this._drop.play(0, 1);
	}

	public playTouch(): void {
		if (!this.isOpen) {
			return;
		}
		this._touch && this._touch.play(0, 1);
	}

	private _bgSoundChannel: egret.SoundChannel;
	public playBGM(): void {
		egret.log("播放背景音乐" + this.isOpen);
		if (!this.isOpen) {
			return;
		}
		if (this._bgSoundChannel) {
			this._bgSoundChannel.stop();
			this._bgSoundChannel = null;
		}
		if (this._bg) {
			this._bgSoundChannel = this._bg.play(0, -1);
		}

	}

	public stopBGM(): void {
		this._bgSoundChannel && this._bgSoundChannel.stop();
		this._bgSoundChannel = null;
	}


	public changeSoundStatus() {
		this.isOpen = !this.isOpen;
		if (this.isOpen) {
			this.playBGM();
		} else {
			this.stopBGM();
		}
	}
}