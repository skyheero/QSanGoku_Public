import HeroInfoOrigin from "./HeroInfoOrigin";

const { ccclass, property } = cc._decorator;

export default class SolderInfoBase {
    Name: string = "小小兵";
    Class: number = 0;
    Lv: number = 0;
    Exp: number = 300;

    //設定好的 先寫到代碼裡 之後要改道設定檔
    BaseCON: number = 0;
    BaseSTR: number = 0;
    BaseAGI: number = 0;

    //下面用計算的 from base
    CON: number = 0;
    STR: number = 0;
    AGI: number = 0;
    //下面用計算的  from 上面
    HP: number = 0;
    ATK: number = 0;
    AVD: number = 0;
    CRI: number = 0;
    NextExp: number = 2000;

    //HeroDifficulty
    HD: number = 10;

    constructor(Class: number, Lv: number, Exp: number) {
        this.Class = Class;
        this.Lv = Lv;
        this.Exp = Exp;
        switch (this.Class) {
            case 0: this.setBaseData("步兵", 25, 20, 10); break;
            case 1: this.setBaseData("槍兵", 22, 22, 10); break;
            case 2: this.setBaseData("騎兵", 20, 25, 10); break;
            case 3: this.setBaseData("弓兵", 10, 15, 10); break;
            default: break;
        }
    }

    setBaseData(Name: string, BaseCON: number, BaseSTR: number, BaseAGI: number) {
        this.Name = Name;
        this.BaseCON = BaseCON;
        this.BaseSTR = BaseSTR;
        this.BaseAGI = BaseAGI;

        this.CON = this.param(this.BaseCON);
        this.STR = this.param(this.BaseSTR);
        this.AGI = this.param(this.BaseAGI);
        this.HP = this.paramHP(this.CON);
        this.ATK = this.paramATK(this.STR);;
        this.CRI = this.AVD = this.paramAVD_CRI(this.AGI);
        this.NextExp = 100 * (this.Lv * this.Lv + this.Lv);
    }

    vInit(base) {
        return (this.HD * base * 10) / 100;
    }

    param(base) {
        return this.vInit(base) * (9 + this.Lv) / 10
    }

    paramHP(CON: number) {
        return 20 * CON + 500;
    }
    paramATK(STR: number) {
        return STR * 2 + 50;
    }
    paramAVD_CRI(AGI: number) {
        var p = AGI / 1500;
        if (p > 1) p = 1;
        return p;
    }
}
