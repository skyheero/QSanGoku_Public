
const { ccclass, property } = cc._decorator;

@ccclass
export default class MilitarySkill extends cc.Component {
    @property(cc.Node)
    NodeOff: cc.Node = null;
    @property(cc.Node)
    StarOff: cc.Node = null;
    @property
    isOn: boolean = true;

    //private

    onLoad() {
        this.flash();
    }

    flash() {
        this.NodeOff.active = !this.isOn;
        this.StarOff.active = !this.isOn;
    }

    setOn(isOn: boolean) {
        this.isOn = isOn;
    }


}
