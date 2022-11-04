
const { ccclass, property } = cc._decorator;

@ccclass
export default class MessageDialog extends cc.Component {
    @property(cc.String)
    msg: string = "";
    @property(cc.Integer)
    ItemID: number = 0;
    @property(cc.Integer)
    ItemCount: number = 0;
    @property
    isShowItem: boolean = true;
    @property
    isShowContinue: boolean = true;
    @property(cc.Node)
    btnYes: cc.Node = null;
    @property(cc.Node)
    btnNo: cc.Node = null;
    @property(cc.Node)
    btnCountinue: cc.Node = null;
    @property(cc.Node)
    NodeItem: cc.Node = null;
    @property(cc.Sprite)
    imgItem: cc.Sprite = null;
    @property(cc.Label)
    labItemCount: cc.Label = null;
    @property(cc.Label)
    labMessage: cc.Label = null;
    @property(cc.SpriteFrame)
    box: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    diamond: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sorghum: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    dukang: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upPower: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upCON: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upSTR: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    upAGI: cc.SpriteFrame = null;

    onClick_BtnYesPlus: any = null;
    onClick_BtnNoPlus: any = null;
    onClick_BtnCountinuePlus: any = null;

    static showMsg_1btn(from: cc.Node, msg: string, onClick_Continue) {
        cc.loader.loadRes("MessageDialog", (err, prefab: cc.Prefab) => {
            var newNode = cc.instantiate(prefab);
            var msgDialog = newNode.getComponent(MessageDialog);
            msgDialog.msg = msg;
            msgDialog.setOnClick_BtnContinue(onClick_Continue);
            msgDialog.isShowItem = false;
            msgDialog.isShowContinue = true;
            from.addChild(newNode);
        });

    }

    static showMsg_2btn(from: cc.Node, msg: string, onClick_Yes, onClick_No, ItemID, ItemCount) {
        cc.loader.loadRes("MessageDialog", (err, prefab: cc.Prefab) => {
            var newNode = cc.instantiate(prefab);
            var msgDialog = newNode.getComponent(MessageDialog);
            msgDialog.msg = msg;
            msgDialog.setOnClick_BtnYes(onClick_Yes);
            msgDialog.setOnClick_BtnNo(onClick_No);
            msgDialog.isShowContinue = false;
            msgDialog.isShowItem = false;
            if (ItemID && ItemCount) {
                msgDialog.isShowItem = true;
                msgDialog.ItemID = ItemID;
                msgDialog.ItemCount = ItemCount;
            }
            from.addChild(newNode);
        });

    }

    onLoad() {
        this.btnCountinue.on("click",this.onClick_BtnContinue,this);
        this.btnYes.on("click",this.onClick_BtnYes,this);
        this.btnNo.on("click",this.onClick_BtnNo,this);
        this.flash();
    }

    flash() {
        this.btnYes.active = false;
        this.btnNo.active = false;
        this.btnCountinue.active = false;
        if (this.isShowContinue) {
            this.btnCountinue.active = true;
        } else {
            this.btnYes.active = true;
            this.btnNo.active = true;
        }
        this.labMessage.string = this.msg;
        this.NodeItem.active = this.isShowItem;
        this.labItemCount.string = "" + this.ItemCount;
        switch (this.ItemID) {
            case 0:
                this.imgItem.spriteFrame = this.box;
                break;
            case 1:
                this.imgItem.spriteFrame = this.diamond;
                break;
            case 2:
                this.imgItem.spriteFrame = this.sorghum;
                break;
            case 3:
                this.imgItem.spriteFrame = this.dukang;
                break;
            case 4:
                this.imgItem.spriteFrame = this.upPower;
                break;
            case 5:
                this.imgItem.spriteFrame = this.upCON;
                break;
            case 6:
                this.imgItem.spriteFrame = this.upSTR;
                break;
            case 7:
                this.imgItem.spriteFrame = this.upAGI;
                break;
        }
    }

    setOnClick_BtnYes(fn) {
        this.onClick_BtnYesPlus = fn;
    }
    onClick_BtnYes(btn) {
        if (this.onClick_BtnYesPlus) this.onClick_BtnYesPlus(btn);
        this.node.removeFromParent();
    }

    setOnClick_BtnNo(fn) {
        this.onClick_BtnNoPlus = fn;
    }
    onClick_BtnNo(btn) {
        if (this.onClick_BtnNoPlus) this.onClick_BtnNoPlus(btn);
        this.node.removeFromParent();
    }

    setOnClick_BtnContinue(fn) {
        this.onClick_BtnCountinuePlus = fn;
    }
    onClick_BtnContinue(btn) {
        if (this.onClick_BtnCountinuePlus) this.onClick_BtnCountinuePlus(btn);
        this.node.removeFromParent();
    }

}
