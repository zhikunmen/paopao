module game {
	//打点
	export class GameanalyticsMgr {
		public static init() {
			console.log("fenxichushihua");
			
			gameanalytics.GameAnalytics.setEnabledInfoLog(false);
			gameanalytics.GameAnalytics.setEnabledVerboseLog(false);
			gameanalytics.GameAnalytics.configureBuild(GameConfig.gameVer.toString());
			gameanalytics.GameAnalytics.configureAvailableCustomDimensions01(["Daily_check"]);
			// gameanalytics.GameAnalytics.configureAvailableCustomDimensions02(["whale", "dolphin"]);
			// gameanalytics.GameAnalytics.configureAvailableCustomDimensions03(["horde", "alliance"]);
			gameanalytics.GameAnalytics.initialize("e477beaeb620911679ab639e98d44bda", "d5c79c73135324cfa182070f8b804c7754a1e892");
			// gameanalytics.GameAnalytics.addErrorEvent(gameanalytics.EGAErrorSeverity.Info, "test");
		}


		// public static send() {
		// 	gameanalytics.GameAnalytics.addDesignEvent("Daily_check",coreLib.NetMgr.instance.UID);
		// }
	}
}