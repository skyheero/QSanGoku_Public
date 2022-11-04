
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChargeSelection extends cc.Component {

    @property(cc.Node)
    Unselected: cc.Node = null;

    @property(cc.Node)
    Selected: cc.Node = null;

    @property
    isFocus: boolean = true;

    onLoad() {
        this.flash();
    }

    flash() {
        this.Selected.active = false;
        this.Unselected.active = false;
        if (this.isFocus) {
            this.Selected.active = true;
        } else {
            this.Unselected.active = true;
        }
    }

    setFocus(isFocus: boolean) {
        this.isFocus = isFocus;
    }
}
