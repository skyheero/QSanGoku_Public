import GameConfig from "../Model/GameConfig";
import MM_Transition from "./MM_Transition";
import MessageDialog from "../Model/MessageDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_03_01 extends cc.Component {

    @property(cc.Button)
    btnConfirm: cc.Button = null;
    @property(cc.Button)
    btnLeave: cc.Button = null;
    @property(cc.Node)
    NodeRoundNumTip: cc.Node = null;
    @property(cc.Node)
    AniFocus: cc.Node = null;
    @property(cc.Node)
    WarSelection: cc.Node = null;
    @property(cc.Label)
    lblRoundOrder: cc.Label = null;
    @property([cc.Node])
    warRounds: cc.Node[] = [];
    @property([cc.Node])
    warTitles: cc.Node[] = [];
    @property(cc.Label)
    lblTotalStars: cc.Label = null;
    @property(cc.Node)
    WarSelectionNormal: cc.Node = null;
    @property(cc.Node)
    WarSelectionHard: cc.Node = null;
    @property(cc.Node)
    WarSelectionVeryHard: cc.Node = null;
    @property(cc.Node)
    WarSelectionArrow: cc.Node = null;
    @property(cc.Node)
    txtDisableHard: cc.Node = null;
    @property(cc.Node)
    txtDisableVeryHard: cc.Node = null;

    //private
    gameConfig: GameConfig = null;
    roundOrder: number = 0;
    lastFocusRoundOrder: number = 0;
    lastFocusHard = 0;
    totalStars: number = 0;
    trans: MM_Transition = null;
    bundleData = {
        SceenID: "MM_03_03_01",
        BattleID: -1,
    };
    clearLv1: boolean = false;
    clearLv2: boolean = false;
    clearLv3: boolean = false;

    onLoad() {
        this.trans = new MM_Transition();
        this.gameConfig = new GameConfig();
        this.gameConfig.Load();

        this.btnConfirm.node.on('click', this.onClick_Confirm, this);
        this.btnLeave.node.on('click', this.onClick_Leave, this);
        this.WarSelection.on('click', this.onClick_WarSelection, this);
        this.WarSelectionNormal.on('click', this.onClick_Confirm, this);
        this.WarSelectionHard.on('click', this.onClick_Confirm, this);
        this.WarSelectionVeryHard.on('click', this.onClick_Confirm, this);

        this.WarSelectionNormal.on('mouseenter', () => { this.onMouseEnter_WarSelection(this.WarSelectionNormal) }, this);
        this.WarSelectionHard.on('mouseenter', () => { this.onMouseEnter_WarSelection(this.WarSelectionHard) }, this);
        this.WarSelectionVeryHard.on('mouseenter', () => { this.onMouseEnter_WarSelection(this.WarSelectionVeryHard) }, this);

        this.NodeRoundNumTip.active = false;
        this.WarSelection.active = false;

        this.LoadMapInfo();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.targetOff(this);
    }

    onKeyUp(event: any) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                if (this.WarSelection.active) {
                    this.WarSelection.active = false;
                } else {
                    this.trans.reqBack();
                }
                break;
        }
    }

    LoadMapInfo() {
        // registor btnRounds event
        this.CalTotalStars();// 計算總星星數要重新設計

        for (let i = 0; i < this.warRounds.length; i++) {
            const element = this.warRounds[i];
            //應該讀檔 先做假的
            const toggle = element.getComponentInChildren(cc.Toggle);
            if (i == 0) {
                toggle.isChecked = true;
            } else {
                let index = i * 3 - 1;
                let enable = this.gameConfig.warRound[index];
                toggle.isChecked = enable == 1 ? true : false;//戰場成績 0:沒贏 1:贏了 -1:戰鬥中
            }
            element.on('mouseenter', (event) => {
                this.onMouseEnter_Round(element, i);

            });
            element.on('mouseenter', (event) => {
                this.onMouseEnter_Round(element, i);

            });
            element.on('mouseleave', (event) => {
                this.onMouseLeave_Round(element, i);
            });
            element.on('click', (target: cc.Button) => {
                this.onClick_Round(target, i);
            }, this);

        }
        this.lblTotalStars.string = this.totalStars.toString();

        //剛進畫面 選取最新一關 應該讀檔先做假的
        const round = 0;
        const target = this.warRounds[round];
        this.onSetSelect_Round(target, round);
    }

    onClick_Confirm(btn) {
        cc.log("onClick_Confirm");
        if (this.WarSelection.active) {
            this.bundleData.BattleID = this.lastFocusRoundOrder * 3 + this.lastFocusHard;
            if (btn.node == this.WarSelectionHard && !this.clearLv1) {
                return;
            } else if (btn.node == this.WarSelectionVeryHard && !this.clearLv2) {
                return;
            }
            this.trans.setBundle(this.bundleData);
            this.trans.reqForward("MM_03_03_02");
        } else {
            const target = this.warRounds[this.lastFocusRoundOrder].getComponent(cc.Button);
            this.onClick_Round(target, this.lastFocusRoundOrder);
        }
    }

    onClick_Leave() {
        cc.log("onClick_Leave");
        this.trans.reqBack();
    }

    onMouseEnter_WarSelection(target: cc.Node) {
        cc.log("onMouseEnter_WarSelection");
        if (this.WarSelectionNormal == target) {
            this.lastFocusHard = 0;
        } else if (this.WarSelectionHard == target) {
            if (!this.clearLv1) return;
            this.lastFocusHard = 1;
        } else {
            if (!this.clearLv2) return;
            this.lastFocusHard = 2;
        }
        this.WarSelectionArrow.y = target.y;
    }

    onClick_WarSelection() {
        cc.log("onClick_WarSelection");
        this.WarSelection.active = false;
    }

    // onClick_WarSelectionNormal() {
    //     cc.log("onClick_WarSelectionNormal");
    //     this.trans.reqForward("MM_03_03_02");
    // }

    // onClick_WarSelectionHard() {
    //     cc.log("onClick_WarSelectionHard");
    //     this.trans.reqForward("MM_03_03_02");

    // }

    // onClick_WarSelectionVeryHard() {
    //     cc.log("onClick_WarSelectionVeryHard");
    //     this.trans.reqForward("MM_03_03_02");

    // }

    onSetSelect_Round(target: cc.Node, round: number) {
        // hide
        this.warTitles[this.lastFocusRoundOrder].active = false;

        //show
        this.setNodeRoundOrder(round);
        this.warTitles[round].active = true;
        this.lastFocusRoundOrder = round;

        this.AniFocus.x = target.x;
        this.AniFocus.y = target.y - target.getContentSize().height * 0.7;
    }
    onMouseEnter_Round(target: cc.Node, round: number) {
        // cc.log("onMouseEnter_Round " + target.name);
        const toggle = target.getComponentInChildren(cc.Toggle);
        if (!toggle.isChecked) return;
        this.warTitles[round].active = true;
    }

    onMouseLeave_Round(target: cc.Node, round: number) {
        // cc.log("onMouseLeave_Round " + target.name);
        const toggle = target.getComponentInChildren(cc.Toggle);
        if (!toggle.isChecked) return;
        if (this.lastFocusRoundOrder != round)
            this.warTitles[round].active = false;
    }

    onClick_Round(target: cc.Button, round: number) {
        cc.log("onClick_Round_" + target.name);
        const toggle = target.getComponentInChildren(cc.Toggle);
        if (!toggle.isChecked) return;
        if (target.node == this.warRounds[16]) { //通天塔
            MessageDialog.showMsg_1btn(this.node, "通天塔尚未實裝", null);
            return;
        }
        this.onSetSelect_Round(target.node, round);
        this.WarSelection.active = true;
        let index = round * 3;
        this.clearLv1 = this.gameConfig.warRound[index] == 1 ? true : false;
        this.clearLv2 = this.gameConfig.warRound[index + 1] == 1 ? true : false;
        this.clearLv3 = this.gameConfig.warRound[index + 2] == 1 ? true : false;
        this.txtDisableHard.active = !this.clearLv1;
        this.txtDisableVeryHard.active = !this.clearLv2;
    }


    setNodeRoundOrder(num: number) {
        this.roundOrder = num + 1;
        this.lblRoundOrder.string = this.roundOrder.toString();
        this.NodeRoundNumTip.active = true;
    }


    CalTotalStars() {
        //計算重新計劃
    }

}
