
class OtherGameCeView extends core.EUIComponent {
    public m_ce:eui.Group;
    public m_btn:eui.Group;
    public m_arrow:eui.Image;
    public m_item_0:OthergameCeItem;
    public m_item_1:OthergameCeItem;
    public m_item_2:OthergameCeItem;
    public m_item_3:OthergameCeItem;
    public m_item_4:OthergameCeItem;
    public m_item_5:OthergameCeItem;
    public m_item_6:OthergameCeItem;
    public m_item_7:OthergameCeItem;
    public m_item_8:OthergameCeItem;
    public m_item_9:OthergameCeItem;
    public m_item_10:OthergameCeItem;
    public m_item_11:OthergameCeItem;
    public m_item_12:OthergameCeItem;
    public m_item_13:OthergameCeItem;
    public m_item_14:OthergameCeItem;
    public m_item_15:OthergameCeItem;

    private _btnPos:string = "";
    private _manager: BaskectBallManager;
    public open:boolean = false;
    public constructor(btnPos:string = "") {
        super();
        this._btnPos = btnPos;
        this.skinName = "resource/exml/OtherGameCe.exml";
        this._manager = BaskectBallManager.getInstance();
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
        if(this._btnPos == "down"){
            this.m_btn.y = 551;
        }else{
            this.m_btn.y = 70;
        }
        this.initOthergame();
    }

    private async initOthergame() {
    }

    protected onHide(event?: egret.Event): void {
        super.onHide();
    }

	/**
	 * 添加监听
	 */
    protected addListener(): void {
        this.m_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gogameHandler, this);
    }

	/**
	 * 删除监听
	 */
    protected removeListener(): void {
        this.m_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gogameHandler, this);
     }

    /**
     * 前往游戏
     */
    private gogameHandler(evt: egret.TouchEvent): void {
        DataStatisticsJs.logEvent("sideOtherBame","lobbyview");
        if(this.m_ce.right < -100){
            egret.Tween.get(this.m_ce).to({
                right:0
            },100).call(()=>{
                this.m_arrow.scaleX = 1;
            })
            this.open = true;
        }else{
            egret.Tween.get(this.m_ce).to({
                right:-466
            },100).call(()=>{
                this.m_arrow.scaleX = -1;
            })
            this.open = false;
        }
    }

    private close():void{
        egret.Tween.get(this.m_ce).to({
            right:-466
        },100).call(()=>{
            this.m_arrow.scaleX = 1;
        })
        this.open = false;
    }
} 