const { ccclass, property } = cc._decorator;

declare global {
    interface Window { CC_Transition: any; } //window 上的變數統一加上CC_ 好找而已沒為什麼
}

@ccclass
export default class MM_Transition extends cc.Component {
    tHistory: string[] = [];
    bundleData: any = {};

    constructor() {
        super();
        window.CC_Transition = window.CC_Transition || {};
        
        if (window.CC_Transition.tHistory) {
            this.tHistory = window.CC_Transition.tHistory;
        } else {
            window.CC_Transition.tHistory = this.tHistory;
        }

        if (window.CC_Transition.bundleData) {
            this.bundleData = window.CC_Transition.bundleData;
        } else {
            window.CC_Transition.bundleData = this.bundleData;
        }
    }

    getNextScene() {
        return window.CC_Transition.nextScene;
    }

    setNextScene(nextScene) {
        window.CC_Transition.nextScene = nextScene;
    }

    setBundle(data: any) {
        this.bundleData.data = data;
    }

    getBundle(){
        return this.bundleData.data;
    }

    reqForward(scene: string) {
        cc.log("reqForward", scene);
        this.tHistory.push(scene);
        this.setNextScene(scene);
        cc.director.loadScene("MM_09_02_01", this.onLaunched_MM_09_02_01);
    }

    reqBack() {
        cc.log("reqBack", this.tHistory.pop());
        if (this.tHistory.length == 0) {
            this.reqForward("MM_01_01_01");
            return;
        }
        let nextScene = this.tHistory[this.tHistory.length - 1];
        this.setNextScene(nextScene);
        cc.director.loadScene("MM_09_02_01", this.onLaunched_MM_09_02_01);
    }

    onLaunched_MM_09_02_01() {
        cc.log("onLaunched_MM_09_02_01");
    }
}
