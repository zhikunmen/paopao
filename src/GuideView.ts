class GuideView extends core.EUIComponent {
    public image:eui.Image;

    public constructor() {
        super();
        this.skinName = "resource/exml/GuaidViewExml.exml";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.verticalCenter = 0;
    }

	/**
	 * 显示
	 */
    protected onShow(event?: egret.Event): void {
        super.onShow();
        this.touchEnabled = false;
        this.touchChildren = false;

        let curPos:number = this.image.y;
        egret.Tween.get(this.image,{loop:true}).to({
            y: curPos - 50
        },1000,egret.Ease.sineIn).to({
            y:curPos
        },1000,egret.Ease.sineOut)
    }
  

    protected onHide(event?: egret.Event): void {
        super.onHide();
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
  
} 