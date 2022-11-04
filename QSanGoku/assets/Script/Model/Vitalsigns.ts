import RoleBase from "./RoleBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Vitalsigns extends cc.Component {
    @property
    maxHP: number = 100;
    @property
    HP: number = 100;
    @property
    Damage: number = 10;

    progressBarHp: number = 100;
    isDead: boolean = false;
    onDeadPlus: any = null;

    update(dt) {
        this.updateHP();
    }

    setInitHP(hp: number) {
        this.maxHP = hp;
        this.HP = hp;
        this.progressBarHp = this.HP / this.maxHP;
    }

    setDamage(damage: number) {
        this.Damage = damage;
    }

    beHitBy(role: RoleBase, damage: number) {
        this.HP -= damage;
        this.progressBarHp = this.HP / this.maxHP;
        if (this.HP <= 0) {
            this.progressBarHp = 0;
            this.HP = 0;
            this.isDead = true;
            this.onDead()
        }
        return this.isDead;
    }

    setOnDead(onDeadPlus) {
        this.onDeadPlus = onDeadPlus;
    }

    onDead() {
        if (this.onDeadPlus) {
            this.onDeadPlus();
        }
    }

    updateHP() {
        const progressbar = this.node.getChildByName("HPProgressBar");
        if (progressbar) {
            const HPControl = progressbar.getComponent('HPControl');

            if (HPControl)
                HPControl.setProgress(this.progressBarHp);
        }

    }
    enrichBlood(){
        this.HP = this.maxHP;
        this.progressBarHp = this.HP / this.maxHP;
    }
}
