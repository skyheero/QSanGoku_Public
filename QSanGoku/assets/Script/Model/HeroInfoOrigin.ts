
const { ccclass, property } = cc._decorator;

@ccclass
export default class HeroInfoOrigin {
    ID: number = -1;
    StartLv: number = 0;  //0~4
    Lv: number = 0;
    Exp: number = 300;

    constructor(ID: number, StartLv: number, Lv: number, Exp: number) {
        this.ID = ID;
        this.StartLv = StartLv;
        this.Lv = Lv;
        this.Exp = Exp;
    }
}
