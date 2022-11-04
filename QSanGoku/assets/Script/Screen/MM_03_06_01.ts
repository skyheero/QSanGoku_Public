import MM_Transition from "../Screen/MM_Transition";
import GameConfig from "../Model/GameConfig";
import HeroInfo from "../Model/HeroInfo";
import HeroInfoBase from "../Model/HeroInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_06_01 extends cc.Component {

    @property(cc.Button)
    BtnAddSorghum: cc.Button = null;
    @property(cc.Button)
    BtnAddDukang: cc.Button = null;

    @property(cc.Button)
    btnRecruitLeft: cc.Button = null;
    @property(cc.Button)
    btnRecruitRight: cc.Button = null;
    @property(cc.Button)
    btnSorghum: cc.Button = null;
    @property(cc.Button)
    btnDukang: cc.Button = null;
    @property(cc.Button)
    btnLeave: cc.Button = null;
    @property(cc.Node)
    NodeLeftHero: cc.Node = null;
    @property(cc.Node)
    NodeRightHero: cc.Node = null;
    conLeftHeroInfo: HeroInfo = null;
    conRightHeroInfo: HeroInfo = null;
    @property(cc.Label)
    lblSorghum: cc.Label = null;
    @property(cc.Label)
    lblDukang: cc.Label = null;

    //private
    gameConfig: GameConfig = null;
    tavernLeftHero: HeroInfoBase = null;
    tavernRightHero: HeroInfoBase = null;

    onLoad() {
        this.gameConfig = new GameConfig();
        this.gameConfig.onLoad();

        this.BtnAddSorghum.node.on('click', this.onClick_BtnAddSorghum, this);
        this.BtnAddDukang.node.on('click', this.onClick_BtnAddDukang, this);
        this.btnRecruitLeft.node.on('click', this.onClick_btnRecruitLeft, this);
        this.btnRecruitRight.node.on('click', this.onClick_btnRecruitRight, this);
        this.btnSorghum.node.on('click', this.onClick_btnSorghum, this);
        this.btnDukang.node.on('click', this.onClick_btnDukang, this);
        this.btnLeave.node.on('click', this.onClick_btnLeave, this);


        this.lblSorghum.string = '0';
        this.lblDukang.string = '0';
        if (this.gameConfig.Items[2] != undefined && this.gameConfig.Items[2] >= 0) {
            this.lblSorghum.string = this.gameConfig.Items[2].toString();
        }
        if (this.gameConfig.Items[3] != undefined && this.gameConfig.Items[3] >= 0) {
            this.lblDukang.string = this.gameConfig.Items[3].toString();
        }
        this.conLeftHeroInfo = this.NodeLeftHero.getComponent("HeroInfo");
        this.conRightHeroInfo = this.NodeRightHero.getComponent("HeroInfo");
        this.NodeLeftHero.active = false;
        this.btnRecruitLeft.node.active = false;
        this.NodeRightHero.active = false;
        this.btnRecruitRight.node.active = false;
        if (this.gameConfig.tavernLeftHero) {
            this.tavernLeftHero = HeroInfoBase.newHeroInfoBase(this.gameConfig.tavernLeftHero);
            this.conLeftHeroInfo.setHeroInfo(this.tavernLeftHero);
            this.conLeftHeroInfo.updateData();
            this.NodeLeftHero.active = true;
            this.btnRecruitLeft.node.active = true;
        }
        if (this.gameConfig.tavernRightHero) {
            this.tavernRightHero = HeroInfoBase.newHeroInfoBase(this.gameConfig.tavernRightHero);
            this.conRightHeroInfo.setHeroInfo(this.tavernRightHero);
            this.conRightHeroInfo.updateData();
            this.NodeRightHero.active = true;
            this.btnRecruitRight.node.active = true;
        }

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.targetOff(this);
    }

    onKeyUp(event: any) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                this.onClick_btnLeave(null);
                break;
        }
    }


    onClick_BtnAddSorghum(btn) {
        this.gameConfig.AddItemQty(2, 5);
        this.lblSorghum.string = "" + this.gameConfig.Items[2];
    }

    onClick_BtnAddDukang(btn) {
        this.gameConfig.AddItemQty(3, 5);
        this.lblDukang.string = "" + this.gameConfig.Items[3];
    }

    onClick_btnRecruitLeft(btn) {
        cc.log("onClick_btnRecruitLeft");
        this.Recruit(this.tavernLeftHero);
        this.tavernLeftHero = null;
        this.NodeLeftHero.active = false;
        this.btnRecruitLeft.node.active = false;
        this.gameConfig.SetTavernHero(this.tavernLeftHero, this.tavernRightHero);
    }

    onClick_btnRecruitRight(btn) {
        cc.log("onClick_btnRecruitRight");
        this.Recruit(this.tavernRightHero);
        this.tavernRightHero = null;
        this.NodeRightHero.active = false;
        this.btnRecruitRight.node.active = false;
        this.gameConfig.SetTavernHero(this.tavernLeftHero, this.tavernRightHero);
    }

    onClick_btnSorghum(btn) {
        cc.log("onClick_btnSorghum");
        let maxStar = 3;
        if (this.gameConfig.Items[2] > 0) {
            this.gameConfig.ReduceItemQty(2, 1);
            this.lblSorghum.string = "" + this.gameConfig.Items[2];

            this.tavernLeftHero = this.ProduceRandomHero(maxStar);
            do {
                this.tavernRightHero = this.ProduceRandomHero(maxStar);
            } while (this.tavernRightHero.ID == this.tavernLeftHero.ID);
            this.UpdateBothHeroWin();
        }
        this.gameConfig.SetTavernHero(this.tavernLeftHero, this.tavernRightHero);
    }

    onClick_btnDukang(btn) {
        cc.log("onClick_btnDukang");
        let maxStar = 5;
        if (this.gameConfig.Items[3] > 0) {
            this.gameConfig.ReduceItemQty(3, 1);
            this.lblDukang.string = "" + this.gameConfig.Items[3];

            this.tavernLeftHero = this.ProduceRandomHero(maxStar);
            do {
                this.tavernRightHero = this.ProduceRandomHero(maxStar);
            } while (this.tavernRightHero.ID == this.tavernLeftHero.ID);
            this.UpdateBothHeroWin();
        }
        this.gameConfig.SetTavernHero(this.tavernLeftHero, this.tavernRightHero);
    }

    onClick_btnLeave(btn) {
        cc.log("onClick_btnLeave");
        let trans = new MM_Transition();
        trans.reqBack();
    }

    ProduceRandomHero(maxStar: number) {
        var heroID = Math.floor(Math.random() * 28);            // ID 0~27
        var heroStar;
        if (maxStar > 5) maxStar = 5;
        if (maxStar > 3) {
            heroStar = Math.floor((Math.random() * 3)) + 2;     // Star 3~5
        } else {
            heroStar = Math.floor((Math.random() * maxStar));    // Star 1~3
        }
        var heroLv = 1;
        var heroExp = 0;
        var randomHero = new HeroInfoBase(heroID, heroStar, heroLv, heroExp);
        return randomHero;
    }

    UpdateBothHeroWin() {
        this.conLeftHeroInfo.setHeroInfo(this.tavernLeftHero);
        this.conLeftHeroInfo.updateData();
        this.NodeLeftHero.active = true;
        this.btnRecruitLeft.node.active = true;

        this.conRightHeroInfo.setHeroInfo(this.tavernRightHero);
        this.conRightHeroInfo.updateData();
        this.NodeRightHero.active = true;
        this.btnRecruitRight.node.active = true;
    }

    Recruit(role: HeroInfoBase) {
        var isRecruitSuccess;
        this.gameConfig.Load(); // fresh
        isRecruitSuccess = this.gameConfig.AddHero(role, false);
        if (isRecruitSuccess) {
            cc.log("Recruit Success!!");
        } else {
            cc.log("Already has same hero.");
            this.gameConfig.AddHero(role, true);
        }
        this.gameConfig.SaveHeros();
    }
}
