import HeroInfoBase from "./HeroInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeroSelect extends cc.Component {

    @property([HeroInfoBase])
    Heros: HeroInfoBase[] = [];
    @property(cc.Prefab)
    PrefabSelected: cc.Prefab = null;
    @property(cc.SpriteFrame)
    FrameEmpty: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    FrameGreen: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    FrameGray: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    FrameBlue: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    FramePurple: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    FrameYellow: cc.SpriteFrame = null;
    @property([cc.SpriteFrame])
    FramePortraits: cc.SpriteFrame[] = [];
    @property([cc.Node])
    NodePortraits: cc.Node[] = [];

    prefabSelected: cc.Node;
    selectedIndex: number = 0;
    onClick_NodePortraitPlus: any;

    // @property([cc.Button]) // 配列の宣言
    // myButtons: cc.Button[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.log("onLoad");
        this.NodePortraits.forEach(NodePortrait => {
            NodePortrait.on('click', this.onClick_NodePortrait, this);
        });
        this.prefabSelected = cc.instantiate(this.PrefabSelected);
        this.NodePortraits[0].addChild(this.prefabSelected);

        for (let i = 0; i < this.Heros.length; i++) {
            const Hero = this.Heros[i];
            const NodePortrait = this.NodePortraits[i];
            const portrait = this.FramePortraits[Hero.ID];
            var startSF = this.FrameGray;
            if (Hero.StartLv == 1) {
                startSF = this.FrameGreen;
            } else if (Hero.StartLv == 2) {
                startSF = this.FrameBlue;
            } else if (Hero.StartLv == 3) {
                startSF = this.FramePurple;
            } else if (Hero.StartLv == 4) {
                startSF = this.FrameYellow;
            }
            NodePortrait.getComponent("cc.Sprite").spriteFrame = startSF;
            const nodePortrait = NodePortrait.getChildByName("Portrait");
            const comSprite = nodePortrait.getComponent("cc.Sprite");
            comSprite.spriteFrame = portrait;
            comSprite.enabled = true;
        }
    }

    setOnClick_NodePortraitPlus(meth: any) {
        this.onClick_NodePortraitPlus = meth;
    }

    onClick_NodePortrait(button: cc.Button) {
        cc.log("onClick_NodePortrait " + button);
        var index = -1;
        for (let i = 0; i < this.NodePortraits.length; i++) {
            const NodePortrait = this.NodePortraits[i];
            const tmpButton = NodePortrait.getComponent("cc.Button");
            if (tmpButton == button) {
                index = i;
                break;
            }
        }
        cc.log("onClick_NodePortrait index=" + index);
        if (index != -1) {
            if (index < this.Heros.length) {
                this.NodePortraits[this.selectedIndex].removeChild(this.prefabSelected);
                this.NodePortraits[index].addChild(this.prefabSelected);
                this.selectedIndex = index;
                if (this.onClick_NodePortraitPlus) this.onClick_NodePortraitPlus(button, index);
            }
        }
    }
}
