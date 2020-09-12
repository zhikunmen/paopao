class MeshUI extends core.EUIComponent {
    public colorList: number[];

    public container: MeshContainer;
    private mesh: Mesh;
    public animLayer: eui.Group;
    constructor(container: MeshContainer) {
        super();

        this.container = container;
        this.mesh = container.mesh;

        this.x = container.rect.x;
        this.y = container.rect.y;
        this.width = container.rect.width;
        this.height = container.rect.height;
    }

    /**
     * 显示
     */
    protected onShow(event?: egret.Event): void {
        super.onShow(event);
        this.renderMesh1();
    }

    protected onHide(event?: egret.Event): void {
        super.onHide(event);
        egret.Tween.removeAllTweens();
        this.removeChildren();
    }

    public onRemovedFromStage(event: egret.Event): void {
        this.removeAllEventListeners();
    }

    public removeAllEventListeners(): void {

    }

    public replaceBubbleUI(bubbleUI: BubbleUI) {
        if (!bubbleUI || !bubbleUI.cell) {
            return;
        }
        let bubble = this.getChildByCellIndex(bubbleUI.cell.index);
        if(bubble && !bubble.cell){
            debugger;
            bubble.parent && bubble.parent.removeChild(bubble);
        }
        if (!bubble || !bubble.cell) {
            bubble = this.container.createBubbleUI(this.mesh.cell(bubbleUI.cell.index));
            this.addChild(bubble);
        }
        let idx: number = bubbleUI.cell.index;
        if (bubble instanceof BubbleUI) {
            bubble.cell = bubbleUI.cell;
            this.mesh.cells[bubbleUI.cell.index] = bubbleUI.cell;
            bubble.reRender();
            SoundMgr.getInstance().playPaopaoon();
        }
        bubbleUI.destroy();
    }

    public async play(index: number) {
        let bubble = this.getChildByCellIndex(index);
        if (!bubble || !bubble.cell) {
            debugger;
            return;
        }
        let idx: number = index;
        if (bubble instanceof BubbleUI) {
            bubble.play();
        }

        let arr: number[] = this.container.mesh.closestIndices(bubble.cell.index, false);
        arr = arr.sort((a, b) => {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1
            } else {
                return 0;
            }
        });
        let orginIndex: number = bubble.cell.index;
        bubble = this.getChildByCellIndex(arr[0]);
        if (bubble){
            bubble.play("left-top");
        }else{
            egret.log('------------left-top--');
            egret.log(arr);
            egret.log(this.numChildren);
        }
            
        bubble = this.getChildByCellIndex(arr[1]);
        if (bubble)
            bubble.play("right-top");
        bubble = this.getChildByCellIndex(orginIndex + 1);
        if (bubble && bubble.cell.col != 0) {
            bubble.play("right");
        }
        bubble = this.getChildByCellIndex(orginIndex - 1);
        if (bubble && bubble.cell.col != 9 && bubble.cell.col != 10)
            bubble.play("left");
        egret.setTimeout(() => {
            return Promise.resolve();
        }, this, 100);
    }

    //真正调用的是这个
    public renderMesh1(): void {
        this.removeChildren();
        // this.$children.forEach((value: BubbleUI, index) => {
        //     if (value.state == "playing") {
        //         // this.removeChild(value)
        //     }
        // })
        this.removeChildren();



        for (let index of this.mesh.indicesEntries()) {
            let cellUI: BubbleUI = this.container.createBubbleUI(this.mesh.cell(index));
            this.addChild(cellUI);
        }
    }


    public renderMesh(): void {
        let cellUIArr: BubbleUI[] = [];
        for (let index of this.mesh.indicesEntries()) {
            let cellUI: BubbleUI = this.getChildByCellIndex(index);
            if (cellUI) {
                cellUIArr.push(cellUI);
            }
        }

        for (let index of this.mesh.indicesEntries()) {
            if (!this.mesh.cell(index).blank) {
                let cellUI: BubbleUI = cellUIArr.pop();
                if (!cellUI) {
                    cellUI = this.container.createBubbleUI(this.mesh.cell(index));
                }
                cellUI.to(this.mesh.cell(index));
                this.addChild(cellUI);
                let rect: sharp.Rectangle = this.container.getCellRectangle(index);
                cellUI.y = rect.y;
                cellUI.x = rect.x;
                cellUI.width = rect.width;
                cellUI.height = rect.height;
                cellUI.name = "cell";
            }
        }
        for (let i = 0; i < cellUIArr.length; i++) {
            cellUIArr[i].parent.removeChild(cellUIArr[i]);
        }
    }

    public getChildByCellIndex(index: number): BubbleUI | null {
        for (let i = 0; i < this.numChildren; i++) {
            let element: BubbleUI = this.getChildAt(i) as BubbleUI;
            if (element.name != 'cell') continue;
            if (element.cell && element.cell.index == index)
                return element;
        }
        return null;
    }

    public renderCrush(group: CrushedGroup, index: number = -1) {
        let promises: Promise<any>[] = [];
        let i = 0;
        if (index != -1) {
            group.cellIndices.sort((a, b) => {
                return this.container.getCellPoint(index, null).distance(this.container.getCellPoint(a, null)) -
                    this.container.getCellPoint(index, null).distance(this.container.getCellPoint(b, null)); //按距离排序
            })
        }
        group.cellIndices.forEach(index => {
            //特殊球-冰球处理
            let closestIndices: number[] = this.mesh.closestIndices(index);
            let ui = this.getChildByCellIndex(index);

            if (ui instanceof BubbleUI) {
                //特殊球-冰球处理
                for (let i = 0; i < closestIndices.length; i++) {
                    let iceui = this.getChildByCellIndex(closestIndices[i]);
                    if (iceui instanceof BubbleUI) {
                        if (iceui.cell.colorIndex == BallTypeEnum.SPECIL_ICE) {
                            // var _colorIndex = ui.cell.colorIndex;
                            this.mesh.at(iceui.cell.index).colorIndex = ui.cell.colorIndex;
                            // TODO:礼包周围的冰球应该随机出什么？？？
                            if (ui.cell.colorIndex == BallTypeEnum.GIFT_BALL_6) {
                                // debugger;
                            }
                            iceui.iceRender();
                        }
                    }
                }


                promises.push(ui.disappear(i));
            }
            i++;
        });

        return Promise.all(promises);
    }

    public renderCrushIndex(indexs: number[], addEffect: string = '') {
        let promises: Promise<any>[] = [];
        let i = indexs.length;
        indexs.forEach(index => {
            //特殊球-冰球处理
            let closestIndices: number[] = this.mesh.closestIndices(index);
            let ui = this.getChildByCellIndex(index);
            i--;
            if (ui instanceof BubbleUI) {
                if (addEffect) {
                    if (ui.cell.colorIndex == BallTypeEnum.SPECIL_BLACK_HOLE || ui.cell.colorIndex == BallTypeEnum.SPECIL_IRON) {
                        return;
                    }
                }
                //特殊球-冰球处理
                for (let i = 0; i < closestIndices.length; i++) {
                    let iceui = this.getChildByCellIndex(closestIndices[i]);
                    if (iceui instanceof BubbleUI) {
                        if (iceui.cell.colorIndex == BallTypeEnum.SPECIL_ICE) {

                            this.mesh.at(iceui.cell.index).colorIndex = ui.cell.colorIndex;
                            iceui.iceRender();
                        }
                    }
                }
                promises.push(ui.disappear(i, addEffect));
            }
        });

        return Promise.all(promises);
    }

    /**
     * 黑洞球相关
     */
    public async renderBlackHole(target: number, index: number = -1) {
        let ui = this.getChildByCellIndex(index);
        let targetui = this.getChildByCellIndex(target);
        let img: eui.Image = new eui.Image(`ball_${ui.cell.colorIndex}_png`);
        ui.parent.addChild(img);
        img.anchorOffsetX = img.anchorOffsetY = 34;
        ui.removeChildren();
        ui.to(this.mesh.createCell(ui.cell.index));
        this.mesh.at(ui.cell.index).colorIndex = -1;
        img.x = ui.x + 34;
        img.y = ui.y + 34;
        egret.Tween.get(img).to({
            scaleX: 0,
            scaleY: 0,
            x: targetui.x + 34,
            y: targetui.y + 34
        }, 1000).call(() => {
            img.parent.removeChild(img);
            Promise.resolve();
        })
    }

    public renderDroping(dropingIndices: number[]) {
        let idx: number = 0;
        for (let index of dropingIndices) {
            let ui = this.getChildByCellIndex(index);
            if (ui instanceof BubbleUI)
                ui.destroy();
            let cellUI: BubbleUI = this.container.createBubbleUI(this.mesh.cell(index));
            this.parent.addChild(cellUI);
            cellUI.drop(idx);
        }

        // dropingIndices.forEach(index => {
        //     idx++;
        //     let ui = this.getChildByCellIndex(index);
        //     if (ui instanceof BubbleUI)
        //         ui.drop(idx);
        // });

    }

    public destroy(): void {

    }
}
