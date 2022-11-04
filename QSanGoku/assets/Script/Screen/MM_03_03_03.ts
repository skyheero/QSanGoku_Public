import MM_Transition from "./MM_Transition";
import GeneralBG from "../Model/GeneralBG";
import GameConfig from "../Model/GameConfig";
import HeroInfo from "../Model/HeroInfo";
import HeroSelect from "../Model/HeroSelect";
import HeroInfoBase from "../Model/HeroInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_03_03 extends cc.Component {

    @property(GeneralBG)
    GeneralBG: GeneralBG = null;
    @property(cc.Node)
    NodeHeroSelect: cc.Node = null;
    @property(cc.Node)
    NodeHeroInfo: cc.Node = null;


    //private
    trans: MM_Transition = null;
    bundleData = null;
    gameConfig: GameConfig = null;
    conHeroSelect: HeroSelect = null;
    conHeroInfo: HeroInfo = null;

    onLoad() {
        this.trans = new MM_Transition();
        this.bundleData = this.trans.getBundle();
        if (this.bundleData == null) {
            this.bundleData = {
                SceenID: "MM_03_03_03",
                BattleID: 0,
            };
        }
        cc.log('MM_03_03_03 onLoad ' + JSON.stringify(this.trans.bundleData));
        this.GeneralBG.setOnClick_BtnConfirm(() => { this.onClick_BtnConfirm() });

        this.conHeroSelect = this.NodeHeroSelect.getComponent("HeroSelect");
        this.conHeroInfo = this.NodeHeroInfo.getComponent("HeroInfo");
        this.gameConfig = new GameConfig();
        this.gameConfig.Load();
        this.conHeroSelect.setOnClick_NodePortraitPlus((button: cc.Button, index: number) => { this.onClick_NodePortrait(button, index) });
        if (this.gameConfig.heros != undefined) {
            var heroQty = this.gameConfig.heros.length;
            for (let i = 0; i < heroQty; i++) {
                var fileHero = this.gameConfig.heros[i];
                var role = HeroInfoBase.newHeroInfoBase(fileHero);
                this.conHeroSelect.Heros.push(role);
            }
            if (heroQty > 0) {
                this.onClick_NodePortrait(null, 0);
            } else {
                //fake
                var role = new HeroInfoBase(27, 3, 3, 33);//司馬懿 預設用它 為啥!?我爽
                this.conHeroSelect.Heros.push(role);
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
 

    onClick_BtnConfirm() {
        cc.log('onClick_BtnConfirm');
        this.trans.setBundle(this.bundleData);
        this.trans.reqForward("MM_05_01_01");
    }

    onClick_NodePortrait(button: cc.Button, index: number) {
        cc.log("onClick_NodePortrait index=" + index);
        const hero = this.conHeroSelect.Heros[index];
        this.bundleData.HeroID = hero.ID;
        this.conHeroInfo.setHeroInfo(hero);
        this.conHeroInfo.updateData();
    }
}
