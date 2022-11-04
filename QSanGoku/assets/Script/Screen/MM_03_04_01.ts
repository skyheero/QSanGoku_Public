import HeroInfoBase from "../Model/HeroInfoBase";
import HeroInfo from "../Model/HeroInfo";
import HeroSelect from "../Model/HeroSelect";
import MM_Transition from "./MM_Transition";
import GameConfig from "../Model/GameConfig";
import GeneralBG from "../Model/GeneralBG";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_04_01 extends cc.Component {
    @property(cc.Node)
    NodeGeneralBG: cc.Node = null;
    @property(cc.Node)
    NodeHeroSelect: cc.Node = null;
    @property(cc.Node)
    NodeHeroInfo: cc.Node = null;
    @property(cc.Button)
    btnPowerful: cc.Button = null;
    @property(cc.Button)
    btnLvUp: cc.Button = null;
    @property(cc.Button)
    btnFusion: cc.Button = null;
    @property(cc.Button)
    btnJewelUpgrade: cc.Button = null;
    @property(cc.Button)
    btnCancel: cc.Button = null;

    //private
    gameConfig: GameConfig = null;
    conHeroSelect: HeroSelect = null;
    conHeroInfo: HeroInfo = null;
    trans:MM_Transition = null;
    

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("tag", "message", "333");
        cc.log("onLoad");
        this.trans = new MM_Transition();
        this.NodeGeneralBG.getComponent(GeneralBG).isShowSelection = false;
        this.btnPowerful.node.on('click', this.onClick_btnPowerful, this);
        this.btnLvUp.node.on('click', this.onClick_btnLvUp, this);
        this.btnFusion.node.on('click', this.onClick_btnFusion, this);
        this.btnJewelUpgrade.node.on('click', this.onClick_btnJewelUpgrade, this);
        this.btnCancel.node.on('click', this.onClick_btnCancel, this);

        this.conHeroSelect = this.NodeHeroSelect.getComponent("HeroSelect");
        this.conHeroInfo = this.NodeHeroInfo.getComponent("HeroInfo");

        
        this.gameConfig = new GameConfig();
        this.gameConfig.Load();
        this.conHeroSelect.setOnClick_NodePortraitPlus((button: cc.Button, index: number) => { this.onClick_NodePortrait(button, index) });
        if(this.gameConfig.heros != undefined)
        {
            var heroQty = this.gameConfig.heros.length;
            for(let i = 0; i < heroQty; i++) {
                var fileHero = this.gameConfig.heros[i];
                var role = HeroInfoBase.newHeroInfoBase(fileHero);
                this.conHeroSelect.Heros.push(role);
            }
            if(heroQty > 0)
            {
                this.onClick_NodePortrait(null, 0);
            }
        }
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
 

    start() {
        cc.log("start");
    }

    onClick_btnPowerful(button) {
        cc.log("onClick_btnPowerful");
        this.trans.reqForward("MM_03_04_02");
    }
    onClick_btnLvUp(button) {
        cc.log("onClick_btnLvUp");
        //秀Ｍsg 消耗鑽石 升級
    }
    onClick_btnFusion(button) {
        cc.log("onClick_btnFusion");
        // 秀Msg 確定使用當前角色進行融合
        this.trans.reqForward("MM_03_04_03");
    }
    onClick_btnJewelUpgrade(button) {
        cc.log("onClick_btnJewelUpgrade");
        //秀Ｍsg 消耗物品提升屬性 
    }
    onClick_btnCancel(button) {
        cc.log("onClick_btnCancel");
        this.trans.reqBack();

    }
    onClick_NodePortrait(button: cc.Button, index: number) {
        cc.log("onClick_NodePortrait index=" + index);
        const hero = this.conHeroSelect.Heros[index];
        this.conHeroInfo.setHeroInfo(hero);
        this.conHeroInfo.updateData();
    }
    // update (dt) {}
}
