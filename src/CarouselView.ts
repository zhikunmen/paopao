class CarouselView extends core.EUIComponent {
	public m_container:eui.Group;
	public m_mask:eui.Rect;
	public m_tip_container:eui.Group;

	private _imgArr:string[] = ["game_guanggao1_png","game_guanggao2_png"];
	private _imgW:number = 365;
	private _basePos:number = 0;
    public constructor() {
		super();
		this.skinName = "resource/exml/Carousel.exml";
	}

	public childrenCreated() {
        super.childrenCreated();

		this.m_container.scrollEnabled = true;
		this.m_container.maxWidth = 618;
		this.m_container.width = 618;

		this.m_container.mask = this.m_mask;
		this.resetPos();
    }

	public init():void{
		this.m_container.removeChildren();
		let otherGameArr:IOthergameItem[] = OtherGameManager.getInstance().otherGameArr;
		for(let j = 0;j < otherGameArr.length;j ++){
			let item:OtherGameItem = new OtherGameItem("lobby_down");
			item.init(otherGameArr[j],j);
			item.scaleX = item.scaleY = 0.7;
			this.m_container.addChild(item)
		}
	}

	/**
	 * 显示
	 */
	protected onShow(event?: egret.Event): void {
		super.onShow(event);
		this.autoScroll();
	}

	private autoScroll():void{
		return;
		let self = this;
		egret.Tween.get(this,{loop:true}).wait(3000).call(()=>{
			let tPos = self.m_container.x - self._imgW;
			self.scroll(tPos);
		});
	}

	protected onHide(event?: egret.Event): void {
		super.onHide(event);

		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.m_container);
	}
	/**
	 * 添加监听
	 */
	protected addListener(): void {
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBeginHandler,this);
		this.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this);
	}

	/**
	 * 删除监听
	 */
	protected removeListener(): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBeginHandler,this);
		this.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMoveHandler,this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this);
	}

	private resetPos():void{
		this.m_container.x = 0;
		this._basePos = this.m_container.x;
		this.scroll(this._basePos);
	}

	private _tempStageX:number = 0;
	private _nextTPos:number = 0.01;
	private _tempX:number = 0;
	private touchBeginHandler(evt:egret.TouchEvent):void{
		this._tempStageX = evt.stageX;
		this._tempX = this.m_container.x;
		this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMoveHandler,this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchEndHandler,this);

		egret.Tween.removeTweens(this);
	}
	private touchEndHandler(evt:egret.TouchEvent):void{
		this.autoScroll();
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMoveHandler,this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchEndHandler,this);
		
		let self = this;
		let tPos:number = 0;
		
		if(evt.localX < this._tempStageX){
			tPos = this.m_container.x - 618;
		}else{
			tPos = this.m_container.x + 618;
		}
		// if(this._nextTPos != 0.01){
		// 	tPos = this._nextTPos;
		// 	this._nextTPos = 0.01;
		// }

		this.scroll(tPos);
	}
	private scroll(tPos:number):void{
		let self = this;
		self.changeIndex(tPos,this.m_container.x);
		egret.Tween.removeTweens(this.m_container);
		egret.Tween.get(this.m_container).to({x: tPos},200).call(()=>{
			// if(tPos <= self._basePos -  self._imgW * self._imgArr.length||
			//  tPos >= self._basePos +  self._imgW * self._imgArr.length){
				// self.resetPos();
			// }
		})
	}


	private touchMoveHandler(evt:egret.TouchEvent):void{
		let tPos:number = 0;
		let localX:number = 0;
		localX = evt.stageX;
		if(Math.abs(localX - this._tempStageX) < 10){
			return;
		}

		let distance:number = 0;
		if(localX > this._tempStageX){
			distance = localX - this._tempStageX;
			tPos = this.m_container.x + distance;
			// this._nextTPos = this._tempX + this._imgW;
			// if(this._nextTPos < tPos){
			// 	return;
			// }
		}else{
			distance = this._tempStageX - localX;
			tPos = this.m_container.x - distance;
			// this._nextTPos = this._tempX - this._imgW;
			// if(this._nextTPos > tPos){
			// 	return;
			// }
		}
		
		this.m_container.x = tPos;
		this._tempStageX = evt.stageX;
	}

	private _curImgIndex:number = 0;
	private changeIndex(tPos:number,containerX:number):void{
		if(tPos > containerX){
			this._curImgIndex += 1;
		}else if(tPos < containerX){
			this._curImgIndex -= 1;
		}
		if(this._curImgIndex >= this._imgArr.length ){
			this._curImgIndex = 0;
		}else if(this._curImgIndex < 0){
			this._curImgIndex = this._imgArr.length - 1;
		}

		this.m_tip_container.removeChildren();
		for(let i = 0;i < this._imgArr.length;i++){
			let img:eui.Image;
			if(i == this._curImgIndex){
				img = new eui.Image("game_guanggao_xuanzhong_png");
			}else{
				img = new eui.Image("game_guanggao_weizhong_png");
			}
			this.m_tip_container.addChild(img);
		}
	}
}

window["CarouselView"] = CarouselView;