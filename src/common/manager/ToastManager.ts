/**
 * toast 提示类
 */
module ToastManager {
    let group: eui.Group;
    let toastViewArr: ToastPanel[] = [];

    export function addPopUp(desc: string): void {
        let self = this;
        this.checkNext = function () {
            // group.removeChildren();
            for (let i = 0; i < toastViewArr.length; i++) {
                group.addChild(toastViewArr[i]);
            }
        }

        if (!group) {
            group = new eui.Group();
            var vLayout: eui.VerticalLayout = new eui.VerticalLayout();
            vLayout.gap = 10;
            vLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
            group.layout = vLayout; //设置问垂直布局
            group.bottom = GameConfig.curHeight() >> 1;
            group.horizontalCenter = 0;
            group.touchThrough = true;
            group.touchEnabled = group.touchChildren = false;
        }
        if (!core.LayerCenter.getInstance().getLayer(LayerEnum.TOP).contains(group)) {
            core.LayerCenter.getInstance().getLayer(LayerEnum.TOP).addChild(group);
        }

        let toastView = new ToastPanel(desc);
        toastViewArr.push(toastView);
        egret.Tween.get(toastView).wait(2500).to({ alpha: 0 }, 500).call(() => {
            toastViewArr.splice(toastViewArr.indexOf(toastView), 1);
            self.checkNext();
        });

        this.checkNext();

        egret.setTimeout(()=>{
            core.LayerCenter.getInstance().getLayer(LayerEnum.TOP).removeChildren();
        },this,10000);
    }
}	