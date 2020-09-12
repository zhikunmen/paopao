interface IntersectsBubble {
	rayIndex: number;
	cell: Cell | null;
};

class MeshContainer {
	public mesh: Mesh;
	public rect: sharp.Rectangle;
	public shootAngle: number = 270;
	public radius: number;
	public diameter: number;
	public jetPoint: sharp.Point;
	private crossDeltaHeight: number;
	public meshUI:MeshUI;

	constructor(mesh: Mesh, rect: sharp.Rectangle, jetPoint: sharp.Point) {
		this.mesh = mesh;
		this.rect = rect;
		this.diameter = rect.width / this.mesh.cols;
		this.radius = this.diameter / 2;
		this.jetPoint = jetPoint;
		this.crossDeltaHeight = this.diameter - this.diameter * Math.cos(sharp.d2r(30)); //3相同的圆相切，60度，换算成直角就是30度
	}

	public getCellPoint(rowOrIndex: number, col: number): sharp.Point {
		let row: number = rowOrIndex;
		if (col == null) {
			row = this.mesh.row(rowOrIndex);
			col = this.mesh.col(rowOrIndex);
		}

		let x: number = col * this.diameter;
		let y: number = row * this.diameter - this.crossDeltaHeight * row - this.rect.y + 235; //减去圆顶部相交的地方 

		if (row % 2 == 1) // 偶数行
			x += this.radius
		return new sharp.Point(x, y);
	}

	public localToGlobal(x: number, y: number) {
		return sharp.Point.create(x, y).add(this.rect.x, this.rect.y);
	}

	public getCellRectangle(rowOrIndex: number, col?: number): sharp.Rectangle {
		let position: sharp.Point = this.getCellPoint(rowOrIndex, col);
		return new sharp.Rectangle(
			position.x,
			position.y,
			this.diameter,
			this.diameter
		);
	}

	public getCirclePos(cellIndex: number): sharp.Point {
		let rect = this.getCellRectangle(cellIndex);
		return this.localToGlobal(rect.centerPoint.x, rect.centerPoint.y + this.meshUI.y); //圆心 转换为stage坐标
	}

	/**
	 * ray为绝对坐标
	 */
	public reflectRays(): sharp.Ray[] {
		let p = this.localToGlobal(0, this.radius);
		let rect = sharp.Rectangle.create(p.x, GameConfig.curHeight() / 2 - 1334 / 2, this.rect.width, 1334 - 86 - this.radius), //由于是圆，所以碰撞的矩形是以左右上下的圆心为基准
			sides = rect.sides,
			ray = new sharp.Ray(this.jetPoint, sharp.d2r(Math.abs(this.shootAngle - 270) <= 0.00001 ? 270.00001 : this.shootAngle)),
			i: number = 0,
			index: number,
			rays: sharp.Ray[] = [ray],
			ray1: any;
		while (true) {
			index = i % sides.length;
			if (i > sides.length * 6) //反射了12次
				break;
			ray1 = ray.reflectLine(sides[index]);

			if (ray1 instanceof sharp.Ray) // 碰撞了
			{
				ray = ray1;
				if (index == 0) // 上
				{
					rays.push(ray);
					break;
				} else if (index == 1 || index == 3) {//左右
					rays.push(ray);
				}
			}
			i++;
		}

		return rays;
	}

