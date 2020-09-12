  /**
    * tips类
    * 提示相关信息
    */
class ToastPanel extends core.EUIComponent{
    private descStr:string = "";
    private group:eui.Group = new eui.Group();

    /**
    * descStr        描述
    */
    public constructor(descStr:string = ""){
        super();
        this.descStr = descStr;
        this.initUI();
        this.touchEnabled = false;
        this.touchChildren = false;
    }
    /**
	 * 显示
	 */
	protected onShow(event?: egret.Event): void {
		super.onShow();
	}

    private bg:eui.Image;
    private descTF:eui.Label;

    // 初始化面板
    public initUI():void{
        this.addChild(this.group);

        this.bg = new eui.Image("prompt_bg1_png"); 
        this.bg.verticalCenter = this.bg.horizontalCenter = 0;
        this.bg.scale9Grid = new egret.Rectangle(30,10,10,40);
        this.group.addChild(this.bg);
        
        this.descTF = new eui.Label();
        this.group.addChild(this.descTF);

        this.descTF.textColor = 0xffffff;
        this.descTF.size = 25;
        this.descTF.lineSpacing = 18;
        this.descTF.verticalCenter = this.descTF.horizontalCenter = 0;
        
        this.descTF.textAlign = "center";
        // '没有任何格式初始文本，' +
        // '<font color="#0000ff" size="30" fontFamily="Verdana">Verdana blue large</font>' +
        // '<font color="#ff7f50" size="10">珊瑚色<b>局部加粗</b>小字体</font>' +
        // '<i>斜体</i>'
        this.descTF.textFlow = (new egret.HtmlTextParser).parser(this.descStr);
        this.group.verticalCenter = this.group.horizontalCenter = 0;
        this.bg.width = this.descTF.width + 50;
    }


    // 获取高度
    public get height(): number {
        return this.bg.height + 100;
    }
    // 获取宽度
    public get width(): number {
        return this.bg.width;
    }

    public set groupX(_x:number){
        this.group.anchorOffsetX = 0;
        this.group.horizontalCenter = _x;
    }
    public set groupY(_y:number){
        this.group.anchorOffsetY = 0;
        this.group.verticalCenter = _y;
    }
    
    public release(): void{
        this.removeChildren();
    }
}

