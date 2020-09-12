module core {
	/**
	 *
	 * @author 
	 *
	 */
	export class Core {

		public constructor() {
		}

		public static run(stage: egret.Stage): void {
			egret.ImageLoader.crossOrigin = 'anonymous';
			core.FrameEventCenter.getInstance().init(stage);
			core.LayerCenter.getInstance().init(stage);
			//RES.setMaxRetryTimes(3);
		}
	}
}
