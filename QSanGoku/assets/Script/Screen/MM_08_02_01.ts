import GeneralBG from "../Model/GeneralBG";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_08_02_01 extends cc.Component {

    @property(cc.Node)
    NodeGeneralBG: cc.Node = null;
    GeneralBG: GeneralBG = null;

    onLoad() {
        this.GeneralBG = this.NodeGeneralBG.getComponent(GeneralBG);
    }

}
