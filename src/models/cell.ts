class Cell {
	public mesh: MeshBase;
	public index: number;
	public colorIndex:number = -1;

	constructor(mesh: MeshBase, index:number) {
		this.mesh = mesh;
		this.index = index;
	}

	public get color(): any {
		if(this.colorIndex >= 0 && this.colorIndex < this.mesh.cellColors.length){
			return this.mesh.cellColors[this.colorIndex];
		}
		return -1;
	}

	public get row(): number {
		return this.mesh.row(this.index);
	}

	public get col(): number {
		return this.mesh.col(this.index);
	}
	/**
	 * 偶数行
	 */
	public get evenRow(): boolean {
		return this.row % 2 == 1;
	}

	/**
	 * 奇数行
	 */
	public get oddRow(): boolean {
		return this.row % 2 == 0;
	}

	/**
	 * 偶数的最后一个
	 */
	public get evenLast(): boolean {
		return this.evenRow && this.col + 1 == this.mesh.cols;
	}

	public get blank(): boolean {
		return this.colorIndex < 0 || this.colorIndex == null;  //偶数行, 最后一个
	}

	public sameColor(cell: Cell) : boolean {
		if(!this.blank && !cell.blank){
			if(this.colorIndex == cell.colorIndex){
				return true;
			}
		}
		return false;
	}

}
