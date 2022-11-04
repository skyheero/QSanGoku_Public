import HeroInfoOrigin from "./HeroInfoOrigin";

const { ccclass, property } = cc._decorator;

export default class HeroInfoBase extends HeroInfoOrigin {

    Name: string = "不知火舞";
    Class: number = 0;

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

    /** !#en
    Title<br/>
    <br/>
    NOTE: ............
        ....
    !#zh
    標題<br/>
    <br/>
    注意：...... */
    static newHeroInfoBase(hOrg: HeroInfoOrigin) {
        var h = new HeroInfoBase(hOrg.ID, hOrg.StartLv, hOrg.Lv, hOrg.Exp);
        return h;
    }

    getOrigin(){
        var h = new HeroInfoOrigin(this.ID, this.StartLv, this.Lv, this.Exp);
        return h;
    }

    constructor(ID: number, StartLv: number, Lv: number, Exp: number) {
        super(ID,StartLv,Lv,Exp);
        switch (ID) {
            case 0: this.setBaseData("劉備", 1, 50, 45, 40); break;
            case 1: this.setBaseData("關羽", 3, 50, 60, 50); break;
            case 2: this.setBaseData("張飛", 2, 50, 50, 55); break;
            case 3: this.setBaseData("黃忠", 4, 30, 25, 60); break;
            case 4: this.setBaseData("諸葛亮", 5, 35, 30, 55); break;
            case 5: this.setBaseData("龐統", 5, 35, 30, 50); break;
            case 6: this.setBaseData("魏延", 3, 55, 70, 50); break;
            case 7: this.setBaseData("姜維", 2, 60, 60, 60); break;
            case 8: this.setBaseData("馬超", 3, 70, 75, 65); break;
            case 9: this.setBaseData("趙雲", 2, 70, 70, 70); break;
            case 10: this.setBaseData("張角", 5, 30, 30, 30); break;
            case 11: this.setBaseData("董卓", 1, 50, 50, 50); break;
            case 12: this.setBaseData("華雄", 3, 55, 70, 60); break;
            case 13: this.setBaseData("呂布", 2, 80, 80, 30); break;
            case 14: this.setBaseData("張遼", 3, 70, 75, 40); break;
            case 15: this.setBaseData("郭嘉", 5, 40, 50, 35); break;
            case 16: this.setBaseData("袁紹", 1, 60, 60, 50); break;
            case 17: this.setBaseData("許褚", 1, 80, 65, 70); break;
            case 18: this.setBaseData("張頜", 3, 75, 75, 50); break;
            case 19: this.setBaseData("曹仁", 3, 75, 75, 45); break;
            case 20: this.setBaseData("夏侯惇", 3, 80, 75, 40); break;
            case 21: this.setBaseData("曹操", 1, 70, 65, 60); break;
            case 22: this.setBaseData("夏侯淵", 2, 70, 65, 45); break;
            case 23: this.setBaseData("孟獲", 1, 80, 60, 50); break;
            case 24: this.setBaseData("陸遜", 5, 30, 35, 60); break;
            case 25: this.setBaseData("呂蒙", 1, 70, 60, 60); break;
            case 26: this.setBaseData("孫權", 5, 40, 40, 60); break;
            case 27: this.setBaseData("司馬懿", 5, 50, 40, 65); break;
            default: break;
        }
    }

    setBaseData(Name: string, Class: number, BaseCON: number, BaseSTR: number, BaseAGI: number) {
        this.Name = Name;
        this.Class = Class;
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
        return (this.HD * base * (8 + 2 * (this.StartLv + 1))) / 100;
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
