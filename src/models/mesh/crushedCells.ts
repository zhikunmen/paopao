interface CrushedGroup {
	cellIndices: number[];
};

class CrushedCells {
	private _crushes: CrushedGroup[];
	public mesh: Mesh;

	constructor(mesh: Mesh) {
		this._crushes = new Array<CrushedGroup>();
		this.mesh = mesh;
	}

	/**
	 * 添加消除组
	 * 
	 * 注意：此处并不判断索引是否符合消除条件，需要在外面判断
	 */
	public addCells(cells: Cell[]) {
		//cells中有block
		if (cells.filter(cell => cell.blank).length > 0)
			throw new Error('some cells are blank.');
		//数量小于2		
		if (cells.length < 2)
			throw new Error('cells length must > 2.');
		let indices: number[] = cells.map(v => v.index);

		this._crushes.push({
			cellIndices: indices
		});
	}

	/**
	 * 联合所有能合并的项目，比如下面的场景，会分为5次加入，但是是一次消
	 *  1      2
	 * ● ● ○ ○ ● ●
	 *  3 ● ● ● 5
	 *      4
	 */
	public toUnion(): Array<CrushedGroup> {
		let newCrushes: Array<CrushedGroup> = [];

		this._crushes.forEach(v1 => {
			let indices: number[] = [...v1.cellIndices];
			this._crushes.forEach(v2 => {
				if (v1 == v2)
					return;
				if (_.intersection(indices, v2.cellIndices).length > 0)
					indices = _.union(indices, v2.cellIndices); //累计附加
			});
			if (indices.length > 2) {
				if (newCrushes.filter(v => _.intersection(indices, v.cellIndices).length == indices.length).length == 0) //相同的不要添加
					newCrushes.push({ cellIndices: indices });
			}
		});

		return newCrushes;
	}

	public cellInGroup(index: number): CrushedGroup {
		let arr = [];
		for (let crush of this.toUnion()) {
			if (crush.cellIndices.indexOf(index) != -1) {
				let closeArr = [];
				_.unique(crush.cellIndices);
				for (let i = 0; i < crush.cellIndices.length; i++) {
					let cross: number[] = this.mesh.closestIndices(crush.cellIndices[i]);
					for (let j = 0; j < cross.length; j++) {
						// 补丁：前面的计算消除块的算法有漏洞，在这里再对需要消除的区域做一次筛查
						if (this.mesh.cells[cross[j]].colorIndex == this.mesh.cells[index].colorIndex || this.mesh.cells[cross[j]].colorIndex == BallTypeEnum.GIFT_BALL_6 || this.mesh.cells[cross[j]].colorIndex == BallTypeEnum.RED_BALL_7) {
							closeArr.push(cross[j]);
						}
					}
				}
				crush.cellIndices.push(..._.unique(closeArr));
				arr.push(...crush.cellIndices);
			}
		}
		arr = _.unique(arr);
		return { cellIndices: arr };
	}

	/**
	 * 所有消除组
	 */
	public get crushes(): CrushedGroup[] {
		return this.toUnion();
	}

	/**
	 * 是否有消除
	 */
	public get hasCrushes(): boolean {
		return this.crushes.length > 0;
	}

	/**
	 * 消掉的单元组
	 */
	public get length(): number {
		return this.crushes.length;
	}
}