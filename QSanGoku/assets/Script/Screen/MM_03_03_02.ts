import MM_Transition from "./MM_Transition";
import GeneralBG from "../Model/GeneralBG";
import LevelConfig from "../Model/LevelConfig";
import HeroInfoBase from "../Model/HeroInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_03_02 extends cc.Component {
    @property(cc.Label)
    labBattleName: cc.Label = null;
    @property(cc.Label)
    labBattleHardLv: cc.Label = null;
    @property(cc.Label)
    labCondition: cc.Label = null;
    @property(cc.Label)
    labEnemyName: cc.Label = null;
    @property(cc.Label)
    labSoldierType: cc.Label = null;

    @property(cc.Node)
    ImgEnemyHero: cc.Node = null;
    @property(cc.Node)
    ImgRecommend: cc.Node = null;

    @property(cc.Node)
    nodeEnemyInfantry: cc.Node = null;
    @property(cc.Node)
    nodeEnemyArcher: cc.Node = null;
    @property(cc.Node)
    nodeEnemyWizard: cc.Node = null;
    @property(cc.Node)
    nodeEnemyCavalryman: cc.Node = null;
    @property(cc.Node)
    nodeEnemySpearman: cc.Node = null;
    @property(cc.Node)
    nodeSupportInfantry: cc.Node = null;
    @property(cc.Node)
    nodeSupportArcher: cc.Node = null;
    @property(cc.Node)
    nodeSupportWizard: cc.Node = null;
    @property(cc.Node)
    nodeSupportCavalryman: cc.Node = null;
    @property(cc.Node)
    nodeSupportSpearman: cc.Node = null;
    @property(GeneralBG)
    GeneralBG: GeneralBG = null;
    //private
    trans: MM_Transition = null;
    bundleData = null;

    onLoad() {
        this.GeneralBG.setOnClick_BtnConfirm(() => { this.onClick_BtnConfirm() });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.trans = new MM_Transition();
        this.bundleData = this.trans.getBundle();
        if (this.bundleData == null) {
            this.bundleData = {
                SceenID: "MM_03_03_02",
                BattleID: 0,
            };
        }
        cc.log('MM_03_03_02 onLoad ' + JSON.stringify(this.trans.bundleData));
        this.labBattleName.string = "null";
        this.labBattleHardLv.string = "null";
        this.labEnemyName.string = "null";
        this.labSoldierType.string = "null";
        this.ImgEnemyHero.active = false;
        this.ImgRecommend.active = true;
        this.nodeEnemyInfantry.active = false;
        this.nodeEnemyArcher.active = false;
        this.nodeEnemyWizard.active = false;
        this.nodeEnemyCavalryman.active = false;
        this.nodeEnemySpearman.active = false;
        this.nodeSupportInfantry.active = false;
        this.nodeSupportArcher.active = false;
        this.nodeSupportWizard.active = false;
        this.nodeSupportCavalryman.active = false;
        this.nodeSupportSpearman.active = false;

        let battle = LevelConfig.getBattle(this.bundleData.BattleID);
        if (!battle) return;
        this.labBattleName.string = battle.Name;
        switch (battle.Hard) {
            case 0:
                this.labBattleHardLv.string = "普通";
                break;
            case 1:
                this.labBattleHardLv.string = "困難";
                break;
            case 2:
                this.labBattleHardLv.string = "惡夢";
                break;
        }
        var battleCondition = "殺死敵方" + battle.KillSoldiers + "個小兵";
        var enemy = HeroInfoBase.newHeroInfoBase(battle.EnemyHeroID, StartLv, Lv, Exp);
        if (battle.EnemyHeroID != -1) {
            battleCondition = "殺死敵方將領";
            var StartLv = 0;
            var Lv = 0;
            var Exp = 0;
            this.labEnemyName.string = enemy.Name;
            this.ImgEnemyHero.active = true;
        }
        if (battle.EnemyHomeHP != -1) {
            battleCondition += "並摧毀敵方軍營";
        }
        switch (enemy.Class) {
            case 1://步兵
                this.nodeEnemyInfantry.active = true;
                break;
            case 2://槍兵
                this.nodeEnemySpearman.active = true;
                break;
            case 3://騎兵
                this.nodeEnemyCavalryman.active = true;
                break;
            case 4://弓兵
                this.nodeEnemyArcher.active = true;
                break;
            case 5://謀士
                this.nodeEnemyWizard.active = true;
                break;
        }
        this.labCondition.string = battleCondition;
        switch (battle.SoldierType) {
            case "Avg":
                this.labSoldierType.string = "平均";
                this.ImgRecommend.active = false;
                break;
            case "Infantry":
                this.labSoldierType.string = "步兵";
                this.nodeSupportArcher.active = true;
                break;
            case "Spearman":
                this.labSoldierType.string = "槍兵";
                this.nodeSupportInfantry.active = true;
                break;
            case "Cavalryman":
                this.labSoldierType.string = "騎兵";
                this.nodeSupportSpearman.active = true;
                break;
            case "Archer":
                this.labSoldierType.string = "弓兵";
                this.nodeSupportCavalryman.active = true;
                break;
        }


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


    onClick_BtnConfirm() {
        cc.log('onClick_BtnConfirm');
        this.trans.reqForward("MM_03_03_03");
    }
}
