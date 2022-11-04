import MM_Transition from "./MM_Transition";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MM_02_01_01 extends cc.Component {

    @property(cc.Button)
    BtnCastle: cc.Button = null;
    @property(cc.Button)
    BtnMilitaryService: cc.Button = null;
    @property(cc.Button)
    BtnBattleMap: cc.Button = null;
    @property(cc.Button)
    BtnCommanderTent: cc.Button = null;
    @property(cc.Button)
    BtnBarracks: cc.Button = null;
    @property(cc.Button)
    BtnTavern: cc.Button = null;
    @property(cc.Button)
    BtnMarket: cc.Button = null;
    
    trans:MM_Transition = null;

    onLoad () {
        this.trans = new MM_Transition();
    	this.BtnMarket.node.on('click', this.onClick_btnMarket, this);
    	this.BtnTavern.node.on('click', this.onClick_btnTavern, this);
    	this.BtnBarracks.node.on('click', this.onClick_btnBarracks, this);
    	this.BtnCommanderTent.node.on('click', this.onClick_btnCommanderTent, this);
    	this.BtnBattleMap.node.on('click', this.onClick_btnBattleMap, this);
    	this.BtnMilitaryService.node.on('click', this.onClick_btnMilitaryService, this);
        this.BtnCastle.node.on('click', this.onClick_btnCastle, this);
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

    onClick_btnMarket() {
        cc.log('onClick_btnMarket clicked');
        this.trans.reqForward("MM_08_04_01");
    }

    onClick_btnTavern() {
        cc.log('onClick_btnTavern clicked');
        this.trans.reqForward("MM_03_06_01");
    }

    onClick_btnBarracks() {
        cc.log('onClick_btnBarracks clicked');
        this.trans.reqForward("MM_03_05_01");
    }

    onClick_btnCommanderTent() {
        cc.log('onClick_btnCommanderTent clicked');
        this.trans.reqForward("MM_03_04_01");
    }

    onClick_btnBattleMap() {
        cc.log('onClick_btnBattleMap clicked');
        this.trans.reqForward("MM_03_03_01");
    }

    onClick_btnMilitaryService() {
        cc.log('onClick_btnMilitaryService clicked');
        this.trans.reqForward("MM_03_02_01");
    }

    onClick_btnCastle() {
        cc.log('onClick_btnTaishou clicked');
        this.trans.reqForward("MM_03_01_01");
    }
}
