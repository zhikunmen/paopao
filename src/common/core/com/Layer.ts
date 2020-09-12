module core {
	export class Layer extends egret.DisplayObjectContainer {
		public constructor() {
			super();
			this.touchEnabled = false;
			this.touchChildren = true;
		}
	}
}
