import GameConfig from "./GameConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfigWindow extends cc.Component {
    @property(cc.Button)
    btnBack: cc.Button = null;

    @property(cc.Toggle)
    togCfgMusic: cc.Toggle = null;

    @property(cc.Toggle)
    togCfgSound: cc.Toggle = null;

    onClick_btnBackPlus = null;
    gameConfig: GameConfig = null;

    onLoad() {
        this.ReloadUserConfig();
        this.togCfgMusic.node.on('toggle', this.onToggle_togCfgMusic, this);
        this.togCfgSound.node.on('toggle', this.onToggle_togCfgSound, this);
        this.btnBack.node.on('click', this.onClick_btnBack, this);
    }
    setOnClick_btnBack(btn: any) {
        this.onClick_btnBackPlus = btn;
    }

    onClick_btnBack(btn) {
        if (this.onClick_btnBackPlus) {
            this.onClick_btnBackPlus(btn);
        }

    }
    onToggle_togCfgMusic(toggle) {
        this.gameConfig.configMusic = toggle.isChecked;
        this.gameConfig.SaveMusicConfig();
    }

    onToggle_togCfgSound(toggle) {
        this.gameConfig.configSound = toggle.isChecked;
        this.gameConfig.SaveSoundConfig();

    }

    ReloadUserConfig() {
        this.gameConfig = new GameConfig();
        this.gameConfig.Load();

        var music = this.gameConfig.configMusic;
        var sound = this.gameConfig.configSound;
        if (music)
            this.togCfgMusic.check();
        else
            this.togCfgMusic.uncheck();
        if (sound)
            this.togCfgSound.check();
        else
            this.togCfgSound.uncheck();
    }
}
