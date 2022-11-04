import GeneralBG from "../Model/GeneralBG";
import CastleSelection from "../Model/CastleSelection";
import MessageDialog from "../Model/MessageDialog";
import GameConfig from "../Model/GameConfig";
import MM_Transition from "./MM_Transition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_01_01 extends cc.Component {

    @property(cc.Node)
    NodeGeneralBG: cc.Node = null;
    @property(cc.Label)
    labDiamondCount: cc.Label = null;
    @property(cc.Label)
    labNowGrassMax: cc.Label = null;
    @property(cc.Label)
    labAfterGrassMax: cc.Label = null;
    @property(cc.Label)
    labNowGrassSpeed: cc.Label = null;
    @property(cc.Label)
    labAfterGrassSpeed: cc.Label = null;
    @property(cc.Label)
    labNowHomeHp: cc.Label = null;
    @property(cc.Label)
    labAfterHomeHp: cc.Label = null;

    @property(cc.ProgressBar)
    progressGrassMax: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    progressGrassSpeed: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    progressHomeHp: cc.ProgressBar = null;

    @property(cc.Node)
    NodeGrassMax: cc.Node = null;
    @property(cc.Node)
    NodeGrassSpeed: cc.Node = null;
    @property(cc.Node)
    NodeHomeHp: cc.Node = null;

    //private
    gameConfig: GameConfig = null;
    trans: MM_Transition = null;

    GeneralBG: GeneralBG = null;
    GrassMax: CastleSelection = null;
    GrassSpeed: CastleSelection = null;
    HomeHp: CastleSelection = null;
    ItemID_Diamond = 1;//ID:1 diamond

    onLoad() {
        this.trans = new MM_Transition();
        this.gameConfig = new GameConfig();
        this.gameConfig.Load();

        this.GeneralBG = this.NodeGeneralBG.getComponent(GeneralBG);
        this.GeneralBG.isShowConfirm = false;
        this.GrassMax = this.NodeGrassMax.getComponent(CastleSelection);
        this.GrassSpeed = this.NodeGrassSpeed.getComponent(CastleSelection);
        this.HomeHp = this.NodeHomeHp.getComponent(CastleSelection);
        this.GrassMax.setOnClick_LeftUnselected(() => { this.onClick_NodeGrassMax_Left() });
        this.GrassMax.setOnClick_RightUnselected(() => { this.onClick_NodeGrassMax_Right() });
        this.GrassSpeed.setOnClick_LeftUnselected(() => { this.onClick_NodeGrassSpeed_Left() });
        this.GrassSpeed.setOnClick_RightUnselected(() => { this.onClick_NodeGrassSpeed_Right() });
        this.HomeHp.setOnClick_LeftUnselected(() => { this.onClick_NodeHomeHp_Left() });
        this.HomeHp.setOnClick_RightUnselected(() => { this.onClick_NodeHomeHp_Right() });

        this.labDiamondCount.string = "" + this.gameConfig.Items[this.ItemID_Diamond];
        this.labAfterGrassMax.string = "??";
        this.labAfterGrassSpeed.string = "??";
        this.labAfterHomeHp.string = "??";
        this.labNowGrassMax.string = "??";
        this.labNowGrassSpeed.string = "??";
        this.labNowHomeHp.string = "??";
        this.progressGrassMax.progress = this.gameConfig.GrassMaxLv / 10;
        this.progressGrassSpeed.progress = this.gameConfig.GrassSpeedLv / 10;
        this.progressHomeHp.progress = this.gameConfig.HomeHpLv / 10;
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

    onClick_NodeGrassMax_Left() {
        this.GrassSpeed.setFocus(false);
        this.HomeHp.setFocus(false);
        this.GrassMax.flash();
        this.GrassSpeed.flash();
        this.HomeHp.flash();

    }
    onClick_NodeGrassMax_Right() {
        this.onClick_NodeGrassMax_Left();
        if (this.gameConfig.isMax_GrassMaxLv()) {
            MessageDialog.showMsg_1btn(this.node, "已滿級", null);
        } else if (this.gameConfig.Items[this.ItemID_Diamond] > 0) {
            MessageDialog.showMsg_2btn(this.node, "確定消耗1個鑽石升級糧草上限？", () => { this.onClick_doGrassMaxLvUp() }, null, null, null);
        } else {
            var msg = "鑽石不足是否前往商城購買？"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
    }
    onClick_doGrassMaxLvUp() {
        this.gameConfig.ReduceItemQty(this.ItemID_Diamond, 1);
        this.labDiamondCount.string = "" + this.gameConfig.Items[this.ItemID_Diamond];
        this.gameConfig.Add1_GrassMaxLv();
        this.progressGrassMax.progress = this.gameConfig.GrassMaxLv / 10;
    }

    onClick_NodeGrassSpeed_Left() {
        this.GrassMax.setFocus(false);
        this.HomeHp.setFocus(false);
        this.GrassMax.flash();
        this.GrassSpeed.flash();
        this.HomeHp.flash();

    }
    onClick_NodeGrassSpeed_Right() {
        this.onClick_NodeGrassSpeed_Left();
        if (this.gameConfig.isMax_GrassSpeedLv()) {
            MessageDialog.showMsg_1btn(this.node, "已滿級", null);
        } else if (this.gameConfig.Items[this.ItemID_Diamond] > 0) {
            MessageDialog.showMsg_2btn(this.node, "確定消耗1個鑽石升級糧草恢復速度？", () => { this.onClick_doGrassSpeedLvUp() }, null, null, null);
        } else {
            var msg = "鑽石不足是否前往商城購買？"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
    }
    onClick_doGrassSpeedLvUp() {
        this.gameConfig.ReduceItemQty(this.ItemID_Diamond, 1);
        this.labDiamondCount.string = "" + this.gameConfig.Items[this.ItemID_Diamond];
        this.gameConfig.Add1_GrassSpeedLv();
        this.progressGrassSpeed.progress = this.gameConfig.GrassSpeedLv / 10;
    }
    onClick_NodeHomeHp_Left() {
        this.GrassSpeed.setFocus(false);
        this.GrassMax.setFocus(false);
        this.GrassSpeed.flash();
        this.GrassMax.flash();
        this.HomeHp.flash();
    }
    onClick_NodeHomeHp_Right() {
        this.onClick_NodeHomeHp_Left();
        if (this.gameConfig.isMax_HomeHpLv()) {
            MessageDialog.showMsg_1btn(this.node, "已滿級", null);
        } else if (this.gameConfig.Items[this.ItemID_Diamond] > 0) {
            MessageDialog.showMsg_2btn(this.node, "確定消耗1個鑽石升級軍營堅固度？", () => { this.onClick_doHomeHpLvUp() }, null, null, null);
        } else {
            var msg = "鑽石不足是否前往商城購買？"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
    }
    onClick_doHomeHpLvUp() {
        this.gameConfig.ReduceItemQty(this.ItemID_Diamond, 1);
        this.labDiamondCount.string = "" + this.gameConfig.Items[this.ItemID_Diamond];
        this.gameConfig.Add1_HomeHpLv();
        this.progressHomeHp.progress = this.gameConfig.HomeHpLv / 10;
    }

    onClick_GotoCharge() {
        this.trans.reqForward("MM_08_04_01");
    }

}
