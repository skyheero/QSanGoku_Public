import MM_Transition from "./MM_Transition";
import GameConfig from "../Model/GameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_01_01_01 extends cc.Component {
    @property(cc.Node)
    NodeLaunch: cc.Node = null;

    @property(cc.Node)
    NodeMenu: cc.Node = null;

    @property
    showStartAni: boolean = false;

    @property(cc.Button)
    btnStart: cc.Button = null;
    @property(cc.Button)
    btnSetting: cc.Button = null;
    @property(cc.Button)
    btnHelp: cc.Button = null;
    @property(cc.Button)
    btnAbout: cc.Button = null;
    @property(cc.Button)
    btnRecharge: cc.Button = null;
    @property(cc.Button)
    btnShop: cc.Button = null;
    @property(cc.Button)
    btnMore: cc.Button = null;
    @property(cc.Button)
    btnLeave: cc.Button = null;

    trans:MM_Transition = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        // registor events
        this.trans = new MM_Transition();
        this.NodeLaunch.getComponent("cc.Button").node.on('click', this.onClick_Launch, this);
        this.btnStart.node.on('click', this.onClick_btnStart, this);
        this.btnSetting.node.on('click', this.onClick_btnSetting, this);
        this.btnHelp.node.on('click', this.onClick_btnHelp, this);
        this.btnAbout.node.on('click', this.onClick_btnAbout, this);
        this.btnRecharge.node.on('click', this.onClick_btnRecharge, this);
        this.btnShop.node.on('click', this.onClick_btnShop, this);
        this.btnMore.node.on('click', this.onClick_btnMore, this);
        this.btnLeave.node.on('click', this.onClick_btnLeave, this);
    }

    start(){
        if (!this.showStartAni) {
            this.NodeLaunch.active = false;
            this.NodeMenu.active = true;
        }
    }

    //----------------------------------------------------------
    onClick_Launch() {
        cc.log("onClick_Launch");
        this.showStartAni = true;
        let aniLaunch = this.NodeLaunch.getComponent(cc.Animation);
        aniLaunch.play('StartGame');
        aniLaunch.on('finished', this.onFinished_StartGame, this);
    }

    onFinished_StartGame(button) {
        cc.log("onFinished_StartGame");
        this.NodeLaunch.active = false;
        this.NodeMenu.active = true;
    }

    onFinished_Menu() {
        cc.log("onFinished_Menu");
        this.NodeMenu.active = true;
    }

    onClick_btnStart(button) {
        cc.log("onClick_btnStart");
        const gameConfig = new GameConfig();
        gameConfig.Load();
        this.trans.reqForward("MM_02_01_01");
    }
    onClick_btnSetting(button) {
        cc.log("onClick_btnSetting");
        this.trans.reqForward("MM_08_03_01");
    }
    onClick_btnHelp(button) {
        cc.log("onClick_btnHelp");
        this.trans.reqForward("MM_08_02_01");
    }
    onClick_btnAbout(button) {
        cc.log("onClick_btnAbout");
        this.trans.reqForward("MM_08_05_01");

    }
    onClick_btnRecharge(button) {
        cc.log("onClick_btnRecharge");
        this.trans.reqForward("MM_08_01_01");
    }
    onClick_btnShop(button) {
        cc.log("onClick_btnShop");
        this.trans.reqForward("MM_08_04_01");
    }
    onClick_btnMore(button) {
        cc.log("onClick_btnMore");
    }
    onClick_btnLeave(button) {
        cc.log("onClick_btnLeave");
    }
}
