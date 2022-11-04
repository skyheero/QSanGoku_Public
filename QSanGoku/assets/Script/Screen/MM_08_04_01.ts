import GeneralBG from "../Model/GeneralBG";
import GameConfig from "../Model/GameConfig";
import MarketSelection from "../Model/MarketSelection";
import MessageDialog from "../Model/MessageDialog";
import MM_Transition from "./MM_Transition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_08_04_01 extends cc.Component {

    @property(cc.Integer)
    focusItemID: number = 1;
    @property(cc.Integer)
    focusItemQty: number = 1;
    @property(cc.Node)
    NodeGeneralBG: cc.Node = null;
    @property(cc.Label)
    ReducePoint: cc.Label = null;
    @property(cc.Label)
    HavedPoint: cc.Label = null;
    @property(cc.Label)
    ItemName: cc.Label = null;
    @property(cc.Label)
    ItemDes: cc.Label = null;
    @property(cc.Node)
    ItemHave: cc.Node = null;
    @property(cc.Label)
    ItemCount: cc.Label = null;

    @property(MarketSelection)
    box: MarketSelection = null;
    @property(MarketSelection)
    sorghum: MarketSelection = null;
    @property(MarketSelection)
    dukang: MarketSelection = null;
    @property(MarketSelection)
    diamond: MarketSelection = null;
    @property(MarketSelection)
    upPower: MarketSelection = null;
    @property(MarketSelection)
    upCON: MarketSelection = null;
    @property(MarketSelection)
    upSTR: MarketSelection = null;
    @property(MarketSelection)
    upAGI: MarketSelection = null;
    @property(MarketSelection)
    sorghum12: MarketSelection = null;
    @property(MarketSelection)
    dukang12: MarketSelection = null;
    @property(MarketSelection)
    diamond12: MarketSelection = null;
    @property(MarketSelection)
    upPower12: MarketSelection = null;
    @property(MarketSelection)
    upCON12: MarketSelection = null;
    @property(MarketSelection)
    upSTR12: MarketSelection = null;
    @property(MarketSelection)
    upAGI12: MarketSelection = null;

    //private
    gameCfg: GameConfig = null;
    GeneralBG: GeneralBG = null;
    reducePoint: number = -1;
    trans: MM_Transition = null;

    onLoad() {
        this.trans = new MM_Transition();
        this.gameCfg = new GameConfig();
        this.gameCfg.Load();
        this.ItemName.string = "";
        this.ItemDes.string = "";
        this.ReducePoint.string = "";
        this.HavedPoint.string = "" + this.gameCfg.piont;
        this.ItemHave.active = false;
        this.GeneralBG = this.NodeGeneralBG.getComponent(GeneralBG);
        this.GeneralBG.setOnClick_BtnConfirm(() => { this.onClick_BtnConfirm() });
        this.box.node.on("click", () => { this.onClick_BtnFocus(0, 1, this.box) }, this);
        this.diamond.node.on("click", () => { this.onClick_BtnFocus(1, 1, this.diamond) }, this);
        this.sorghum.node.on("click", () => { this.onClick_BtnFocus(2, 1, this.sorghum) }, this);
        this.dukang.node.on("click", () => { this.onClick_BtnFocus(3, 1, this.dukang) }, this);
        this.upPower.node.on("click", () => { this.onClick_BtnFocus(4, 1, this.upPower) }, this);
        this.upCON.node.on("click", () => { this.onClick_BtnFocus(5, 1, this.upCON) }, this);
        this.upSTR.node.on("click", () => { this.onClick_BtnFocus(6, 1, this.upSTR) }, this);
        this.upAGI.node.on("click", () => { this.onClick_BtnFocus(7, 1, this.upAGI) }, this);
        this.diamond12.node.on("click", () => { this.onClick_BtnFocus(1, 12, this.diamond12) }, this);
        this.sorghum12.node.on("click", () => { this.onClick_BtnFocus(2, 12, this.sorghum12) }, this);
        this.dukang12.node.on("click", () => { this.onClick_BtnFocus(3, 12, this.dukang12) }, this);
        this.upPower12.node.on("click", () => { this.onClick_BtnFocus(4, 12, this.upPower12) }, this);
        this.upCON12.node.on("click", () => { this.onClick_BtnFocus(5, 12, this.upCON12) }, this);
        this.upSTR12.node.on("click", () => { this.onClick_BtnFocus(6, 12, this.upSTR12) }, this);
        this.upAGI12.node.on("click", () => { this.onClick_BtnFocus(7, 12, this.upAGI12) }, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.targetOff(this);
    }

    onKeyUp(event: any) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                this.trans.reqBack();
                break;
        }
    }

    onClick_BtnFocus(ItemID: number, qty: number, target: MarketSelection) {
        this.focusItemID = ItemID;
        this.focusItemQty = qty;
        if (this.focusItemQty == 1) {
            switch (this.focusItemID) {
                case 1://鑽石x1 10p
                case 2://高粱酒x1 10p
                case 4://強化寶石x1 10p
                    this.reducePoint = 10;
                    break;
                case 0://寶箱x1 20p
                case 3://杜康酒x1 20p
                case 5://杜康酒x1 20p
                case 6://杜康酒x1 20p
                case 7://杜康酒x1 20p
                    this.reducePoint = 20;
                    break;
            }
        } else if (this.focusItemQty == 12) {
            switch (this.focusItemID) {
                case 1://鑽石x12 100p
                case 2://高粱酒x12 100p
                case 4://強化寶石x12 100p
                    this.reducePoint = 100;
                    break;
                case 3://杜康酒x12 200p
                case 5://杜康酒x1 20p
                case 6://杜康酒x1 20p
                case 7://杜康酒x1 20p
                    this.reducePoint = 200;
                    break;
            }
        }
        let itemcount = this.gameCfg.Items[this.focusItemID];
        if (itemcount == -1) {
            this.ItemHave.active = false;
        } else {
            this.ItemHave.active = true;
            this.ItemCount.string = "" + this.gameCfg.Items[this.focusItemID]
        }
        this.ItemName.string = "ItemID:" + ItemID;
        this.ItemDes.string = "還沒寫 ItemID:" + ItemID;
        this.ReducePoint.string = "" + this.reducePoint;

        this.box.setFocus(false);
        this.sorghum.setFocus(false);
        this.dukang.setFocus(false);
        this.diamond.setFocus(false);
        this.upPower.setFocus(false);
        this.upCON.setFocus(false);
        this.upSTR.setFocus(false);
        this.upAGI.setFocus(false);
        this.sorghum12.setFocus(false);
        this.dukang12.setFocus(false);
        this.diamond12.setFocus(false);
        this.upPower12.setFocus(false);
        this.upCON12.setFocus(false);
        this.upSTR12.setFocus(false);
        this.upAGI12.setFocus(false);
        target.setFocus(true);
        this.box.flash();
        this.sorghum.flash();
        this.dukang.flash();
        this.diamond.flash();
        this.upPower.flash();
        this.upCON.flash();
        this.upSTR.flash();
        this.upAGI.flash();
        this.sorghum12.flash();
        this.dukang12.flash();
        this.diamond12.flash();
        this.upPower12.flash();
        this.upCON12.flash();
        this.upSTR12.flash();
        this.upAGI12.flash();

    }

    onClick_BtnConfirm() {

        if (this.reducePoint == -1) return;
        if (this.gameCfg.piont >= this.reducePoint) {
            //彈出確定視窗
            var msg = "是否花費" + this.reducePoint + "愛豆購買" + "ItemID:" + this.focusItemID;
            if (this.focusItemQty > 1) msg += "禮包";
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_Buy() }, null, this.focusItemID, this.focusItemQty);
        } else {
            //彈出沒點視窗
            var msg = "點數不足是否充值";
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }
        // this.Point.string = "" + this.gameCfg.piont;
    }

    onClick_Buy() {
        if (this.focusItemID == 0) {
            MessageDialog.showMsg_1btn(this.node, "尚未實裝", null);
            return;
        }
        this.gameCfg.ReducePiontQty(this.reducePoint);
        this.gameCfg.AddItemQty(this.focusItemID, this.focusItemQty);
        this.ItemCount.string = "" + this.gameCfg.Items[this.focusItemID]
        this.HavedPoint.string = "" + this.gameCfg.piont;
    }

    onClick_GotoCharge() {
        this.trans.reqForward("MM_08_01_01");
    }
}
