
class LaserIineView extends core.EUIComponent {
    public m_ball_0:eui.Image;
    public m_layserImg:eui.Image;

    private _rays:sharp.Ray[];

    public constructor(rays:sharp.Ray[]) {
        super();
        this.skinName = "resource/exml/LaserLineExml.exml";
        this._rays = rays;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.left = this.right = this.top = this.bottom = 0;
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();

        this.m_layserImg.rotation = sharp.r2d(this._rays[0].angle) + 90;
        this.m_layserImg.scaleX = 0.8;
        this.m_layserImg.x = GameConfig.curWidth() /2;
        this.m_layserImg.y = 1000;
        egret.Tween.get(this.m_layserImg).to({
            scaleX:1
        },500,egret.Ease.sineIn);
    }
    /**
	 * 显示
	 */
    protected onHide(event?: egret.Event): void {
        super.onHide();

    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        super.addListener();
    }


	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        super.removeListener();
    }

}


