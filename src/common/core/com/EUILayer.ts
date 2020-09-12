module core {
	/**
	 *
	 *
	 */
    export class EUILayer extends eui.UILayer {
        constructor() {
            super();
            this.touchEnabled = false;
            this.touchChildren = true;
        }
        
        public release(): void {

        }
    }

}