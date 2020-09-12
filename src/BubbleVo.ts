/**
 * ...泡泡数据
 * @author Kanon
 */
class BubbleVo {
    /**颜色*/
    public color: number;
    /**用户数据*/
    public userData: any;
    /**x坐标*/
    public x: number;
    /**y坐标*/
    public y: number;
    /**半径*/
    public radius: number;
    /**横向向量*/
    public vx: number = 0;
    /**纵向向向量*/
    public vy: number = 0;
    /**重力*/
    public g: number = 0;
    /**行数*/
    public row: number;
    /**列表数*/
    public column: number;
    /**是否检测过消除悬空*/
    public isCheck: Boolean;
}