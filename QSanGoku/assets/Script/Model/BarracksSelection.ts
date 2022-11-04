

const { ccclass, property } = cc._decorator;

@ccclass
export default class BarracksSelection extends cc.Component {
    @property(cc.Node)
    LeftUnselected: cc.Node = null;
    @property(cc.Node)
    LeftSelected: cc.Node = null;
    @property(cc.Node)
    RightUnselected: cc.Node = null;
    @property(cc.Node)
    RightSelected: cc.Node = null;
    @property
    isFocus: boolean = true;

    //private
    objAni: cc.Animation = null;
    onClick_LeftUnselectedPlus: any = null;
    onClick_RightUnselectedPlus: any = null;

    onLoad() {
        this.objAni = this.getComponent("cc.Animation");
        this.LeftUnselected.on("click", this.onClick_LeftUnselected, this);
        this.RightUnselected.on("click", this.onClick_RightUnselected, this);

        this.flash();
    }

    flash() {
        let clips = this.objAni.getClips();
        if (this.isFocus) {
            this.objAni.play(clips[0].name);
            this.RightSelected.active = true;
        } else {
            this.objAni.stop();
            this.LeftSelected.active = false;
            this.RightSelected.active = false;
        }
    }

    setFocus(isFocus: boolean) {
        this.isFocus = isFocus;
    }

    setOnClick_LeftUnselected(fn) {
        this.onClick_LeftUnselectedPlus = fn;
    }

    setOnClick_RightUnselected(fn) {
        this.onClick_RightUnselectedPlus = fn;
    }

    onClick_LeftUnselected(btn) {
        this.setFocus(true);
        if (this.onClick_LeftUnselectedPlus) this.onClick_LeftUnselectedPlus(btn);
    }
    onClick_RightUnselected(btn) {
        this.setFocus(true);
        if (this.onClick_RightUnselectedPlus) this.onClick_RightUnselectedPlus(btn);
    }

}