	/**
	 *
	 */
	private range = [];
	public intersectsBubble(rays: sharp.Ray[], diameterRate: number = 2): IntersectsBubble {
		// 第一个是喷嘴
		if (rays.length <= 1)
			return {
				rayIndex: -1,
				cell: null
			}

		let ray: sharp.Ray,
			rayIndex: number,
			cell: Cell,
			index: number,
			circlePoint: sharp.Point,
			circlePoints: any[],
			circle: sharp.Circle,
			tangencyPoints: sharp.Point[],
			slope: number,
			result: IntersectsBubble = {
				rayIndex: -1, cell: null
			};

		for (rayIndex = 0; rayIndex < rays.length - 1; ++rayIndex) { //顶点肯定在顶部
			circlePoints = [];
			ray = rays[rayIndex];

			for (index of this.mesh.indicesEntries(-1)) // revert
			{
				cell = this.mesh.cell(index);
				if (cell.blank)
					continue;

				circlePoint = this.getCirclePos(cell.index);
				// 计算与第一个圆相切的切点，放大1倍，
				circle = new sharp.Circle(circlePoint, 50);//this.diameter /2); //这里有修改
				tangencyPoints = ray.intersectsCircle(circle);

				

				if (tangencyPoints.length <= 0) // 不相交
					continue;

				tangencyPoints.sort((a, b) => a.distance(ray.start) - b.distance(ray.start)); //按距离排序

				// 第一个便是切点
				circlePoints.push([tangencyPoints[0], cell]);
				egret.log("qiedain---", circlePoints);

				if (ray.intersectsCircle(new sharp.Circle(circlePoint, this.radius)).length > 0) // 有线穿过本圆
					break;
			}

			egret.log("射线碰撞的圆---", ray, cell, circlePoints);
			

			if (circlePoints.length > 0) // 有相交
			{
				egret.log("交点数组---", circlePoints);
				circlePoints.sort((a, b) => {
					return Math.abs(a[0].angle(ray.start) - ray.angle) - Math.abs(b[0].angle(ray.start) - ray.angle);
				}); //按垂直线排序，经过简化，直接按斜率差值排序即可
				this.range = [];
				for (let [p, cell] of circlePoints) {
					circlePoint = this.getCirclePos(cell.index);
					slope = sharp.r2d(circlePoint.angle(p));
					slope = ((slope + 360) % 360);
					if (slope <= 90 || slope >= 337.5) // 右 右下
					{
						let r = [
							[cell.row, cell.col + 1]
						];

						if (cell.evenRow) // 偶数行 /
							r.push([cell.row + 1, cell.col + 1]);
						else
							r.push([cell.row + 1, cell.col]);

						if (slope > 45 && slope <= 90) r = r.reverse();  // 下面优先
						this.range.push(...r);
					}
					else if (slope > 90 && slope <= 202.5) // 左 左下
					{
						let r = [
							[cell.row, cell.col - 1]
						];
						if (cell.evenRow) // 偶数行 \
							r.push([cell.row + 1, cell.col]);
						else
							r.push([cell.row + 1, cell.col - 1]);

						if (slope < 135) r = r.reverse(); // 下面优先
						this.range.push(...r);
					}
					else if (slope < 337.5 && slope > 270)  // 右上 67.5°
					{
						if (cell.evenRow) // 偶数行 \
							this.range.push([cell.row - 1, cell.col + 1]);
						else
							// this.range.push([cell.row - 1, cell.col]

							// fix 当对准一行的第一个会出现往上移了一格的问题
							// case: colors.splice(-22, 22, -1,-1,-1,-1,4,4,4,4,-1,-1,-1,4,4,4,4,-1,-1,-1,4,4,4)
							if (cell.col == 0) {
								this.range.push([cell.row + 1, cell.col])
							} else {
								this.range.push([cell.row - 1, cell.col])
							}
					}
					else if (slope > 202.5 && slope <= 270) // 左上 67.5°
					{
						if (cell.evenRow) // 偶数行 /
							this.range.push([cell.row - 1, cell.col]);
						else

							this.range.push([cell.row - 1, cell.col - 1]);
							
							// TODO: 静止向右方向发射bug
							// 例子:修改mesh.ts 232行  colors.splice(-22, 22, -1,-1,-1,-1,4,4,4,4,-1,-1,-1,4,4,4,4,-1,-1,-1,4,4,4, 4)
							// if (cell.col == 11) {								
							// 	this.range.push([cell.row + 1, cell.col - 1])
							// } else {
							// 	this.range.push([cell.row - 1, cell.col - 1])
							// }
							
					}
				}

				// let indices: number[] = 
				var effArr = this.range.filter(r => r[0] < this.mesh.rows && r[0] >= 0 && r[1] >= 0 && r[1] < this.mesh.cols)
				egret.log("得到可能arr---", effArr);
				var effIndexArr = 	effArr.map(r => this.mesh.index(r[0], r[1]))
				egret.log("得到索引---", effIndexArr);
				var indices = effIndexArr.filter(i => this.mesh.blank(i) && !this.mesh.evenLast(i))
				// var indices = effIndexArr.filter(i => this.mesh.blank(i) )
				

				//  .sort((a, b) => this.getCirclePos(a).y - this.getCirclePos(b).y)
				egret.log("得到最终球索引---", indices);
				if (indices.length > 0) {
					// for(let i = 0;i < indices.length; i ++){
					// 	let s = new egret.Shape();
					// 	s.graphics.clear();
					// 	s.graphics.beginFill(0xcccccc);
					// 	s.graphics.drawCircle(0,0,this.diameter/2);
					// 	s.graphics.endFill();
					// 	s.x = this.getCirclePos(indices[i]).x;
					// 	s.y = this.getCirclePos(indices[i]).y + 34;
					// 	GameConfig.curStage().addChild(s);
					// 	s.alpha = 0.5;
					// 	this.s.push(s);
					// }

					
					var data = {
						rayIndex,
						cell: this.mesh.cell(indices[indices.length - 1]),
					}
					console.log("返回最后的碰撞点-----", data)
					return data ;
					
				} else {
					// debugger
				}
			} else { // 没有找到交点
				ray = rays[rayIndex + 1];
				egret.log(ray.start.y);
				if (ray && ray.start.y <= GameConfig.curHeight() / 2 - 1334 / 2 + 86) // 在顶部
				{
					for (let index of this.mesh.colsEntries()) {
						cell = this.mesh.cell(index);
						if (!cell.blank)
							continue;
						circlePoint = this.getCirclePos(cell.index);
						if (ray.intersectsCircle(new sharp.Circle(circlePoint, this.diameter)).length > 0)
							return {
								rayIndex: rayIndex,
								cell: cell,
							};
					}
					return result;
				}
			}
		}
		// 最后一行，或者没值 则表示挂
		return result;
	}

