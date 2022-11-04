// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import MM_Transition from "../Screen/MM_Transition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralBG extends cc.Component {

    @property(cc.Node)
    NodeBtnConfirm: cc.Node = null;

    @property(cc.Node)
    NodeBtnCancel: cc.Node = null;

    @property
    isShowSelection: boolean = true;

    @property
    isShowConfirm: boolean = true;

    onClick_BtnConfirmPlus: any = null;
    onClick_BtnBackPlus: any = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("GeneralBG onLoad");
        if (this.isShowSelection) {
            this.NodeBtnConfirm.active = this.isShowConfirm;
            this.NodeBtnCancel.active = true;
        } else {
            this.NodeBtnConfirm.active = false;
            this.NodeBtnCancel.active = false;
        }
        this.NodeBtnConfirm.getComponent("cc.Button").node.on('click', this.onClick_BtnConfirm, this);
        this.NodeBtnCancel.getComponent("cc.Button").node.on('click', this.onClick_BtnCancel, this);
    }

    start() {
        cc.log("GeneralBG start");

    }

    // update (dt) {}

    setOnClick_BtnConfirm(fn) {
        this.onClick_BtnConfirmPlus = fn;
    }

    setOnClick_BtnBack(fn) {
        this.onClick_BtnBackPlus = fn;
    }

    onClick_BtnConfirm(btn) {
        if (this.onClick_BtnConfirmPlus) this.onClick_BtnConfirmPlus(btn);
    }
    onClick_BtnCancel(btn) {
        if (this.onClick_BtnBackPlus) this.onClick_BtnBackPlus(btn);
        let trans = new MM_Transition();
        trans.reqBack();

    }
}
