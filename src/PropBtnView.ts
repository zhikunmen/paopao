class PropBtnView extends core.EUIComponent {
    public m_prop_img: eui.Image;
    public m_prop_count: eui.Label;
    public m_lock: eui.Image;
    public m_prop_count_container: eui.Group;


    private _canGetCount: number = 2;
    public get canGetCount(): number {
        return this._canGetCount;
    }
    public set canGetCount(c: number) {
        if (this._type != '') {
            if (this._type == PropManager.PROP_RAINBOW) {
                PropManager.getInstance().rainbowCount = c;
            } else if (this._type == PropManager.PROP_LASER) {
                PropManager.getInstance().raserCount = c;
            } else if (this._type == PropManager.PROP_tonghang) {
                PropManager.getInstance().tonghangCount = c;
            }
        }
        this._canGetCount = c;
    }

    private _type: string = '';

    public constructor(rays: sharp.Ray[]) {
        super();
        this.skinName = "resource/exml/PropBtnExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        this.update();
    }
    /**
	 * 显示
	 */
    protected onHide(event?: egret.Event): void {
        super.onHide();

    }

    private _lock: boolean = false;
    public set lock(b: boolean) {
        b = false;
        this._lock = b;
        this.m_lock.visible = b;
        this.m_prop_count.visible = !b;
        this.m_prop_count_container.visible = !b;
        this.update();
    }

    public get lock(): boolean {
        return this._lock;
    }


    public set type(t: string) {
        this._type = t;

        if (t == PropManager.PROP_RAINBOW) {
            this.m_prop_img.source = "prop_rainbow_png";
        } else if (t == PropManager.PROP_LASER) {
            this.m_prop_img.source = "prop_jiguan_png";
        } else if (t == PropManager.PROP_tonghang) {
            this.m_prop_img.source = "prop_xiaohang_png";
        }
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        super.addListener();

        PropManager.getInstance().addEventListener(PropManager.CHANGE, this.propchangeHandler, this);
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();

    }

    private propchangeHandler(evt: egret.Event): void {
        this.update();
    }

    public update(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openPlugPropView, this);
        if (this.m_lock.visible) {
            return;
        }
        let count: number = PropManager.getInstance().getUseLimit(this._type);
        if (count >= 0) {
            this.m_prop_count_container.visible = true;
            this.m_prop_count.visible = true;
            if (Number(this.m_prop_count.text) < count) {
                this.m_prop_count_container.scaleX = this.m_prop_count_container.scaleY = 0.8;
                egret.Tween.get(this.m_prop_count_container).to({
                    scaleX: 1, scaleY: 1
                }, 200, egret.Ease.bounceInOut)
            }
            this.m_prop_count.text = count + "";
        } else {
            this.m_prop_count_container.visible = false;
            if (this.canGetCount == 0) {
                // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.openPlugPropView,this);
            } else {
            }

        }
    }

    private openPlugPropView(evt: egret.Event): void {
        let plugPropView: PlugPropView = new PlugPropView(this._type);
        plugPropView.popUp();
    }

    private particlView: ParticleView;
    private system: particle.ParticleSystem;
    private _effect: dragonBones.EgretArmatureDisplay;
    public showEffect(): void {
        // if(!this.particlView){
        //     this.particlView = new ParticleView();
        //     this.particlView.addEffect("shiyong_lz");
        // }
        // if(!this.system){
        //     this.system = this.particlView.system;
        // }

        // this.addChild(this.system);
        // this.system.x = this.system.y = 93 /2;
        // this.system.start();

        this._effect = AnimationManager.getInstance().getEffectByName("shiyong_ef", "shiyong", `shiyong`, false);

        this._effect.animation.gotoAndPlay("shiyong");
        this.addChild(this._effect);
        this._effect.x = this._effect.y = 93 / 2;
    }

    public hideEffect(): void {
        if (this.system) {
            this.system.parent && this.system.parent.removeChild(this.system);
        }
        if (this._effect) {
            this._effect.parent && this._effect.parent.removeChild(this._effect);
        }
    }
}

window["PropBtnView"] = PropBtnView;
