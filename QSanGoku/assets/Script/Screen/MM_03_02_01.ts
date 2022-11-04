import MM_Transition from "./MM_Transition";
import MilitarySkill from "../Model/MilitarySkill";
import GameConfig from "../Model/GameConfig";
import MessageDialog from "../Model/MessageDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_03_02_01 extends cc.Component {

    @property(cc.Label)
    labTotalStars: cc.Label = null;

    @property(cc.Label)
    labRemainStar: cc.Label = null;

    @property(cc.Node)
    btnReset: cc.Node = null;

    @property([MilitarySkill])
    skills: MilitarySkill[] = [];

    //private
    gamecfg: GameConfig = null;
    trans: MM_Transition = null;
    TotalStar: number = 0;
    UsedStar: number = 0;
    RemainStar: number = 0;



    onLoad() {
        this.trans = new MM_Transition();
        this.gamecfg = new GameConfig();
        this.gamecfg.Load();
        this.btnReset.on('click', () => { this.onClick_reset() }, this);
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            skill.node.on('click', () => { this.onClick_skills(i, skill) }, this);
        }
        this.flash();
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

    flash() {
        let warRounds = this.gamecfg.warRound;
        this.TotalStar = 0;
        for (let i = 0; i < warRounds.length; i++) {
            const warRound = warRounds[i];
            if (warRound <= 0) continue;
            this.TotalStar += warRound;
        }
        this.labTotalStars.string = "" + this.TotalStar;
        this.UsedStar = 0;
        for (let i = 0; i < this.skills.length; i++) {
            const skill = this.skills[i];
            let skillEnable = this.gamecfg.getMilitarySkill(i);
            skill.setOn(false);
            if (skillEnable > 0) {
                skill.setOn(true);
                var needStar = this.gamecfg.getStarCountOfSkill(i);
                this.UsedStar += needStar;
            }
            skill.flash();
        }
        this.RemainStar = this.TotalStar - this.UsedStar;
        this.labRemainStar.string = "" + this.RemainStar;

    }

    onClick_skills(index: number, target: MilitarySkill) {
        cc.log('onClick_skills ' + index + " " + target.node.name);
        if (target.isOn) return;
        if (index % 4 != 0 && !this.skills[index - 1].isOn) {
            MessageDialog.showMsg_1btn(this.node, "未達到條件，請先解鎖前置技能。", null);
            return;
        }
        var needStar = this.gamecfg.getStarCountOfSkill(index);
        if (this.RemainStar >= needStar)
            MessageDialog.showMsg_2btn(this.node, "確定要消耗" + needStar + "個評星升級？", () => { this.onClick_skills_Yes(index) }, null, null, null);
        else
            MessageDialog.showMsg_1btn(this.node, "評星不足", null);

    }

    onClick_skills_Yes(index: number) {
        cc.log('onClick_skills_Yes ' + index);
        this.gamecfg.setMilitarySkill(index, true);
        this.flash();
    }

    onClick_reset() {
        cc.log('onClick_reset ');
        if (this.gamecfg.piont >= 50)
            MessageDialog.showMsg_2btn(this.node, "確定要消耗50個愛豆洗點？", () => { this.onClick_reset_Yes() }, null, null, null);
        else {
            var msg = "點數不足是否充值"
            MessageDialog.showMsg_2btn(this.node, msg, () => { this.onClick_GotoCharge() }, null, null, null);
        }

    }

    onClick_reset_Yes() {
        cc.log('onClick_reset_Yes ');
        this.gamecfg.ReducePiontQty(50);
        for (let i = 0; i < this.skills.length; i++) {
            this.gamecfg.setMilitarySkill(i, false);
        }
        this.flash();
    }
    onClick_GotoCharge() {
        this.trans.reqForward("MM_08_01_01");
    }
}
