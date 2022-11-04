import MM_Transition from "./MM_Transition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_08_03_01 extends cc.Component {

    @property(cc.Node)
    nodeConfigWindow: cc.Node = null;

    onLoad() {//ConfigWindow
        this.nodeConfigWindow.getComponent("ConfigWindow").setOnClick_btnBack((btn) => { this.onClick_btnBack(btn) });
    }

    onClick_btnBack(btn) {
        cc.log("onClick_btnBack");
        let trans = new MM_Transition();
        trans.reqBack();
    }
}
