class AuthorizateManager {
	public static GO_AUTHORIZATE: string = "go_authorizate";

	public constructor() {
	}

	private static _instance: AuthorizateManager;
	public static getInstance() {
		if (AuthorizateManager._instance == null) {
			AuthorizateManager._instance = new AuthorizateManager();
			AuthorizateManager._instance.init();
		}
		return AuthorizateManager._instance;
	}

	public isGoAuthorization: boolean;
	public isFristAuthorizate: boolean;

	public init() {
		this.isGoAuthorization = false;
		this.isFristAuthorizate = true;
	}

	public getLobbyAuthorize() {
		GameManager.getInstance().dispatchEvent(new egret.Event(AuthorizateManager.GO_AUTHORIZATE));
	}

}