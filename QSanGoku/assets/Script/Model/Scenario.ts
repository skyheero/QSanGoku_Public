import MessageDialog from "./MessageDialog";
import GameConfig from "./GameConfig";
import Battle from "./Battle";
import MM_Transition from "../Screen/MM_Transition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Scenario extends cc.Component {
    @property
    isGenSupport: boolean = true;
    @property
    supportType: string = null;
    @property
    isGenEnemy: boolean = true;
    @property
    GenSpeedSupport: number = 600;
    @property
    GenSpeedEnemy: number = 600;
    @property
    distance: number = 2000;

    Hero: cc.Node = null;
    EnemyHero: cc.Node = null;
    Supporter: cc.Node = null;
    EnemyRole: cc.Node = null;
    Home: cc.Node = null;
    EnemyHome: cc.Node = null;
    TowerHome: cc.Node = null;
    TowerEnemy: cc.Node = null;

    @property(cc.Prefab)
    PrefabHPProgressBar: cc.Prefab = null;
    @property(cc.Prefab)
    PrefabZhangJiao: cc.Prefab = null;
    @property(cc.Prefab)
    RedInfantry: cc.Prefab = null;
    @property(cc.Prefab)
    RedArcher: cc.Prefab = null;
    @property(cc.Prefab)
    RedCavalryman: cc.Prefab = null;
    @property(cc.Prefab)
    RedSpearman: cc.Prefab = null;
    @property(cc.Prefab)
    BlueInfantry: cc.Prefab = null;
    @property(cc.Prefab)
    BlueArcher: cc.Prefab = null;
    @property(cc.Prefab)
    BlueCavalryman: cc.Prefab = null;
    @property(cc.Prefab)
    BlueSpearman: cc.Prefab = null;

    SID: number = 0;
    _GenSpeedSupport: number = 0
    gameConfig: GameConfig;
    battleConfig: Battle;

    // GameStatus
    needKillEnemySoilderNum: number = 0;
    isEnemyHeroDead: boolean = false;
    isEnemyHomeDead: boolean = false;
    isHomeDead: boolean = false;
    isHeroDead: boolean = false;
    isShowedEnemyHome: boolean = false;
    killedEnemySoilderNum: number = 0;
    isGenEnemyHero: boolean = false;
    lastTimeGenEnemySoilder = 0;
    lastTimeCheckEnd = 0;
    timeGenEnemySoilder = 5 * 1000;
    timeCheckEnd = 1 * 1000;
    battleID: any;

    onLoad() {
        this.Supporter.removeAllChildren(true);
        // this.EnemyRole.removeAllChildren(true);
        this.Hero.removeAllChildren(true);
        // this.EnemyHero.removeAllChildren(true);
        this.read();
    };

    start() {

    };

    update(dt) {
        // if (true) return; //方便小物 記得上傳前助解掉
        let nowT = Date.now();
        //　條件一 生小兵
        if (nowT - this.lastTimeGenEnemySoilder > this.timeGenEnemySoilder) {
            this.lastTimeGenEnemySoilder = nowT;
            this.addEnemy(this.battleConfig.SoldierType);
        }
        if (nowT - this.lastTimeCheckEnd > this.timeCheckEnd) {
            this.lastTimeCheckEnd = nowT;
            this.checkTheEnd();
        }
    };

    checkTheEnd() {
        // if (true) {
        if (this.isHeroDead && !this.isHomeDead) {
            //是否要復活
            MessageDialog.showMsg_2btn(this.node, "生命垂危！購買緊急醫藥箱滿血復活，需花費20愛豆。是否購買？", () => this.revivalHero(), null, null, null);
        } if (this.isHomeDead) {
            MessageDialog.showMsg_1btn(this.node, "失敗", () => this.onEndGame());
        } else if (this.killedEnemySoilderNum >= this.needKillEnemySoilderNum
            && this.isEnemyHeroDead
            && this.isEnemyHomeDead) {
            this.gameConfig.warRound[this.battleID] = 1;//0:沒贏 1:贏了
            this.gameConfig.SaveWarRound();
            MessageDialog.showMsg_1btn(this.node, "完成", () => this.onEndGame());
            // cc.director.pause();
            //set data
            //end game
        }
        else if (this.killedEnemySoilderNum >= this.needKillEnemySoilderNum
            && !this.isGenEnemyHero
            && !this.isEnemyHeroDead) {
            MessageDialog.showMsg_1btn(this.node, "敵方武將出現", null);
            this.isGenEnemyHero = true;
            this.addEnemyGeneral();
        }
        else if (this.killedEnemySoilderNum >= this.needKillEnemySoilderNum
            && this.isEnemyHeroDead
            && !this.isShowedEnemyHome
            && !this.isEnemyHomeDead) {
            this.isShowedEnemyHome = true;
            MessageDialog.showMsg_1btn(this.node, "摧毀敵營", null);
        }
    }

    setConfig(gameConfig, levelConfig, battleID) {
        this.gameConfig = gameConfig;
        this.battleConfig = levelConfig;
        this.battleID = battleID;
    }

    read() {//read Scenario by sid
        //read game config
        //敵方將領
        const enemyGeneral = this.PrefabZhangJiao;
        //敵方血量
        const enemyGeneralHP = 100;
        //敵加血量
        const enemyHomeHP = this.battleConfig.EnemyHomeHP;
        //我方將領
        const general = this.PrefabZhangJiao;
        //自己血量
        const generalHP = 300;
        //自己攻擊
        const generalAttack = 200;
        //自家血量
        const homeHP = 1000;
        //目前關卡Ｆ
        const level = this.battleConfig.Hard;
        //需要殺死的小兵數量
        this.needKillEnemySoilderNum = this.battleConfig.KillSoldiers;

        //產生我軍武將
        this.Supporter.x = this.Home.x + this.Home.width;
        const prefabHero = cc.instantiate(general);
        let roleHero = prefabHero.getComponent("RoleBase");
        roleHero.isFaceToRight = true;
        roleHero.isInField = false;
        this.Hero.addChild(prefabHero);
        let vHero = prefabHero.getComponent("Vitalsigns");
        vHero.setInitHP(generalHP);
        vHero.setDamage(generalAttack);
        // vHero.setOnDead(() => { this.onDead_Hero(this.Hero) });
        roleHero.setOnDead_Start(() => { this.onDead_Hero(this.Hero) });

        //設定家
        let vHome = this.Home.getComponent("Vitalsigns");
        vHome.setInitHP(homeHP);
        vHome.setOnDead(() => { this.onDead_Home(this.Home) });

        //設定敵營

        //讀取劇本 檢查是否顯示敵方軍營 記得軍營不在 建塔也要收弔
        if (this.battleConfig.EnemyHomeHP <= 0) {
            this.EnemyHome.active = false;
            this.TowerEnemy.active = false;
            this.isEnemyHomeDead = true;
        }
        if (this.battleConfig.EnemyHeroID <= 0) {
            this.isEnemyHeroDead = true;
        }
        this.distance = 2000;  //實際距離要-800
        this.EnemyHome.x = this.Home.x + this.distance + this.EnemyHome.width;
        this.TowerEnemy.x = this.EnemyHome.x - 330;
        this.EnemyRole.x = this.EnemyHome.x - this.EnemyHome.width;
        this.EnemyHero.x = this.EnemyRole.x;
        let vEnemyHome = this.EnemyHome.getComponent("Vitalsigns");
        vEnemyHome.setInitHP(enemyHomeHP);
        vEnemyHome.setOnDead(() => { this.onDead_EnemyHome(this.EnemyHome) });

    }

    setSID(SID: number) {
        this.SID = SID;
    }

    setHeroCollider(enabled: boolean) {
        let box: cc.BoxCollider = this.Hero.getComponentInChildren("cc.BoxCollider");
        box.enabled = enabled;
    }

    addSupportSoldier(type: string) {
        var soldier!: cc.Prefab;
        switch (type) {
            case 'Infantry':
                soldier = this.BlueInfantry;
                break;
            case 'Spearman':
                soldier = this.BlueSpearman;
                break;
            case 'Cavalryman':
                soldier = this.BlueCavalryman;
                break;
            case 'Archer':
                soldier = this.BlueArcher;
                break;
        }
        const prefab = cc.instantiate(soldier);
        prefab.group = "Support";
        let role = prefab.getComponent("RoleBase");
        role.isFaceToRight = true;
        role.isInField = true;
        let vitalsigns = prefab.getComponent("Vitalsigns");
        vitalsigns.setInitHP(100);
        role.setOnDead_Start(() => { this.onDead_Supporter(prefab) });
        const pBar = cc.instantiate(this.PrefabHPProgressBar);
        prefab.addChild(pBar);
        this.Supporter.addChild(prefab);
        this.isGenSupport = false;
    }

    onDead_Home(node: cc.Node) {
        cc.log("onDead_Home");
        this.isHomeDead = true;
    }

    onDead_EnemyHome(node: cc.Node) {
        cc.log("onDead_EnemyHome");
        this.isEnemyHomeDead = true;
    }

    onDead_Hero(node: cc.Node) {
        cc.log("onDead_Hero");
        this.isHeroDead = true;
    }

    onDead_EnemyHero(node: cc.Node) {
        cc.log("onDead_EnemyHero");
        this.isEnemyHeroDead = true;
    }

    onDead_Supporter(node: cc.Node) {
        cc.log("onDead_Supporter");
    }

    onDead_EnemyRole(node: cc.Node) {
        cc.log("onDead_EnemyRole");
        this.killedEnemySoilderNum++;
    }

    getRandomSoilder(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    addEnemy(type) {
        //產生機率
        var soldier!: cc.Prefab;
        switch (type) {
            case 'Infantry'://Infantry
                soldier = this.RedInfantry;
                break;
            case 'Spearman'://Spearman
                soldier = this.RedSpearman;
                break;
            case 'Cavalryman'://Cavalryman
                soldier = this.RedCavalryman;
                break;
            case 'Archer'://Archer
                soldier = this.RedArcher;
                break;
            case 'Avg'://Archer
                soldier = this.RedArcher;
                break;
            default:
                soldier = this.RedArcher;
                break;
        }
        const prefab = cc.instantiate(soldier);
        prefab.group = "Enemy";
        let role = prefab.getComponent("RoleBase");
        role.isFaceToRight = false;
        role.isInField = true;
        let vitalsigns = prefab.getComponent("Vitalsigns");
        vitalsigns.setInitHP(100);
        role.setOnDead_Start(() => { this.onDead_EnemyRole(prefab) });
        const pBar = cc.instantiate(this.PrefabHPProgressBar);
        prefab.addChild(pBar);
        this.EnemyRole.addChild(prefab);
        this.isGenEnemy = false;
    }
    addEnemyGeneral() {//產生敵人武將
        const prefabEnemyHero = cc.instantiate(this.PrefabZhangJiao);
        prefabEnemyHero.group = "Enemy";
        let role = prefabEnemyHero.getComponent("RoleBase");
        role.isFaceToRight = false;
        role.isInField = true;
        let vEnemyHero = prefabEnemyHero.getComponent("Vitalsigns");
        vEnemyHero.setInitHP(1000);
        role.setOnDead_Start(() => { this.onDead_EnemyHero(this.EnemyHero) });
        const pBar = cc.instantiate(this.PrefabHPProgressBar);
        prefabEnemyHero.addChild(pBar);
        this.EnemyHero.addChild(prefabEnemyHero);
    }
    onEndGame() {
        const trans = new MM_Transition();
        trans.reqForward("MM_03_03_01");
    }
    enrichBlood() {
        const vitalsigns = this.Hero.children[0].getComponent("Vitalsigns")
        vitalsigns.enrichBlood();
    }
    revivalHero() {
        const vitalsigns = this.Hero.children[0].getComponent("Vitalsigns")
        vitalsigns.enrichBlood();
        this.isHeroDead = false;
    }
}
