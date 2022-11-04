const { ccclass, property } = cc._decorator;

@ccclass
export default class HPControl extends cc.Component {
    @property(cc.ProgressBar)
    progressHeroHP: cc.ProgressBar = null;

    setProgress(Progress: number) {
        this.progressHeroHP.progress = Progress;
    }
}