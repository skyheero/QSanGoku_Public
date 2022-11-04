import GameConfig from "./GameConfig";
import SolderInfoBase from "./SolderInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BarracksInfo extends cc.Component {

    @property(cc.ProgressBar)
    progressExp: cc.ProgressBar = null;
    @property(cc.Label)
    labLV: cc.Label = null;
    @property(cc.Label)
    labExp: cc.Label = null;
    @property(cc.Label)
    labHP: cc.Label = null;
    @property(cc.Label)
    labATK: cc.Label = null;
    @property(cc.Label)
    labAVD: cc.Label = null;
    @property(cc.Label)
    labCRI: cc.Label = null;
    @property(cc.Node)
    imgLv: cc.Node = null;
    @property(cc.Sprite)
    imgSoldierType: cc.Sprite = null;
    @property
    txtLv: number = 0;
    @property
    soldierID: number = 0;
    // 0 步兵  
    // 1 槍兵  
    // 2 騎兵  
    // 3 弓兵  

    @property(cc.SpriteFrame)
    Infantry: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    Spearman: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    Cavalryman: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    Archer: cc.SpriteFrame = null;

    //private
    gameConfig: GameConfig = null;
    lastWidthlabLV = 0;

    onLoad() {
        this.gameConfig = new GameConfig();
        this.gameConfig.Load();
        this.flash();
    }

    update(dt) {
        let nowWidthlabLV = this.labLV.node.width;
        if (nowWidthlabLV != this.lastWidthlabLV) {
            this.lastWidthlabLV = nowWidthlabLV;
            this.imgLv.x = nowWidthlabLV;
        }
    }

    flash() {
        switch (this.soldierID) {
            case 0:
                this.imgSoldierType.spriteFrame = this.Infantry;
                break;
            case 1:
                this.imgSoldierType.spriteFrame = this.Spearman;
                break;
            case 2:
                this.imgSoldierType.spriteFrame = this.Cavalryman;
                break;
            case 3:
                this.imgSoldierType.spriteFrame = this.Archer;
                break;
            default:
                break;
        }
        this.txtLv = this.gameConfig.getSoldierLv(this.soldierID);
        var Exp = this.gameConfig.getSoldierExp(this.soldierID);
        var soldier = new SolderInfoBase(this.soldierID, this.txtLv, Exp);
        var maxExp = soldier.NextExp;
        this.labExp.string = Exp + "/" + maxExp;
        this.progressExp.progress = Exp / maxExp;
        this.labLV.string = "" + this.txtLv;
        this.labHP.string = "" + soldier.HP;
        this.labATK.string = "" + soldier.ATK;
        this.labAVD.string = "" + Math.round(soldier.AVD * 100) + "%";
        this.labCRI.string = "" + Math.round(soldier.CRI * 100) + "%";
    }
}
