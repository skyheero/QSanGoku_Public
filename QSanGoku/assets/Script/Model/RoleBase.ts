import Vitalsigns from "./vitalsigns";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleBase extends cc.Component {
    //index 0 Stand
    //index 1 Walk
    //index 2 Fight
    //index 3 Dead
    @property
    isDead: boolean = false;
    @property
    isFaceToRight: boolean = true;
    @property
    isInField: boolean = false;

    vitalsigns: Vitalsigns = null;
    isStand: boolean = true;
    isWalking: boolean = false;
    isFighting: boolean = false;
    isCollisionLeft: boolean = false;
    isCollisionRight: boolean = false;
    ccBoxs: cc.BoxCollider[] = []; //碰撞物件
    xGdRoll = 2.5;
    speed = 1; //
    moveGround = 0;
    ani: cc.Animation = null;
    clips: cc.AnimationClip[] = null;
    DeadCount: number = 150;
    onDead_StartPlus: any;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.vitalsigns = this.getComponent("Vitalsigns");
        if(this.vitalsigns != null)
        {
            this.vitalsigns.setOnDead(() => { this.onDead() });
            this.moveGround = this.xGdRoll * this.speed;
            this.ani = this.getComponent("cc.Animation");
            this.clips = this.ani.getClips();
            this.ani.play(this.ani.defaultClip.name);
            if (!this.isFaceToRight) {
                this.turnLeft();
            }
        }
    }

    // start () {}

    update(dt) {
        if (!this.isInField) return;
        if (this.isDead) {
            this.DeadCount--;
            if (this.DeadCount <= 0)
                this.node.removeFromParent(true);
            return;
        }
        //NPC 自己移動
        if (this.isFight()) {
            // this.aniStand();
        } else if (this.isFaceToRight) {
            this.turnRight();
            this.aniWalk();
            this.node.x += this.moveGround;
        } else {
            this.turnLeft();
            this.aniWalk();
            this.node.x -= this.moveGround;
        }
    }

    turnRight() {
        // cc.log("turnRight");
        this.node.is3DNode = true;
        this.isFaceToRight = true;
        this.node.eulerAngles = cc.v3(0, 0, 0)
    }

    turnLeft() {
        // cc.log("turnLeft");
        this.node.is3DNode = true;
        this.isFaceToRight = false;
        this.node.eulerAngles = cc.v3(0, 180, 0)
    }

    aniStand() {
        if (this.isDead) return;
        this.isWalking = false;
        this.isFighting = false;
        if (!this.isStand) {
            this.isStand = true;
            this.ani.play(this.clips[0].name);
        }
    }

    aniWalk() {
        if (this.isDead) return;
        this.isFighting = false;
        this.isStand = false;
        if (!this.isWalking) {
            this.isWalking = true;
            this.ani.play(this.clips[1].name);
            // cc.log("aniWalk");
        }
    }

    aniFight() {
        if (this.isDead) return;
        this.isWalking = false;
        this.isStand = false;
        if (!this.isFighting) {
            this.isFighting = true;
            this.ani.play(this.clips[2].name);
            // cc.log("aniFight");
        }
    }

    aniDead() {
        if (!this.isDead) {
            this.isDead = true;
            this.ani.play(this.clips[3].name);
        }
    }

    onDead() {
        this.aniDead();
    }



    onFight_End() {
        // cc.log("onFight_End " + this.uuid);
        if (this.ccBoxs.length == 0) return;

        let b = this.findEnemy();
        if (!b) return;
        let vitalsigns = b.getComponent("Vitalsigns");
        // let role = b.node.getComponent("RoleBase");
        if (this.node.group == "Enemy" && (b.node.group == "Support" || b.node.group == "default")) {
            if (vitalsigns) {
                vitalsigns.beHitBy(this, this.vitalsigns.Damage);
            }
        } else if ((this.node.group == "default" || this.node.group == "Support") && b.node.group == "Enemy") {
            // cc.log("onFight_End Enemy");
            if (vitalsigns) {
                vitalsigns.beHitBy(this, this.vitalsigns.Damage);
            }
        }
    }
    onDead_Start() {
        // cc.log("onDead_Start " + this.uuid);
        this.isDead = true;
        this.node.removeComponent("cc.BoxCollider");
        let pBar = this.node.getChildByName("HPProgressBar");
        this.node.removeChild(pBar,true);
        if (this.onDead_StartPlus) {
            this.onDead_StartPlus();
        }
    }
    onDead_End() {
        // cc.log("onDead_End " + this.uuid);
    }

    setOnDead_Start(onDead_StartPlus: any) {
        this.onDead_StartPlus = onDead_StartPlus;
    }

    onCollisionEnter(_other, _self) {
        // cc.log("onCollisionEnter", "_other", _other, "_self", _self);
        if (_other.node.group == "TowerHome" || _other.node.group == "TowerEnemy") {
            return;
        }
        this.ccBoxs.push(_other);
        if (_other["world"].aabb.x > _self.world.aabb.x)
            this.isCollisionRight = true;
        else {
            this.isCollisionLeft = true;
        }
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = _self.world;

        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;

        // 节点碰撞前上一帧 aabb 碰撞框的位置
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;
    }

    onCollisionStay(_other, _self) {
        // console.log('on collision stay');
    }

    onCollisionExit(_other, _self) {
        // cc.log("onCollisionExit", "_other", _other, "_self", _self);
        this.ccBoxs = this.ccBoxs.filter(b => b.uuid != _other.uuid);
        this.isCollisionLeft = false;
        this.isCollisionRight = false;
        if (this.ccBoxs.length != 0) {
            this.ccBoxs.forEach(b => {
                if (this.isCollisionLeft && this.isCollisionRight) return;
                if (b.node.group == "TowerHome" || b.node.group == "TowerEnemy") {
                    return;
                }
                if (b["world"].aabb.x > _self.world.aabb.x) {
                    this.isCollisionRight = true;
                } else {
                    this.isCollisionLeft = true;
                }
            });
        }
    }

    isCollidedEnemy(ccBox: cc.BoxCollider) {
        if (ccBox.node.group == "TowerHome" || ccBox.node.group == "TowerEnemy") {
            return false;
        }
        if (this.node.group == "Enemy" && (ccBox.node.group == "Support" || ccBox.node.group == "default")) {
            return true;
        } else if ((this.node.group == "default" || this.node.group == "Support") && ccBox.node.group == "Enemy") {
            return true;
        }
        return false;
    }


    findEnemy() {
        let b = null;
        if (!this.isCollisionLeft && !this.isCollisionRight) return b;
        let mat4 = cc.mat4();
        this.node.getWorldMatrix(mat4);
        let vec3 = new cc.Vec3();
        mat4.getTranslation(vec3);
        if(this.node.parent.name=="EnemyRole"){
            let a = 0;
        }else{
            let a = 0;
        }
        for (let i = 0; i < this.ccBoxs.length; i++) {
            const ccBox = this.ccBoxs[i];
            const hasNext = i + 1 < this.ccBoxs.length;
            if (hasNext && (ccBox.node.name == "Home" || ccBox.node.name == "EnemyHome")) {
                continue;
            }
            if (this.isCollidedEnemy(ccBox)) {
                b = ccBox;
                if (b["world"].aabb.x > vec3.x) {
                    this.turnRight();
                } else {
                    this.turnLeft();
                }
                break;
            }
        }
        return b;
    }

    isFight() {
        let isFight = false;
        let b = this.findEnemy();
        if (!b) return isFight;
        this.aniFight();
        isFight = true;
        return isFight;
    }
}
