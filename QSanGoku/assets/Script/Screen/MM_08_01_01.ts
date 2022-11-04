import GeneralBG from "../Model/GeneralBG";
import ChargeSelection from "../Model/ChargeSelection";
import GameConfig from "../Model/GameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_08_01_01 extends cc.Component {

    @property(cc.Integer)
    curFocus: number = 1
    @property(cc.Node)
    NodeGeneralBG: cc.Node = null;
    @property(cc.Node)
    NodeChargeSelection1: cc.Node = null;
    @property(cc.Node)
    NodeChargeSelection2: cc.Node = null;
    @property(cc.Node)
    NodeChargeSelection3: cc.Node = null;
    @property(cc.Node)
    NodeChargeSelection4: cc.Node = null;
    @property(cc.Label)
    Point: cc.Label = null;
    @property(cc.Label)
    Point1: cc.Label = null;
    @property(cc.Label)
    Point2: cc.Label = null;
    @property(cc.Label)
    Point3: cc.Label = null;
    @property(cc.Label)
    Point4: cc.Label = null;
    @property(cc.Label)
    Dollar1: cc.Label = null;
    @property(cc.Label)
    Dollar2: cc.Label = null;
    @property(cc.Label)
    Dollar3: cc.Label = null;
    @property(cc.Label)
    Dollar4: cc.Label = null;

    //private
    gameCfg: GameConfig = null;
    GeneralBG: GeneralBG = null;
    ChargeSelection1: ChargeSelection = null;
    ChargeSelection2: ChargeSelection = null;
    ChargeSelection3: ChargeSelection = null;
    ChargeSelection4: ChargeSelection = null;
    
    
    onLoad() {
        this.gameCfg = new GameConfig();
        this.gameCfg.Load();
        this.Point.string = "" + this.gameCfg.piont;
        //10p $1
        this.Point1.string = "" + 10;
        this.Dollar1.string = "" + 1;
        //20p $2
        this.Point2.string = "" + 20;
        this.Dollar2.string = "" + 2;
        //60p $5
        this.Point3.string = "" + 60;
        this.Dollar3.string = "" + 5;
        //150p $10
        this.Point4.string = "" + 150;
        this.Dollar4.string = "" + 10;

        this.ChargeSelection1 = this.NodeChargeSelection1.getComponent(ChargeSelection);
        this.ChargeSelection2 = this.NodeChargeSelection2.getComponent(ChargeSelection);
        this.ChargeSelection3 = this.NodeChargeSelection3.getComponent(ChargeSelection);
        this.ChargeSelection4 = this.NodeChargeSelection4.getComponent(ChargeSelection);
        this.NodeChargeSelection1.on("click", () => { this.onClick_BtnFocus(1) }, this);
        this.NodeChargeSelection2.on("click", () => { this.onClick_BtnFocus(2) }, this);
        this.NodeChargeSelection3.on("click", () => { this.onClick_BtnFocus(3) }, this);
        this.NodeChargeSelection4.on("click", () => { this.onClick_BtnFocus(4) }, this);

        this.GeneralBG = this.NodeGeneralBG.getComponent(GeneralBG);
        this.GeneralBG.setOnClick_BtnConfirm(() => { this.onClick_BtnConfirm() });
        this.flash();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.targetOff(this);
    }

    onKeyUp(event: any) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                this.GeneralBG.onClick_BtnCancel(null);
                break;
        }
    }

    flash() {
        this.ChargeSelection1.setFocus(false);
        this.ChargeSelection2.setFocus(false);
        this.ChargeSelection3.setFocus(false);
        this.ChargeSelection4.setFocus(false);
        if (this.curFocus == 1) {
            this.ChargeSelection1.setFocus(true);
        } else if (this.curFocus == 2) {
            this.ChargeSelection2.setFocus(true);
        } else if (this.curFocus == 3) {
            this.ChargeSelection3.setFocus(true);
        } else if (this.curFocus == 4) {
            this.ChargeSelection4.setFocus(true);
        }
        this.ChargeSelection1.flash();
        this.ChargeSelection2.flash();
        this.ChargeSelection3.flash();
        this.ChargeSelection4.flash();
    }

    onClick_BtnFocus(curFocus: number) {
        this.curFocus = curFocus;
        this.flash();

    }

    onClick_BtnConfirm() {
        if (this.curFocus == 1) {//10p $1
            this.gameCfg.AddPiontQty(10);
        } else if (this.curFocus == 2) {//20p $2
            this.gameCfg.AddPiontQty(20);
        } else if (this.curFocus == 3) {//60p $5
            this.gameCfg.AddPiontQty(60);
        } else if (this.curFocus == 4) {//150p $10
            this.gameCfg.AddPiontQty(150);
        }
        this.Point.string = "" + this.gameCfg.piont;
    }
}