	/**
	 * 圆心轨迹，均为绝对坐标
	 */

	private dd: egret.Shape;
	public circleTraces(rays: sharp.Ray[], intersection: IntersectsBubble): sharp.Point[] {
		if (!intersection) {
			debugger;
		}

		let points: sharp.Point[] = [rays[0].start];
		if (!intersection.cell) // game over
			return points;
		for (let i = 1; i <= intersection.rayIndex; ++i)
			points.push(rays[i].start);
		let lastLine = new sharp.Line(points[points.length - 1], rays[intersection.rayIndex].start);

		let rect = this.getCellRectangle(intersection.cell.index),
			p = this.localToGlobal(rect.centerPoint.x, rect.centerPoint.y); // 转换为stage坐标
		// p = new sharp.Point(rect.centerPoint.x, rect.centerPoint.y)

		// if(!this.dd){
		// 	this.dd = new egret.Shape();
		// }
		// this.dd.graphics.clear();
		// this.dd.graphics.beginFill(0xccc);
		// this.dd.graphics.drawCircle(p.x,p.y,34);
		// this.dd.graphics.endFill();
		// GameConfig.curStage().addChild(this.dd);

		points.push(p);

		return points;
	}
	/**
	 * 在当前可以消除的cell中，随机一个颜色
	 * 算法是从底部开始取颜色，让用户可以率先消除底部球
	 * 样本颜色设置少一点，方便消除，默认只有总数的2/3
	 */
	protected randomColor(referenceCount?: number): number {
		if (referenceCount == undefined)
			referenceCount = this.mesh.cellColors.length * .6;
		let colorIndices: number[] = [];
		for (let index of this.mesh.indicesEntries(-1)) {
			let cell = this.mesh.cell(index);
			if (colorIndices.length >= referenceCount) break;
			if (cell.colorIndex > -1 && colorIndices.indexOf(cell.colorIndex) == -1)
				colorIndices.push(cell.colorIndex);
		}

		return colorIndices[_.random(0, colorIndices.length - 1)];
	}

	public createPrepareBubble(ball: number) {
		let cell = new Cell(this.mesh, -1);
		cell.colorIndex = ball;

		let bubble: BubbleUI = new BubbleUI(cell);
		bubble.anchorOffsetX = this.radius;
		bubble.anchorOffsetY = this.radius;
		bubble.width = this.diameter;
		bubble.height = this.diameter;
		bubble.name = "cell";
		return bubble;
	}

	public createBubbleUI(cell: Cell) {
		let rect: sharp.Rectangle = this.getCellRectangle(cell.index);
		let bubble: BubbleUI = new BubbleUI(cell);
		bubble.x = rect.x;
		bubble.y = rect.y;
		bubble.width = rect.width;
		bubble.height = rect.height;
		bubble.name = "cell";
		return bubble;
	}

	/**
	 * 激光道具特殊碰撞
	 */
	public propLaserIntersection(ray: sharp.Ray): number[] {
		let indexArr: number[] = [];
		for (let index of this.mesh.indicesEntries(-1)) // revert
		{
			let cell = this.mesh.cell(index);
			if (cell.blank)
				continue;
			if (cell.colorIndex == BallTypeEnum.SPECIL_BLACK_HOLE || cell.colorIndex == BallTypeEnum.SPECIL_IRON) {
				continue;
			}
			let circlePoint = this.getCirclePos(cell.index);
			if (ray.intersectsCircle(new sharp.Circle(circlePoint, this.radius * 1.2)).length > 0) // 有线穿过本圆
				indexArr.push(cell.index);
		}
		return indexArr;
	}
}