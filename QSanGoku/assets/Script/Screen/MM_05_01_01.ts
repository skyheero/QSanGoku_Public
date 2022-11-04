import GeneralBG from "../Model/GeneralBG";
import RoleBase from "../Model/RoleBase";
import Scenario from "../Model/Scenario";
import GameConfig from "../Model/GameConfig";
import MM_Transition from "./MM_Transition";
import LevelConfig from "../Model/LevelConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MM_05_01_01 extends cc.Component {
    //UI
    @property
    updateSpeedUI: number = 60;
    @property(cc.Label)
    txtNowX: cc.Label = null;
    @property(cc.Label)
    labHP: cc.Label = null;
    @property(cc.ProgressBar)
    progressHeroHP: cc.ProgressBar = null;
    @property(cc.Label)
    TxtSupporter: cc.Label = null;
    @property(cc.Label)
    TxtEnemyRole: cc.Label = null;
    @property(cc.Label)
    TxtBattleID: cc.Label = null;
    @property(cc.Label)
    txtAim: cc.Label = null;
    @property(cc.Toggle)
    togHeroCollider: cc.Toggle = null;
    @property(cc.Toggle)
    togGenSupporter: cc.Toggle = null;
    @property(cc.Toggle)
    togGenEnemyRole: cc.Toggle = null;
    @property(cc.Button)
    btnAddGen: cc.Button = null;
    @property(cc.Button)
    btnAddEnemy: cc.Button = null;
    @property(cc.Label)
    labDiamondNum: cc.Label = null;
    @property(cc.Sprite)
    spriteHeroImg: cc.Sprite = null;

    //背景控制
    @property(cc.Node)
    Background: cc.Node = null;
    @property(cc.Node)
    Ground: cc.Node = null;
    @property(cc.Node)
    Hero: cc.Node = null;
    @property(cc.Node)
    EnemyHero: cc.Node = null;
    @property(cc.Node)
    Supporter: cc.Node = null;
    @property(cc.Node)
    EnemyRole: cc.Node = null;
    @property(cc.Node)
    Home: cc.Node = null;
    @property(cc.Node)
    EnemyHome: cc.Node = null;
    @property(cc.Node)
    TowerHome: cc.Node = null;
    @property(cc.Node)
    TowerEnemy: cc.Node = null;

    //操作控制
    @property(cc.Button)
    btnInfantry: cc.Button = null;
    @property(cc.Button)
    btnSpearman: cc.Button = null;
    @property(cc.Button)
    btnCavalryman: cc.Button = null;
    @property(cc.Button)
    btnArcher: cc.Button = null;
    @property(cc.Button)
    btnAttack: cc.Button = null;
    @property(cc.Button)
    btnHeart: cc.Button = null;
    @property(cc.Button)
    btnDrum: cc.Button = null;
    @property(cc.Label)
    lableForage: cc.Label = null;
    @property(cc.Label)
    lableMaxForage: cc.Label = null;
    @property([cc.SpriteFrame])
    HeroIcon: cc.SpriteFrame[] = [];

    //背景控制
    xBgRoll = 0.5;
    width = 0;
    sideRight = 0; // -1920
    sideLeft = 0; //-640 大
    moveGround = 0;
    moveBackground = 0;
    pressedRight = false;
    pressedLeft = false;
    _updateSpeedUI = 0

    //人物控制
    scenario: Scenario = null;
    Role: RoleBase = null;
    nowX = 0;

    //設定變數
    maxForage: number = 150;
    forage: number = 0;
    updateForageTime: number = 1;
    heroHp: number = 300;
    //skill cool down time
    skillCDTime: number = 2;
    isBtnInfantryCD: boolean = false;
    isBtnSpearmanCD: boolean = false;
    isBtnCavalrymanCD: boolean = false;
    isBtnArcherCD: boolean = false;

    gameCfg: GameConfig = null;
    trans: MM_Transition = null;
    bundleData = null;
    ItemID_Diamond = 1;//ID:1 diamond


    onLoad() {
        console.log('onLoad');
        this.trans = new MM_Transition();
        if (this.trans.bundleData.data) {
            cc.log('MM_05_01_01 onLoad ' + JSON.stringify(this.trans.bundleData));
            this.bundleData = this.trans.bundleData.data;
        }
        else {
            this.trans.reqBack();
            return;
        }
        this.gameCfg = new GameConfig();
        this.gameCfg.Load();
        const battleID = this.bundleData.BattleID || 0;
        const levelConfig = LevelConfig.getBattle(battleID);
        this.togHeroCollider.node.on('toggle', this.onToggle_togHeroCollider, this);
        this.togGenSupporter.node.on('toggle', this.onToggle_togGenSupporter, this);
        this.togGenEnemyRole.node.on('toggle', this.onToggle_togGenEnemyRole, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.width = this.node.getContentSize().width / 2;
        this.sideRight = 0 - this.node.getContentSize().width - this.width;
        this.sideLeft = 0 - this.width;
        this.txtNowX.string = this.nowX + "";
        this.TxtBattleID.string = battleID;
        this.scenario = this.getComponent("Scenario");
        this.scenario.setConfig(this.gameCfg, levelConfig, battleID);
        this.scenario.Hero = this.Hero;
        this.scenario.EnemyHero = this.EnemyHero;
        this.scenario.Supporter = this.Supporter;
        this.scenario.EnemyRole = this.EnemyRole;
        this.scenario.Home = this.Home;
        this.scenario.EnemyHome = this.EnemyHome;
        this.scenario.TowerHome = this.TowerHome;
        this.scenario.TowerEnemy = this.TowerEnemy;
        this.togGenSupporter.isChecked = this.scenario.isGenSupport;
        this.togGenEnemyRole.isChecked = this.scenario.isGenEnemy;
        // btn evnet
        this.btnInfantry.node.on('click', this.onClick_Btn, this);
        this.btnSpearman.node.on('click', this.onClick_Btn, this);
        this.btnCavalryman.node.on('click', this.onClick_Btn, this);
        this.btnArcher.node.on('click', this.onClick_Btn, this);
        this.btnAttack.node.on('click', this.onClick_Btn, this);
        this.btnHeart.node.on('click', this.onClick_Btn, this);
        this.btnDrum.node.on('click', this.onClick_Btn, this);
        this.lableMaxForage.string = this.maxForage.toString();
        this.lableForage.schedule(() => {
            if (this.forage < this.maxForage) {
                this.setForage(1);
            }
        }, 0, cc.macro.REPEAT_FOREVER, this.updateForageTime);
        this.btnAddGen.node.on('click', this.onClick_AddGen, this);
        this.btnAddEnemy.node.on('click', this.onClick_AddEnemy, this);
        // init UI
        this.setDiamond();
        this.setHeroData();
    }

    start() {
        // 开启碰撞检测系统，未开启时无法检测
        cc.director.getCollisionManager().enabled = true;
        this.Role = this.Hero.getComponentInChildren("RoleBase");
        this.moveGround = this.Role.xGdRoll * this.Role.speed;
        this.moveBackground = this.xBgRoll * this.Role.speed;
    }

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt) {
        // console.log(dt);
        this._updateSpeedUI--;
        if (this._updateSpeedUI <= 0) {
            this._updateSpeedUI = this.updateSpeedUI;
            this.TxtSupporter.string = this.countSupporter() + "";
            this.TxtEnemyRole.string = this.countEnemyRole() + "";
        }
        this.setAims();//時間要改一下
        // if (dt % 2 != 0) return;
        if (this.pressedRight) {
            this.Role.turnRight();
            if (this.Role.isCollisionRight && this.Role.isFaceToRight) {
                this.pressedRight = false;
                return;
            }
            this.Role.aniWalk();
            if (this.Hero.x <= 0 || (this.EnemyHome.active && this.EnemyHome.x <= this.width)) {//判斷移動人 
                this.Hero.x += this.moveGround;
            } else {//判斷移動場景
                this.rollLeftBackground();
                this.rollLeftGround();
            }
            this.nowX += this.moveGround;
            this.txtNowX.string = this.nowX + "";
        } else if (this.pressedLeft) {
            this.Role.turnLeft();
            if (this.Role.isCollisionLeft && !this.Role.isFaceToRight) {
                this.pressedLeft = false;
                return;
            }
            this.Role.aniWalk();
            if (this.Hero.x >= 0 || this.Home.x >= -this.width) {//判斷移動人
                this.Hero.x -= this.moveGround;
            } else {//判斷移動場景
                this.rollRightBackground();
                this.rollRightGround();
            }
            this.nowX -= this.moveGround;
            this.txtNowX.string = this.nowX + "";
        } else {
            if (!this.Role.isFight()) {
                this.Role.aniStand();
            }
        }
        this.updateSkill();
        this.updateHeroHP();
    }

    onKeyDown(event: any) {
        // cc.log("onKeyDown", event.keyCode);
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this.pressedRight = true;
                this.pressedLeft = false;
                break;
            case cc.macro.KEY.left:
                this.pressedRight = false;
                this.pressedLeft = true;
                break;
        }
    }

    onKeyUp(event: any) {
        // cc.log("onKeyUp", event.keyCode);
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                this.trans.reqBack();
            case cc.macro.KEY.right:
                this.pressedRight = false;
                break;
            case cc.macro.KEY.left:
                this.pressedLeft = false;
                break;
        }
    }

    rollRightBackground() {
        var nextX = this.Background.x + this.moveBackground;
        if (nextX > this.sideLeft) {
            nextX = this.sideRight + (nextX - this.sideLeft);
        }
        this.Background.x = nextX;
    }
    rollLeftBackground() {
        var nextX = this.Background.x - this.moveBackground;
        if (nextX < this.sideRight) {
            nextX = this.sideLeft - (this.sideRight - nextX);
        }
        this.Background.x = nextX;
    }
    rollRightGround() {
        var nextX = this.Ground.x + this.moveGround;
        if (nextX > this.sideLeft) {
            nextX = this.sideRight + (nextX - this.sideLeft);
        }
        this.Ground.x = nextX;
        this.TowerHome.x += this.moveGround;
        this.TowerEnemy.x += this.moveGround;
        this.Home.x += this.moveGround;
        this.EnemyHome.x += this.moveGround;
        this.EnemyHero.x += this.moveGround;
        this.Supporter.x += this.moveGround;
        this.EnemyRole.x += this.moveGround;
    }
    rollLeftGround() {
        var nextX = this.Ground.x - this.moveGround;
        if (nextX < this.sideRight) {
            nextX = this.sideLeft - (this.sideRight - nextX);
        }
        this.Ground.x = nextX;
        this.TowerHome.x -= this.moveGround;
        this.TowerEnemy.x -= this.moveGround;
        this.Home.x -= this.moveGround;
        this.EnemyHome.x -= this.moveGround;
        this.EnemyHero.x -= this.moveGround;
        this.Supporter.x -= this.moveGround;
        this.EnemyRole.x -= this.moveGround;
    }

    countSupporter() {
        let count = 0;
        this.Supporter.children.forEach(s => {
            const role = s.getComponent("RoleBase");
            if (!role.isDead) {
                count++
            }
        });
        return count;
    }
    countEnemyRole() {
        let count = 0;
        this.EnemyRole.children.forEach(e => {
            const role = e.getComponent("RoleBase");
            if (!role) return;
            if (!role.isDead) {
                count++
            }
        });
        return count;
    }

    onToggle_togHeroCollider(toggle) {
        this.scenario.setHeroCollider(toggle.isChecked);
    }
    onToggle_togGenSupporter(toggle) {
        this.scenario.isGenSupport = toggle.isChecked;
    }
    onToggle_togGenEnemyRole(toggle) {
        this.scenario.isGenEnemy = toggle.isChecked;
    }
    onClick_Btn(event: any) {
        switch (event.node.name) {
            case "ButtonInfantry": { // id:0
                let result = this.setForage(-40);
                if (result) {
                    this.scenario.addSupportSoldier('Infantry');
                    this.setBtnCD(this.btnInfantry, true);
                }
                break;
            }
            case "ButtonSpearman": { // id:1
                let result = this.setForage(-40);
                if (result) {
                    this.scenario.addSupportSoldier('Spearman');
                    this.setBtnCD(this.btnSpearman, true);
                }
                break;
            }
            case "ButtonCavalryman": { // id:2
                let result = this.setForage(-40);
                if (result) {
                    this.scenario.addSupportSoldier('Cavalryman');
                    this.setBtnCD(this.btnCavalryman, true);
                }
                break;
            }
            case "ButtonArcher": { // id:3
                let result = this.setForage(-50);
                if (result) {
                    this.scenario.addSupportSoldier('Archer');
                    this.setBtnCD(this.btnArcher, true);
                }
                break;
            }
            case "ButtonAttack":
                break;
            case "ButtonHeart":
                this.scenario.enrichBlood();
                //use diamond
                this.useDiamond(1);
                break;
            case "ButtonDrum":
                //use diamond
                break;
            default:
                break;
        }

    }

    setForage(forage: number) {
        if (this.forage + forage > this.maxForage) {
            this.forage = this.maxForage
        } else if (this.forage + forage < 0) {
            return false;
        } else {
            this.forage += forage;
        }
        this.lableForage.string = this.forage.toString();
        return true;
    }
    setBtnCD(btn: cc.Button, isCD: boolean) {
        let sprite = btn.node.children[1].getComponent(cc.Sprite);
        if (isCD) {
            btn.interactable = false;
            sprite.fillRange = 0;
        }
        sprite.fillRange += 0.01;
        if (sprite.fillRange == 1) {
            btn.interactable = true;
        }
    }
    updateSkill() {
        if (!this.btnInfantry.interactable) {
            this.setBtnCD(this.btnInfantry, false);
        } else if (!this.btnSpearman.interactable) {
            this.setBtnCD(this.btnSpearman, false);
        } else if (!this.btnCavalryman.interactable) {
            this.setBtnCD(this.btnCavalryman, false);
        } else if (!this.btnArcher.interactable) {
            this.setBtnCD(this.btnArcher, false);
        }
    }
    updateHeroHP() {
        let Hero = this.Hero.getComponentInChildren("Vitalsigns");
        this.labHP.string = Hero.HP + "/" + Hero.maxHP;
        this.progressHeroHP.progress = Hero.progressBarHp;
    }
    onClick_AddGen() {
        this.scenario.addEnemyGeneral();
    }
    onClick_AddEnemy() {
        //randon++
        this.scenario.addEnemy('Infantry');
    }
    setDiamond() {
        this.labDiamondNum.string = "" + this.gameCfg.Items[this.ItemID_Diamond];
    }
    setAims() {
        if (this.scenario.killedEnemySoilderNum < this.scenario.needKillEnemySoilderNum) {
            this.txtAim.string = "擊殺敵方士兵" + this.scenario.killedEnemySoilderNum.toString() + "/" + this.scenario.needKillEnemySoilderNum.toString();
        } else if (this.scenario.killedEnemySoilderNum >= this.scenario.needKillEnemySoilderNum
            && !this.scenario.isEnemyHeroDead) {
            this.txtAim.string = "擊敗敵方武將";
        } else if (this.scenario.killedEnemySoilderNum >= this.scenario.needKillEnemySoilderNum
            && this.scenario.isEnemyHeroDead
            && !this.scenario.isEnemyHomeDead) {
            this.txtAim.string = "摧毀敵營";
        }
    }
    setHeroData() {
        const heroID = this.bundleData.HeroID;
        this.spriteHeroImg.spriteFrame = this.HeroIcon[heroID];
    }
    useDiamond(usedNum: number) {
        const diamondNum = this.gameCfg.Items[this.ItemID_Diamond];
        if (diamondNum == 0) {
            //  倒到購買頁面
        } else {
            this.gameCfg.Items[this.ItemID_Diamond] = diamondNum - usedNum;
            this.gameCfg.SaveItems();
        }
    }
}
