

class MathUtil {
    /**
     * 角度转换成弧度 degrees -> radians
     *  
     * @param degrees 角度
     * @return 相应的弧度
     */ 
    public static dgs2rds(degrees:number):number{
        return degrees * Math.PI / 180;
    }

    /**
	 * 计算距离
	 * @param	x1	点1的x坐标
	 * @param	y1	点1的y坐标
	 * @param	x2	点2的x坐标
	 * @param	y2	点2的y坐标
	 * @return	2点之间的距离
	 */
	public static distance(x1:number, y1:number, x2:number, y2:number):number{
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	}
}
 