class GameManager extends egret.EventDispatcher {

    private static s_instance: GameManager;

    //复活次数
    public rebornCount: number = 0;

    /**
     * 暂停游戏
     */
    public static PAUSE_GAME: string = "pause_game";

    /**
    * 恢复游戏
    */
    public static RESUME_GAME: string = "resume_game";

    /**
     * 重新开始游戏
     */
    public static RESTART_GAME: string = "restart_game"

    /**
     * 游戏结束
     */
    public static GAME_OVER: string = "gameover"
    /**
     * 游戏复活
     */
    public static GAME_REVIVE: string = "revive_game";
    /**
     * 分享到不同的群失败了
     */
    public static SHARE_DIFFRERENTGROUPFAIL: string = "SHARE_DIFFRERENTGROUPFAIL";
    /**
     * 
     */
    public static REFRESH_GOLD: string = "REFRESH_GOLD";


    public constructor() {
        super();
    }

    public static getInstance(): GameManager {
        if (GameManager.s_instance == null) {
            GameManager.s_instance = new GameManager();
        }
        return GameManager.s_instance;
    }
}