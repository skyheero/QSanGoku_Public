import HeroInfoBase from "../Model/HeroInfoBase";
import HeroInfo from "../Model/HeroInfo";
import HeroSelect from "../Model/HeroSelect";
import MM_Transition from "./MM_Transition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_09_02_01 extends cc.Component {
    trans: MM_Transition = null;

    onLoad() {
        cc.log("onLoad");
        this.trans = new MM_Transition();
    }

    start() {
        cc.log("start");
        let nextScene = this.trans.getNextScene();
        if (nextScene) {
            cc.director.preloadScene(nextScene,
                (completedCount, totalCount, item) => { this.onProgress(completedCount, totalCount, item) },
                (error) => { this.onPreloadScene(error) }
            );
        } else {
            cc.log("trans.nextScene == null");
            this.trans.reqBack();
        }
    }
    // update (dt) {}

    onProgress(completedCount: number, totalCount: number, item: any) {
        // cc.log("onProgress", "completedCount=", completedCount, "totalCount=", totalCount);
        // cc.log("onProgress", "item=", item);
    }

    onPreloadScene(error: Error) {
        cc.log("Next scene preloaded", "error=", error);
        if (error) {
            this.trans.reqBack();
            return;
        }
        let nextScene = this.trans.getNextScene();
        cc.director.loadScene(nextScene, () => { this.onLoadScene(nextScene) });
    }

    onLoadScene(nextScene) {
        cc.log("Next scene onLoadScene");
        if (nextScene == "MM_01_01_01") {
            var scene = cc.director.getScene();
            scene.getChildByName('Canvas').getComponent("MM_01_01_01").showStartAni = false;
        }
    }

}
