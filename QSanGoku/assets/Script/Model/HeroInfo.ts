import HeroInfoBase from "./HeroInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeroInfo extends cc.Component {

    @property(cc.Node)
    NodeRole: cc.Node = null;

    @property(cc.Prefab)
    PrefabLvBu: cc.Prefab = null;
    @property(cc.Prefab)
    PrefabZhangJiao: cc.Prefab = null;

    @property(cc.Label)
    lableHP: cc.Label = null;
    @property(cc.Label)
    lableATK: cc.Label = null;
    @property(cc.Label)
    lableAVD: cc.Label = null;
    @property(cc.Label)
    lableCRI: cc.Label = null;
    @property(cc.Label)
    lableLV: cc.Label = null;
    @property(cc.Label)
    lableCON: cc.Label = null;
    @property(cc.Label)
    lableSTR: cc.Label = null;
    @property(cc.Label)
    lableAGI: cc.Label = null;
    @property(cc.Label)
    lableName: cc.Label = null;
    @property(cc.Boolean)
    isNameDefault: Boolean = true;

    @property(cc.Label)
    lableExp: cc.Label = null;
    @property(cc.Node)
    nodeExpBg: cc.Node = null;
    @property(cc.Node)
    nodeExpRate: cc.Node = null;

    @property(cc.Node)
    nodeStar1: cc.Node = null;
    @property(cc.Node)
    nodeStar2: cc.Node = null;
    @property(cc.Node)
    nodeStar3: cc.Node = null;
    @property(cc.Node)
    nodeStar4: cc.Node = null;
    @property(cc.Node)
    nodeStar5: cc.Node = null;
    @property(cc.Node)
    nodeInfantry: cc.Node = null;
    @property(cc.Node)
    nodeArcher: cc.Node = null;
    @property(cc.Node)
    nodeWizard: cc.Node = null;
    @property(cc.Node)
    nodeCavalryman: cc.Node = null;
    @property(cc.Node)
    nodeSpearman: cc.Node = null;

    heroBase: HeroInfoBase = null

    onLoad() {
        this.NodeRole.on('click', this.onClick_NodeRole, this);
        if (this.heroBase)
            this.updateData();
    }
    setHeroInfo(info: HeroInfoBase) {
        this.heroBase = HeroInfoBase.newHeroInfoBase(info);
    }
    updateData() {
        // cc.log("onLoad");
        this.lableHP.string = Math.round(this.heroBase.HP) + "";
        this.lableATK.string = Math.round(this.heroBase.ATK) + "";
        this.lableAVD.string = Math.round(this.heroBase.AVD * 100) + "%";
        this.lableCRI.string = Math.round(this.heroBase.CRI * 100) + "%";
        if (this.lableLV != null) this.lableLV.string = this.heroBase.Lv + "";
        //this.lableLV.string = this.Lv + "";
        this.lableCON.string = Math.floor(this.heroBase.CON) + "";
        this.lableSTR.string = Math.floor(this.heroBase.STR) + "";
        this.lableAGI.string = Math.floor(this.heroBase.AGI) + "";
        if (this.lableExp != null) this.lableExp.string = this.heroBase.Exp + "/" + this.heroBase.NextExp;
        //this.lableExp.string = this.Exp + "/" + this.NextExp;
        if (this.nodeExpRate != null) this.nodeExpRate.scaleX = this.heroBase.Exp / this.heroBase.NextExp;
        //this.nodeExpRate.scaleX = this.Exp / this.NextExp;

        if (!this.isNameDefault) {
            this.lableName.string = this.heroBase.Name;
        } else {
            var tmpName = "";
            for (let i = 0; i < this.heroBase.Name.length; i++) {
                tmpName = tmpName + this.heroBase.Name.substring(i, i + 1) + "\n";
            }
            this.lableName.string = tmpName;
        }

        //Start
        this.nodeStar1.active = false;
        this.nodeStar2.active = false;
        this.nodeStar3.active = false;
        this.nodeStar4.active = false;
        this.nodeStar5.active = false;
        if (this.heroBase.StartLv == 0) {
            this.nodeStar1.active = true;
        } else if (this.heroBase.StartLv == 1) {
            this.nodeStar2.active = true;
        } else if (this.heroBase.StartLv == 2) {
            this.nodeStar3.active = true;
        } else if (this.heroBase.StartLv == 3) {
            this.nodeStar4.active = true;
        } else if (this.heroBase.StartLv == 4) {
            this.nodeStar5.active = true;
        }

        //class
        this.nodeInfantry.active = false;
        this.nodeArcher.active = false;
        this.nodeWizard.active = false;
        this.nodeCavalryman.active = false;
        this.nodeSpearman.active = false;
        if (this.heroBase.Class == 1) {
            this.nodeInfantry.active = true;
        } else if (this.heroBase.Class == 4) {
            this.nodeArcher.active = true;
        } else if (this.heroBase.Class == 5) {
            this.nodeWizard.active = true;
        } else if (this.heroBase.Class == 3) {
            this.nodeCavalryman.active = true;
        } else if (this.heroBase.Class == 2) {
            this.nodeSpearman.active = true;
        }
        this.NodeRole.removeAllChildren();
        if (this.heroBase.ID % 2 == 0) {
            const prefab = cc.instantiate(this.PrefabLvBu);
            this.NodeRole.addChild(prefab);
        } else {
            const prefab = cc.instantiate(this.PrefabZhangJiao);
            this.NodeRole.addChild(prefab);
        }
    }

    onClick_NodeRole(btn) {
        cc.log("onClick_NodeRole " + btn);
        let objAni = this.NodeRole.getComponentInChildren("cc.Animation");
        let clips = objAni.getClips();
        for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            let aniStatus = objAni.getAnimationState(clip.name);
            if (clip == objAni.currentClip) {
                cc.log(clip.name + " isPlaying");
                if (i + 1 < clips.length) {
                    objAni.play(clips[i + 1].name)
                } else {
                    objAni.play(clips[0].name)
                }
                break;
            }
        }
    }
}
