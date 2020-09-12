class Mesh extends MeshBase {
	constructor(rows: number, cols: number) {
		super(rows, cols);
		this.cells = [];
		for (let index of this.indicesEntries()) // fill all
			this.cells.push(this.createCell(index));
	}

	//此类都是读取的函数

	public color(rowOrIndex: number, col?: number): any {
		return this.cell(rowOrIndex, col).color;
	}

	public colorIndex(rowOrIndex: number, col?: number): number {
		return this.cell(rowOrIndex, col).colorIndex;
	}

	public blank(rowOrIndex: number, col?: number): boolean {
		return this.cell(rowOrIndex, col).blank;
	}

	public evenLast(rowOrIndex: number, col?: number): boolean {
		return this.cell(rowOrIndex, col).evenLast;
	}

	public evenRow(rowOrIndex: number, col?: number): boolean {
		return this.cell(rowOrIndex, col).evenRow;
	}

	public oddRow(rowOrIndex: number, col?: number): boolean {
		return this.cell(rowOrIndex, col).oddRow;
	}

	public at(index: number): Cell | null {
		if (index >= this.cells.length || index < 0) {
			return null;
		}
		return this.cells[index];
	}

	public cell(rowOrIndex: number, col?: number): Cell {
		let index: number = col == null ? rowOrIndex : this.index(rowOrIndex, col);
		return this.at(index);
	}

	public isEmpty(): boolean {
		for (let index of this.indicesEntries()) // fill all
			if (!this.blank(index))
				return false;
		return true;
	}

	public *solidIndicesEntries() {
		for (let index of this.solidIndices())
			yield index;
	}

	public solidIndices() {
		let solids: number[] = [];
		for (let index of this.indicesEntries()) {
			if (!this.blank(index))
				solids.push(index);
		}
		return solids;
	}

	/**
	 * 上下左右的index合集
	 */
	public closestIndices(index: number, withSiblings: boolean = true): number[] {
		let col = this.col(index);
		let row = this.row(index);

		let range: any[] = [];

		if (withSiblings)
			range.push([row, col - 1], [row, col + 1]); // 左右

		range.push([row - 1, col], [row + 1, col]); // 上 下
		if (row % 2 == 1) // 偶数行
		{
			range.push([row - 1, col + 1], [row + 1, col + 1]); // 上右 下右
		} else {
			range.push([row - 1, col - 1], [row + 1, col - 1]); // 上左 下左
		}

		let indices: number[] = [];
		for (let [row, col] of range) {
			if (col < 0 || col >= this.cols || row < 0 || row >= this.rows || (row % 2 == 1 && col == this.cols - 1)) // 超出范围，或者偶数行的最后一个
				continue;
			indices.push(this.index(row, col));
		}
		return indices;
	}

	/**
	 * 检查黑洞
	 */
	public checkBlackHole(index: number): number {
		let closestIndices = this.closestIndices(index).filter(i => {
			return !this.blank(i)
		});

		for (let i = 0; i < closestIndices.length; i++) {
			let colorIndex = this.at(closestIndices[i]).colorIndex;
			if (colorIndex == BallTypeEnum.SPECIL_BLACK_HOLE) {
				return closestIndices[i];
			}
		}

		return -1;
	}

	/**
	 * 同一行的
	 */
	public sameRow(index: number): number[] {
		let range: any[] = [];
		let row = this.row(index);
		let num = 11;
		if (row % 2 == 1) { // 偶数行
			num = 10;
		}
		for (let col = 0; col < num; col++) {
			range.push(this.index(row, col)); // 上右 下右
		}

		return range;
	}

	protected randomColorIndex(rowOrIndex: number, col?: number): number {
		let random = (): number => {
			let colorCount: number = this.cellColors.length;
			return ~~(Math.random() * colorCount);
		};

		let row: number = rowOrIndex;
		if (col == null) {
			row = this.row(rowOrIndex);
			col = this.col(rowOrIndex);
		} else {
			rowOrIndex = this.index(row, col);
		}
		if (this.evenLast(row, col)) return -1; // 偶数行没最后一个

		let colorIndex: number = -1, crushes: CrushedGroup;
		let tmpCells: Cell[] = [...this.cells];
		tmpCells[rowOrIndex] = this.createCell(rowOrIndex);
		do {
			colorIndex = random();
			tmpCells[rowOrIndex].colorIndex = colorIndex;
			crushes = this.crushedCells(tmpCells).cellInGroup(rowOrIndex);
		} while (crushes.cellIndices.length >= 4); //别一下出现太多

		return colorIndex;
	}

	//此类都是写入的函数

	public createCell(rowOrIndex: number, col?: number): Cell {
		let index: number = rowOrIndex;
		if (!isNaN(col))
			index = this.index(rowOrIndex, col);
		let cell: Cell = new Cell(this, index);
		cell.colorIndex = -1;
		return cell;
	}

	// /**
	//  * 初始化的时候 需要绘制的图形
	//  */
	// public createMesh(initIndices: number[] = []): void {
	// 	this.cells = [];
	// 	for (let index of this.indicesEntries()) // fill all
	// 		this.cells.push(this.createCell(index));

	// 	initIndices.forEach(index => {
	// 		let cell: Cell = this.cells[index];
	// 		if (cell)
	// 			cell.colorIndex = this.randomColorIndex(cell.row, cell.col);
	// 	});
	// }


	private configArr: number[] = []; // 所有配置数组

	private initConfig() {

		// // 游戏开始将所有配置随机好
		// while(levelConfig1.length > 0) {
		// 	var _randomIndex = Math.floor(core.MathUtils.random(0, levelConfig1.length - 1));
		// 	var _randomArr = levelConfig1.splice(_randomIndex, 1);
		// 	// egret.log(_randomIndex, _randomArr)
		// 	if (_randomArr.length > 0) {
		// 		this.configArr = this.configArr.concat(_randomArr[0])
		// 	}
		// }


		for (var i=0; i < levelConfig1.length; i ++) {
			var _randomIndex = core.MathUtils.random(0, levelConfig1[i].length);
			var _randomArr = levelConfig1[i][_randomIndex];
			this.configArr = this.configArr.concat(_randomArr)
		}
	}
	/**
	 * 初始化54个
	 */
	public initMesh(): void {
		this.cells = [];
		for (let index of this.indicesEntries()) // fill all
			this.cells.push(this.createCell(index));
		//初始化加4行
		let colors: number[] = [];

		LocalStorageController.getInstance().levelData = [];
		LocalStorageController.getInstance().setCoin(0);
		BaskectBallManager.getInstance().score = 0;
		// if (this._configIndex <= -1) {
		// 	this._configIndex = core.MathUtils.random(0,levelConfig1.length);
		// }

		this.initConfig();
		let _scolors = this.getSingleRowData(true);
		colors = _scolors.concat(colors);
		for (var time = 0; time < 3; time ++) {
			let _color = this.createNewRows(false)
			colors = _color.concat(colors)
			// egret.log("初始化--------------", colors.join())
		}

		// egret.log("初始化--------------", colors.join())
		// colors = this.createNewRows(false).concat(this.createNewRows(false)).concat(this.createNewRows(false)).concat(this.createNewRows(false));
		
		// colors = this.createNewRows(false).concat(this.createLastRows());
		// colors.splice(-11); 
		// colors = this.fillotherCells(colors);
		

		// 。     。。。。
		//  。。。。     。。。
		// 必现bug 这种情况的射击第一个泡泡有问题
		// colors.splice(-22, 22, -1,-1,-1,-1,4,4,4,4,-1,-1,-1,4,4,4,4,-1,-1,-1,4,4,4, 4)
		// colors = [BallTypeEnum.GIFT_BALL_6]
		// colors = [1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,BallTypeEnum.SPECIL_IRON,BallTypeEnum.SPECIL_IRON,BallTypeEnum.SPECIL_IRON,BallTypeEnum.SPECIL_IRON,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
		for (let i = 0; i < this.cells.length; i++) {
			this.cells[i].colorIndex = colors[i];
		}

		this.giftLineCount = 0;

		BaskectBallManager.getInstance().isFirst = true;
	}

	/**
	 * 复活 保留8行
	 */
	public reborn(): void {
		for (let i = 11 * 8 - 1; i < this.cells.length; i++) {
			this.cells[i].colorIndex = -1;
		}
	}

	// private _configIndex:number = 16;
	// private _tempConfig:number[] = levelConfig1[0].concat();
	private createNewRows(gift: boolean = true): number[] {
		// let singleBallCount: number = BaskectBallManager.getInstance().getCurConfig().row_1;
		// let totalBallCount: number = 10;

		// //随机生成单色球位置
		// let singleBallPosArr: number[] = [];
		// function getRanPos(min: number, max: number): number {
		// 	return Math.random() * (max - min) + min << 0;
		// }
		// for (let i = 0; i < singleBallCount; i++) {
		// 	let ranBall: number = getRanPos(0, totalBallCount - 1);
		// 	while (singleBallPosArr.indexOf(ranBall) != -1) {
		// 		ranBall = getRanPos(0, totalBallCount - 1);
		// 	}
		// 	singleBallPosArr.push(ranBall);
		// }
		// singleBallPosArr.sort();

		// egret.log("单色球位置" + singleBallPosArr)

		// let singleBallCandicate: number[] = BaskectBallManager.getInstance().getCurConfig().balls1;
		// let doubleBallCandicate: number[] = BaskectBallManager.getInstance().getCurConfig().balls2;

		// let evenBallArr: number[] = this.getEvenBalls(singleBallCandicate, doubleBallCandicate, singleBallPosArr);
		// let oddBallArr: number[] = this.getOddBalls(singleBallCandicate, doubleBallCandicate, singleBallPosArr, evenBallArr)

		// 1. 初始进入游戏随机生成_configIndex
		// if (this._configIndex <= -1) {
		// 	this._configIndex = core.MathUtils.random(0,levelConfig1.length);
		// }
		// egret.log("初始化--", this._configIndex, levelConfig1[this._configIndex].join())
		// // 暂时不对已经出现的进行随机，还是在原来的配置中取
		// if(levelConfig1[this._configIndex].length <= 10){
		// 	levelConfig1[this._configIndex] = this._tempConfig.concat();
		// 	this._configIndex = core.MathUtils.random(0,levelConfig1.length);
		// }

		let arr: number[] = [];

		// 第一次取偶数行
		let evenBallArr1 = this.configArr.splice(0, 10).concat([-1]);
		
		// 第二次取单数行
		let oddBallArr1 = this.configArr.splice(0, 11);

		// 队列形式最先取出放在数组最后
		arr = arr.concat(oddBallArr1)		
		arr = arr.concat(evenBallArr1)
		egret.log(arr.join())

		// arr = oddBallArr1.concat(evenBallArr1);

		egret.log("giftLineCount:" + this.giftLineCount + ',' + RedManager.getInstance().normal_get_num);

		// 礼包球随机出现在一个左或右有球的位置
		let notEmptyArr = [];
		arr.forEach((value, index) => {
			if (value != -1) {
				notEmptyArr.push(index);
			}
		})
		let giftIndex = notEmptyArr[core.MathUtils.random(0,notEmptyArr.length)];
		
		// arr[giftIndex] = BallTypeEnum.GIFT_BALL_6;
		if (this.giftLineCount == 0 && gift) {
			// let index = 0;//core.MathUtils.random(0,2);
			// if(arr[index] == -1){
			// 	arr[index - 1] = BallTypeEnum.GIFT_BALL_6;
			// }else{
			// arr[giftIndex] = BallTypeEnum.GIFT_BALL_6;
			// }
		} else if (this.giftLineCount == this.triggerGiftLineNum && gift) {
			let index = 0;
			arr[giftIndex] = BallTypeEnum.GIFT_BALL_6;
		}
		return arr;
	}

	/**
	 * 最后一行设成同样颜色
	 */
	private createLastRows(): number[] {
		let arr = [];
		for (let i = 0; i < 11; i++) {
			arr.push(1);
		}
		return arr;
	}
	/**
	 *  默认获取偶数行数量
	 */
	private getSingleRowData(odd: boolean = false): number[] {

		var arr = [];
		if (odd) {
			arr = this.configArr.splice(0,11);
		} else {
			arr = this.configArr.splice(0,10).concat(-1);
		}
		return arr
	}

	/**
	 * 获取双数 10个有色球
	 *  单色球候选 singleBallCandicate
	 *  双色球候选 doubleBallCandicate
	 *  单色球数量 singleBallCount
	 */
	private getEvenBalls(singleBallCandicate: number[], doubleBallCandicate: number[], singleBallPosArr: number[]): number[] {
		//最终生成多少球
		let totalBallCount: number = 10;

		//生成最终数组
		let finalArr: number[] = [];
		for (let i = 0; i < totalBallCount; i++) {
			//finalArr.push(this.getRandomArrayElements(totalArr, totalBallCount));
			finalArr.push(-1);
		}

		for (let i = 0; i < singleBallPosArr.length; i++) {
			let singlePos: number = singleBallPosArr[i],
				singleBall = this.getRandomArrayElements(singleBallCandicate, 1);
			finalArr[singlePos] = singleBall;
			// //左右边的球保证不能跟它一样颜色
			// if (finalArr[singlePos - 1] && singleBallPosArr.indexOf(singlePos - 1) == -1) {
			// 	finalArr[singlePos - 1] = this.getRandomExcludeVal(doubleBallCandicate, singleBall);
			// }
			// if (finalArr[singlePos + 1] && singleBallPosArr.indexOf(singlePos + 1) == -1) {
			// 	finalArr[singlePos + 1] = this.getRandomExcludeVal(doubleBallCandicate, singleBall);
			// }
		}

		// for (let i = 0; i < finalArr.length; i++) {
		// 	if (singleBallPosArr.indexOf(i) != -1) {
		// 		//第一个球左边的球颜色要一致
		// 		let before: number = singleBallPosArr[0];
		// 		if (before > 1) {
		// 			for (let j = before - 1; j >= 0; j--) {
		// 				finalArr[j] = finalArr[i - 1];
		// 			}
		// 		}

		// 		//单点球右边的颜色跟单点球一样颜色
		// 		let end: number = singleBallPosArr[singleBallPosArr.indexOf(i) + 1];
		// 		if (!end) {
		// 			end = finalArr.length; //最后一个
		// 		}
		// 		for (let j = i + 1; j < end; j++) {
		// 			finalArr[j] = finalArr[i + 1];
		// 		}
		// 	}
		// }

		for (let i = 1; i < singleBallPosArr.length; i++) { //两个球挨着不能一样颜色
			let pos: number = singleBallPosArr[i];
			if (pos - singleBallPosArr[i - 1] == 1) {
				if (finalArr[pos + 1]) {
					finalArr[pos] = this.getRandomExcludeVal2(singleBallCandicate, finalArr[pos - 1], finalArr[pos + 1]);
				} else {
					finalArr[pos] = this.getRandomExcludeVal(singleBallCandicate, finalArr[pos - 1]);
				}
			}
		}

		let randomColor = this.getRandomExcludeVal2(doubleBallCandicate, singleBallPosArr[0], singleBallPosArr[1]);
		for (let i = 0; i < finalArr.length; i++) {
			if (finalArr[i] == -1) {
				finalArr[i] = randomColor;
			} else {
				randomColor = this.getRandomExcludeVal2(doubleBallCandicate, nextSingball(i), finalArr[i]);
			}
		}

		function nextSingball(index: number): number {
			for (let i = 0; i < singleBallPosArr.length; i++) {
				if (index < singleBallPosArr[i]) {
					return finalArr[singleBallPosArr[i]];
				}
			}
		}

		finalArr.push(-1);
		return finalArr;
	}

	/**
	 * 获取奇数 11个有色球
	 */
	private getOddBalls(singleBallCandicate: number[], doubleBallCandicate: number[], singleBallPosArr: number[], evenBallArr: number[]): number[] {
		//最终生成多少球
		let totalBallCount: number = 11;

		//生成最终数组
		let finalArr: number[] = [];
		for (let i = 0; i < totalBallCount; i++) {
			//finalArr.push(this.getRandomExcludeVal(totalArr, 1));
			finalArr.push(-1);
		}

		for (let i = 0; i < singleBallPosArr.length; i++) {
			let singlePos: number = singleBallPosArr[i],
				singleBall = evenBallArr[singlePos]
			//左右边的球保证不能跟它一样颜色
			if (finalArr[singlePos]) {
				finalArr[singlePos] = this.getRandomExcludeVal(doubleBallCandicate, singleBall);
			}
			if (finalArr[singlePos + 1]) {
				finalArr[singlePos + 1] = this.getRandomExcludeVal2(doubleBallCandicate, singleBall, finalArr[singlePos]);
			}
		}

		for (let i = 1; i < singleBallPosArr.length; i++) { //两个球挨着 性能问题暂时屏蔽
			let pos: number = singleBallPosArr[i];
			if (pos - singleBallPosArr[i - 1] == 1) {
				// finalArr[pos] = this.getRandomExcludeVal4(doubleBallCandicate, finalArr[pos - 1], evenBallArr[pos], evenBallArr[pos - 1], finalArr[pos + 1]);
				finalArr[pos] = this.getRandomExcludeVal2(doubleBallCandicate, evenBallArr[pos], evenBallArr[pos - 1]);
			}
		}

		return finalArr;
	}

	//从数组抽取不是某个值的值
	private getRandomExcludeVal(arr: number[], excludeVal: number): number {
		let randomVal: number = this.getRandomArrayElements(arr, 1);
		while (randomVal == excludeVal) {
			randomVal = this.getRandomArrayElements(arr, 1);
		}
		return randomVal;
	}
	private getRandomExcludeVal2(arr: number[], excludeVal: number, excludeVal1: number): number {
		let randomVal: number = this.getRandomArrayElements(arr, 1);
		while (randomVal == excludeVal || randomVal == excludeVal1) {
			randomVal = this.getRandomArrayElements(arr, 1);
		}
		return randomVal;
	}

	private getRandomExcludeVal4(arr: number[], excludeVal: number, excludeVal1: number, excludeVal2: number, excludeVal3: number): number {
		let randomVal: number = this.getRandomArrayElements(arr, 1);
		while (randomVal == excludeVal || randomVal == excludeVal1 || randomVal == excludeVal2 || randomVal == excludeVal3) {
			randomVal = this.getRandomArrayElements(arr, 1);
		}
		return randomVal;
	}
	//数组随机取值
	private getRandomArrayElements(arr, count): number {
		var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
		while (i-- > min) {
			index = Math.floor((i + 1) * Math.random());
			temp = shuffled[index];
			shuffled[index] = shuffled[i];
			shuffled[i] = temp;
		}
		return shuffled.slice(min)[0];
	}
	//打乱数组
	private gRandomArr(arr, length) {
		// 从原数组中一次性返回10个元素
		var arr2 = arr.slice(0, length);
		// 使用sort将原数组的顺序打乱，让有序变成无序
		arr2.sort(function () {
			return Math.random() - 0.5;
		});
		return arr2;
	};

	/**
	 * 生成新的两行
	 */
	public triggerGiftLineNum = 30;
	public giftLineCount: number = 0;
	public _createdNum = 0;
	public addNewRows(): void {
		egret.log("add new row")
		this.giftLineCount += 2;
		this._createdNum += 2;
		console.log("---- createed num", this._createdNum);
		
		if (this.giftLineCount > this.triggerGiftLineNum) {
			this.giftLineCount = 0;
		}
		let tempCellsColorArr: number[] = [];
		let cells = this.cells;
		for (let i = 0; i < cells.length; i++) {
			tempCellsColorArr.push(cells[i].colorIndex);
			cells[i].colorIndex = -1;
		}
		tempCellsColorArr.splice(-21, 21);

		let newBalls: number[] = this.createNewRows();
		newBalls = this.fillotherCells(newBalls);
		tempCellsColorArr = newBalls.concat(tempCellsColorArr);

		for (let i = 0; i < tempCellsColorArr.length; i++) {
			if (this.cells[i]) {
				this.cells[i].colorIndex = tempCellsColorArr[i];
			}
		}
		
	}

	/**
	 * 可消除的
	 */
	public crushedCells(cells?: Cell[]): CrushedCells {
		let crushes: CrushedCells = new CrushedCells(this);
		if (cells == undefined) cells = this.cells;

		let tmpCells: Cell[] = [];

		let dump = () => {
			if (tmpCells.length >= 2) //2连
				crushes.addCells(tmpCells);
			tmpCells.splice(0); // clear
		};

		let compareUp = (cell: Cell) => {
			let siblingCell: Cell;
			let row = cell.row;
			let col = cell.col;

			let range = [[row - 1, col]]; //上一行 同col
			/**
			 * ●   ○ ← 测这个
			 *   ●     偶数行 实心圆col相同
			 */
			if (cell.evenRow) {
				range.push([row - 1, col + 1]);
			}

			/**
			 * ↓ 测这个
			 * ○   ●
			 *   ●    奇数行 实心圆col相同
			 */
			else
				range.push([row - 1, col - 1]);

			for (let i = 0; i < range.length; i++) {
				let r = range[i];
				if (r[1] < 0 || r[1] >= this.cols)
					continue;
				siblingCell = cells[this.index(r[0], r[1])];
				if (cell.sameColor(siblingCell)) {
					crushes.addCells([cell, siblingCell]);
				}
			}
		}

		let compareLeft = (cell: Cell) => {
			if (cell.blank)
				dump();
			else if (tmpCells.length == 0)
				tmpCells.push(cell);
			else if (cell.sameColor(tmpCells[tmpCells.length - 1]))
				tmpCells.push(cell);
			else if (!cell.sameColor(tmpCells[tmpCells.length - 1])) {
				dump();
				tmpCells.push(cell);
			}
		}

		for (let row of this.rowsEntries()) {
			for (let col of this.colsEntries()) {
				let cell: Cell = cells[this.index(row, col)];
				if (!cell)
					continue;
				//计算横向的2个相连
				compareLeft(cell);
				//计算上面一行2个相连
				if (row > 0)
					compareUp(cell);
			}
			dump();
		}
		egret.log("crushes:", crushes);
		return crushes;
	}

	public dropingIndices(crushedIndices: number[] = []): number[] {
		//按列, 先入固定的表
		let fixedIndices: number[] = [];
		let rowArr: number[] = [];
		for (let col of this.colsEntries()) {
			for (let row of this.rowsEntries()) {
				let index = this.index(row, col);

				if (this.evenLast(index)) // 偶数行最后一个，则取左边
					index--;

				if (this.blank(index) || crushedIndices.indexOf(index) != -1)
					break;
				fixedIndices.push(index);
			}
		}

		let solidIndices = _.difference(this.solidIndices(), crushedIndices);
		while1:
		while (true) {
			for (let index of _.difference(solidIndices, fixedIndices)) // 取不固定的
			{
				let closestIndices = this.closestIndices(index).filter(i => {
					return !this.blank(i) && crushedIndices.indexOf(i) == -1
				}); // 寻找周围的，且不为blank的
				for (let i of closestIndices) {
					if (fixedIndices.indexOf(i) != -1) {
						fixedIndices = _.union(fixedIndices, closestIndices, [index]);
						continue while1; // 跳出重新循环
					}
				}
			}
			// 运行到这里，就已经说明没有了
			break;
		}

		return _.difference(solidIndices, fixedIndices);
	}

	public createPrepareBallColor(): number {
		let balls: number[] = [];
		for (let index of this.indicesEntries(-1)) {
			let col = this.col(index);
			let row = this.row(index);
			let cell = this.at(this.index(row, col));
			let cell1 = this.at(this.index(row + 1, col));
			let cell2 = this.at(this.index(row + 2, col));
			if (cell.color != -1 && cell.color != null && cell1 && cell2 && cell1.blank && cell2.blank) {
				balls.push(cell.color);
			}
		}
		balls = _.uniq(balls);
		egret.log("-------创建新的球", balls);
		// 容错 设置默认值
		return this.getRandomArrayElements(balls, 1) || 0;
	}

	// 泡泡区域最底下的球是否触碰到线
	public isTouchLine(): boolean {
		let indexs: number[] = this.rowIndices(16);
		for (let i = 0; i < indexs.length; i++) {
			if (!this.at(indexs[i]).blank) {
				return true;
			}
		}
		return false;
	}

	public saveLevelData(): void {
		let indexs: number[] = [];
		for (let i = 0; i < this.cells.length; i++) {
			indexs.push(this.cells[i].colorIndex);
		}
		LocalStorageController.getInstance().levelData = indexs;
		LocalStorageController.getInstance().setCoin(BaskectBallManager.getInstance().score);
	}

	public isLeft2Line(): boolean {
		let indexs: number[] = this.rowIndices(9);
		for (let i = 0; i < indexs.length; i++) {
			if (!this.at(indexs[i]).blank) {
				return true;
			}
		}
		return false;
	}

	private fillotherCells(colors: number[]): number[] {
		// let doubleBallCandicate: number[] = BaskectBallManager.getInstance().getCurConfig().balls2;
		// for (let i = 0; i < colors.length; i++) {
		// 	if (colors[i] == -1 && !this.evenLast(i)) {
		// 		if (colors[i + 1] && colors[i + 1] == -1 && !this.evenLast(i + 1)) {
		// 			let color: number = this.getRandomArrayElements(doubleBallCandicate, 1);
		// 			colors[i] = color;
		// 			colors[i + 1] = color;
		// 		} else if (colors[i + 11] && colors[i + 11] == -1 && !this.evenLast(i + 11)) {
		// 			let color: number = this.getRandomArrayElements(doubleBallCandicate, 1);
		// 			colors[i] = color;
		// 			colors[i + 11] = color;
		// 		}
		// 	}
		// }
		// for (let i = 0; i < colors.length; i++) {
		// 	if (colors[i] == -1 && !this.evenLast(i)) {
		// 		let color: number = this.getRandomArrayElements(doubleBallCandicate, 1);
		// 		colors[i] = color;
		// 	}
		// }
		return colors;
	}
}