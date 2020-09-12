class ScoreBaseManager extends egret.EventDispatcher {
    public static UPDATE_SCORE: string = "update_score";

    /**
     * 当前分数
     */
    public totalScore: number = 0;
    public constructor() {
        super();
    }
    /**
    * 更新分数
    */
    public updateScore(type: string,pos:any): void {
    }

    public reset():void{
         this.totalScore = 0;
    }
}
