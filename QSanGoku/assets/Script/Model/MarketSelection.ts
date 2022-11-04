
const { ccclass, property } = cc._decorator;

@ccclass
export default class MarketSelection extends cc.Component {
    @property(cc.Node)
    Unselected: cc.Node = null;
    @property(cc.Node)
    Selected: cc.Node = null;
    @property
    isFocus: boolean = true;
    @property(cc.Integer)
    ItemID: number = 0;
    @property(cc.Integer)
    Qty: number = 12;
    @property(cc.Boolean)
    isShowQty: boolean = true;
    @property(cc.Node)
    NodeQty: cc.Node = null;
    @property(cc.Label)
    labQty: cc.Label = null;
    @property(cc.Sprite)
    SprItem: cc.Sprite = null;
    @property(cc.SpriteFrame)
    box: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sorghum: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    dukang: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    diamond: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upPower: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upCON: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upSTR: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upAGI: cc.SpriteFrame = null;

    //private
    objAni: cc.Animation = null;

    onLoad() {
        this.objAni = this.getComponent("cc.Animation");
        this.flash();
    }

    flash() {
        let clips = this.objAni.getClips();
        if (this.isFocus) {
            this.objAni.play(clips[0].name);
        } else {
            this.objAni.stop();
            this.Selected.active = false;

        }
        this.labQty.string = "" + this.Qty;
        this.NodeQty.active = this.isShowQty;
        switch (this.ItemID) {
            case 0:
                this.SprItem.spriteFrame = this.box;
                break;
            case 1:
                this.SprItem.spriteFrame = this.diamond;
                break;
            case 2:
                this.SprItem.spriteFrame = this.sorghum;
                break;
            case 3:
                this.SprItem.spriteFrame = this.dukang;
                break;
            case 4:
                this.SprItem.spriteFrame = this.upPower;
                break;
            case 5:
                this.SprItem.spriteFrame = this.upCON;
                break;
            case 6:
                this.SprItem.spriteFrame = this.upSTR;
                break;
            case 7:
                this.SprItem.spriteFrame = this.upAGI;
                break;
            default:
                this.SprItem.spriteFrame = null;
                break;
        }
    }

    setFocus(isFocus: boolean) {
        this.isFocus = isFocus;
    }


}
