class ParticleView extends core.EUIComponent {
    public system: particle.ParticleSystem;
    public constructor() {
        super();
        this.touchEnabled = false;
        this.touchChildren = false;
    }


    protected onShow(event?: egret.Event): void {
        super.onShow(event);
    }

    protected onHide(event?: egret.Event): void {
        super.onHide(event);
    }
    /**
     * 添加监听
     */
    protected addListener(): void {
    }

    /**
     * 删除监听
     */
    protected removeListener(): void {
    }

    public addEffect(name:string): void {
        var texture = RES.getRes(name + "_png");
        var config = RES.getRes(name + "_json");
        this.system = new particle.GravityParticleSystem(texture, config);
        this.addChild(this.system);
    }

    public changeTexture(s: string): void {
        var texture = RES.getRes(s);
        if(!texture){
            debugger;
            return;
        }
        this.system.changeTexture(texture);
    }

    public updatePos(_x: number, _y: number): void {
        if (this.system) {
            this.system.emitterX = _x;
            this.system.emitterY = _y;
        }
    }
}