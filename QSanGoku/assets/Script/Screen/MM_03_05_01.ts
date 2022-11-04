import GeneralBG from "../Model/GeneralBG";
import MessageDialog from "../Model/MessageDialog";
import GameConfig from "../Model/GameConfig";
import MM_Transition from "./MM_Transition";
import BarracksSelection from "../Model/BarracksSelection";
import BarracksInfo from "../Model/BarracksInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_05_01 extends cc.Component {

    @property(cc.Node)
    NodeGeneralBG: cc.Node = null;
    @property(cc.Label)
    labDiamondCount: cc.Label = null;
    @property(cc.Node)
    Infantry: cc.Node = null;
    @property(cc.Node)
    Spearman: cc.Node = null;
    @property(cc.Node)
    Cavalryman: cc.Node = null;
    @property(cc.Node)
    Archer: cc.Node = null;
    @property(cc.Node)
    BIInfantry: cc.Node = null;
    @property(cc.Node)
    BISpearman: cc.Node = null;
    @property(cc.Node)
    BICavalryman: cc.Node = null;
    @property(cc.Node)
    BIArcher: cc.Node = null;


    //private
    gameConfig: GameConfig = null;
    trans: MM_Transition = null;
    GeneralBG: GeneralBG = null;
    ItemID_Diamond = 1;//ID:1 diamond
    BS_Infantry: BarracksSelection = null;
    BS_Spearman: BarracksSelection = null;
    BS_Cavalryman: BarracksSelection = null;
    BS_Archer: BarracksSelection = null;

    BI_Infantry: BarracksInfo = null;
    BI_Spearman: BarracksInfo = null;
    BI_Cavalryman: BarracksInfo = null;
    BI_Archer: BarracksInfo = null;

    addAniInfantry: number = 0;
    addAniSpearman: number = 0;
    addAniCavalryman: number = 0;
    addAniArcher: number = 0;

    onLoad() {
        this.trans = new MM_Transition();
        this.gameConfig = new GameConfig();
        this.gameConfig.Load();

        this.GeneralBG = this.NodeGeneralBG.getComponent(GeneralBG);
        this.GeneralBG.isShowConfirm = false;
        this.labDiamondCount.string = "" + this.gameConfig.Items[this.ItemID_Diamond];

        this.BI_Infantry = this.BIInfantry.getComponent(BarracksInfo);
        this.BI_Infantry.soldierID = 0;
        this.BI_Spearman = this.BISpearman.getComponent(BarracksInfo);
        this.BI_Spearman.soldierID = 1;
        this.BI_Cavalryman = this.BICavalryman.getComponent(BarracksInfo);
        this.BI_Cavalryman.soldierID = 2;
        this.BI_Archer = this.BIArcher.getComponent(BarracksInfo);
        this.BI_Archer.soldierID = 3;
        this.BS_Infantry = this.Infantry.getComponent(BarracksSelection);
        this.BS_Spearman = this.Spearman.getComponent(BarracksSelection);
        this.BS_Cavalryman = this.Cavalryman.getComponent(BarracksSelection);
        this.BS_Archer = this.Archer.getComponent(BarracksSelection);
        this.BS_Infantry.setOnClick_LeftUnselected(() => { this.onClick_BS_Infantry_Left() });
        this.BS_Infantry.setOnClick_RightUnselected(() => { this.onClick_BS_Infantry_Right() });
        this.BS_Spearman.setOnClick_LeftUnselected(() => { this.onClick_BS_Spearman_Left() });
        this.BS_Spearman.setOnClick_RightUnselected(() => { this.onClick_BS_Spearman_Right() });
        this.BS_Cavalryman.setOnClick_LeftUnselected(() => { this.onClick_BS_Cavalryman_Left() });
        this.BS_Cavalryman.setOnClick_RightUnselected(() => { this.onClick_BS_Cavalryman_Right() });
        this.BS_Archer.setOnClick_LeftUnselected(() => { this.onClick_BS_Archer_Left() });
        this.BS_Archer.setOnClick_RightUnselected(() => { this.onClick_BS_Archer_Right() });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy(){
        cc.systemEvent.targetOff(this);
    }

    onKeyUp(event: any) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                this.trans.reqBack();
                break;
        }
    }

    update(dt) {
        // this.gameConfig.addSoldierExp(3,1000);
        var needFlash = false;
        var addCount = 10;
        if (this.addAniInfantry > 0) {
            this.gameConfig.addSoldierExp(0, addCount);
            this.addAniInfantry -= addCount;
            needFlash = true;
        }
        if (this.addAniSpearman > 0) {
            this.gameConfig.addSoldierExp(1, addCount);
            this.addAniSpearman -= addCount;
            needFlash = true;
        }
        if (this.addAniCavalryman > 0) {
            this.gameConfig.addSoldierExp(2, addCount);
            this.addAniCavalryman -= addCount;
            needFlash = true;
        }
        if (this.addAniArcher > 0) {
            this.gameConfig.addSoldierExp(3, addCount);
            this.addAniArcher -= addCount;
            needFlash = true;
        }
        if (needFlash) {
            this.flashSoldierInfo();
        }
    }

    onClick_BS_Infantry_Left() {
        this.BS_Spearman.setFocus(false);
        this.BS_Cavalryman.setFocus(false);
        this.BS_Archer.setFocus(false);
        this.flashSoldierInfo();
    }
    onClick_BS_Infantry_Right() {
        this.onClick_BS_Infantry_Left();
        if (this.gameConfig.Items[this.ItemID_Diamond] > 0) {
            MessageDialog.showMsg_2btn(this.node, "確定消耗1個鑽石升級？", () => { this.onClick_doInfantryLvUp() }, null, null, null);
        } else {
            var msg = "鑽石不足是否前往商城購買？"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
    }
    onClick_doInfantryLvUp() {
        this.gameConfig.ReduceItemQty(this.ItemID_Diamond, 1);
        this.addAniInfantry += 1000;
        // throw new Error("Method not implemented.");
    }
    onClick_BS_Spearman_Left() {
        this.BS_Infantry.setFocus(false);
        this.BS_Cavalryman.setFocus(false);
        this.BS_Archer.setFocus(false);
        this.flashSoldierInfo();
    }
    onClick_BS_Spearman_Right() {
        this.onClick_BS_Spearman_Left();
        if (this.gameConfig.Items[this.ItemID_Diamond] > 0) {
            MessageDialog.showMsg_2btn(this.node, "確定消耗1個鑽石升級？", () => { this.onClick_doSpearmanLvUp() }, null, null, null);
        } else {
            var msg = "鑽石不足是否前往商城購買？"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
    }
    onClick_doSpearmanLvUp() {
        this.gameConfig.ReduceItemQty(this.ItemID_Diamond, 1);
        this.addAniSpearman += 1000;
        // throw new Error("Method not implemented.");
    }
    onClick_BS_Cavalryman_Left() {
        this.BS_Infantry.setFocus(false);
        this.BS_Spearman.setFocus(false);
        this.BS_Archer.setFocus(false);
        this.flashSoldierInfo();
    }
    onClick_BS_Cavalryman_Right() {
        this.onClick_BS_Cavalryman_Left();
        if (this.gameConfig.Items[this.ItemID_Diamond] > 0) {
            MessageDialog.showMsg_2btn(this.node, "確定消耗1個鑽石升級？", () => { this.onClick_doCavalrymanLvUp() }, null, null, null);
        } else {
            var msg = "鑽石不足是否前往商城購買？"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
    }
    onClick_doCavalrymanLvUp() {
        this.gameConfig.ReduceItemQty(this.ItemID_Diamond, 1);
        this.addAniCavalryman += 1000;
        // throw new Error("Method not implemented.");
    }
    onClick_BS_Archer_Left() {
        this.BS_Infantry.setFocus(false);
        this.BS_Spearman.setFocus(false);
        this.BS_Cavalryman.setFocus(false);
        this.flashSoldierInfo();
    }
    onClick_BS_Archer_Right() {
        this.onClick_BS_Archer_Left();
        if (this.gameConfig.Items[this.ItemID_Diamond] > 0) {
            MessageDialog.showMsg_2btn(this.node, "確定消耗1個鑽石升級？", () => { this.onClick_doArcherLvUp() }, null, null, null);
        } else {
            var msg = "鑽石不足是否前往商城購買？"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
    }
    onClick_doArcherLvUp() {
        this.gameConfig.ReduceItemQty(this.ItemID_Diamond, 1);
        this.addAniArcher += 1000;
        // this.gameConfig.addSoldierExp(3,1000);
        // throw new Error("Method not implemented.");
    }

    onClick_GotoCharge() {
        this.trans.reqForward("MM_08_04_01");
    }

    flashSoldierInfo() {
        this.labDiamondCount.string = "" + this.gameConfig.Items[this.ItemID_Diamond];
        this.BI_Infantry.flash();
        this.BI_Spearman.flash();
        this.BI_Cavalryman.flash();
        this.BI_Archer.flash();
    }


}
