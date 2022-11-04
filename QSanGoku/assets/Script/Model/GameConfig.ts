import HeroInfoOrigin from "./HeroInfoOrigin";
import HeroInfoBase from "./HeroInfoBase";
import SolderInfoBase from "./SolderInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameConfig extends cc.Component {

    //constant
    userFileName: string = "UserFile";
    MAX_HEROS: number = 16;

    //**************************************************************
    // Json fields
    ver: string = "20200907bySky006"
    configMusic: boolean = true;
    configSound: boolean = true;
    heros: HeroInfoOrigin[] = [];
    tavernLeftHero: HeroInfoOrigin = null;
    tavernRightHero: HeroInfoOrigin = null;
    warRound: number[] = [];  //戰場成績 0:沒贏 1:贏了 -1:戰鬥中
    piont: number = 0;
    Items: number[] = [-1, 0, 0, 0, 0, 0, 0, 0];

    GrassMaxLv: number = 0; //max 10
    GrassSpeedLv: number = 0; //max 10
    HomeHpLv: number = 0; //max 10

    MilitarySkills: number[] = []; //20個 步兵→武將
    soldierLv: number[] = [];// 步兵 槍兵 騎兵 弓兵
    soldierExp: number[] = [];// 步兵 槍兵 騎兵 弓兵

    onLoad() {
        cc.log("GameConfig.onLoad");
        this.Load();
    }

    Load() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            this.saveAll();
        } else if (userRecord.ver != this.ver) {
            this.saveAll();
        } else {
            this.ver = userRecord.ver;
            this.configMusic = userRecord.ConfigMusic;
            this.configSound = userRecord.configSound;
            this.ExtractHeros(userRecord.Heros);
            this.tavernLeftHero = userRecord.tavernLeftHero;
            this.tavernRightHero = userRecord.tavernRightHero;
            this.warRound = userRecord.WarRound;
            this.piont = userRecord.piont;
            this.Items = userRecord.Items;
            this.GrassMaxLv = userRecord.GrassMaxLv;
            this.GrassSpeedLv = userRecord.GrassSpeedLv;
            this.HomeHpLv = userRecord.HomeHpLv;
            this.MilitarySkills = userRecord.MilitarySkills;
            this.soldierLv = userRecord.soldierLv;
            this.soldierExp = userRecord.soldierExp;
        }
    }

    saveAll() {
        this.SaveVersion();
        this.SaveMusicConfig();
        this.SaveSoundConfig();
        this.SaveHeros();
        this.SaveTavernHero();
        this.SaveWarRound();
        this.SavePiont();
        this.SaveItems();
        this.SaveCastleData();
        this.SaveMilitarySkill();
        this.SaveSoldierLv();
    }

    addSoldierExp(index: number, addExp: number) {
        var lv = this.soldierLv[index];
        var beforeExp = this.soldierExp[index];
        var afterExp = beforeExp + addExp;
        var soldier = new SolderInfoBase(index, lv, beforeExp);
        var maxExp = soldier.NextExp;
        // var max = 3000;//假的 到時要做模組 根據等級運算上限
        if (afterExp > maxExp) {
            this.soldierLv[index]++;
            this.soldierExp[index] = afterExp - maxExp;
        } else {
            this.soldierExp[index] = afterExp;
        }
        this.SaveSoldierLv();
    }

    getSoldierLv(index: number) {
        //index:0 步兵
        //index:1 槍兵
        //index:2 騎兵
        //index:3 弓兵
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        this.soldierLv = userRecord.soldierLv;
        this.soldierExp = userRecord.soldierExp;
        return this.soldierLv[index];
    }

    getSoldierExp(index: number) {
        //index:0 步兵
        //index:1 槍兵
        //index:2 騎兵
        //index:3 弓兵
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        this.soldierLv = userRecord.soldierLv;
        this.soldierExp = userRecord.soldierExp;
        return this.soldierExp[index];
    }

    SaveSoldierLv() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        if (this.soldierLv.length == 0) {
            this.soldierLv = [1, 1, 1, 1];
            this.soldierExp = [0, 0, 0, 0];
        }
        userRecord.soldierLv = this.soldierLv;
        userRecord.soldierExp = this.soldierExp;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    getStarCountOfSkill(index: number) {
        switch (index) {
            case 16:
            case 17:
            case 18:
            case 19:
                return 2;
            default:
                return index % 4 + 1;
        }

    }

    setMilitarySkill(index: number, enable: boolean) {
        if (enable) {
            this.MilitarySkills[index] = this.getStarCountOfSkill(index);
        } else {
            this.MilitarySkills[index] = 0;
        }
        this.SaveMilitarySkill();
    }

    getMilitarySkill(index: number) {
        //index:0 Infantry1_on
        //index:1 Infantry2_on
        //index:2 Infantry3_on
        //index:3 Infantry4_on
        //index:4 Spearman1_on
        //index:5 Spearman2_on
        //index:6 Spearman3_on
        //index:7 Spearman4_on
        //index:8 Cavalryman1_on
        //index:9 Cavalryman2_on
        //index:10 Cavalryman3_on
        //index:11 Cavalryman4_on
        //index:12 Archer1_on
        //index:13 Archer2_on
        //index:14 Archer3_on
        //index:15 Archer4_on
        //index:16 Commander1_on
        //index:17 Commander2_on
        //index:18 Commander3_on
        //index:19 Commander4_on
        return this.MilitarySkills[index];
    }

    SaveMilitarySkill() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        if (userRecord.MilitarySkills == null) {
            userRecord.MilitarySkills = this.MilitarySkills;
        }
        userRecord.MilitarySkills = this.MilitarySkills;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    isMax_GrassMaxLv() {
        if (this.GrassMaxLv >= 10) return true;
        return false;
    }
    isMax_GrassSpeedLv() {
        if (this.GrassSpeedLv >= 10) return true;
        return false;
    }
    isMax_HomeHpLv() {
        if (this.HomeHpLv >= 10) return true;
        return false;
    }
    Add1_GrassMaxLv() {
        if (this.GrassMaxLv >= 10) this.GrassMaxLv = 10;
        this.GrassMaxLv++;
        this.SaveCastleData();
    }
    Add1_GrassSpeedLv() {
        if (this.GrassSpeedLv >= 10) this.GrassSpeedLv = 10;
        this.GrassSpeedLv++;
        this.SaveCastleData();
    }
    Add1_HomeHpLv() {
        if (this.HomeHpLv >= 10) this.HomeHpLv = 10;
        this.HomeHpLv++;
        this.SaveCastleData();
    }

    SaveCastleData() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        userRecord.GrassMaxLv = this.GrassMaxLv;
        userRecord.GrassSpeedLv = this.GrassSpeedLv;
        userRecord.HomeHpLv = this.HomeHpLv;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    SetTavernHero(tavernLeftHero: HeroInfoBase, tavernRightHero: HeroInfoBase) {
        this.tavernLeftHero = null;
        this.tavernRightHero = null;
        if (tavernLeftHero)
            this.tavernLeftHero = tavernLeftHero.getOrigin();
        if (tavernRightHero)
            this.tavernRightHero = tavernRightHero.getOrigin();
        this.SaveTavernHero();
    }

    SaveTavernHero() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        userRecord.tavernLeftHero = this.tavernLeftHero;
        userRecord.tavernRightHero = this.tavernRightHero;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    getItemQty(ID: number) {
        //ID:0 寶箱
        //ID:1 diamond
        //ID:2 高粱 sorghum
        //ID:3 杜康 dukang
        //ID:4 upPower
        //ID:5 upCON
        //ID:6 upSTR
        //ID:7 upAGI
        return this.Items[ID];
    }

    AddItemQty(itemID: number, qty: number) {
        if (this.Items[itemID] != -1) {
            this.Items[itemID] += qty;
        } else {
            this.Items[itemID] = qty;
        }
        this.SaveItems();
    }

    ReduceItemQty(itemID: number, qty: number) {
        if (this.Items[itemID] > 0 && (this.Items[itemID] - qty) >= 0) {
            this.Items[itemID] -= qty;
        } else {
            this.Items[itemID] = 0;
        }
        this.SaveItems();
    }

    SaveItems() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        if (userRecord.Items == null) {
            userRecord.Items = this.Items;
        }
        userRecord.Items = this.Items;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    AddPiontQty(qty: number) {
        if (this.piont != -1) {
            this.piont += qty;
        } else {
            this.piont = qty;
        }
        this.SavePiont();
    }

    ReducePiontQty(qty: number) {
        if (this.piont > 0 && (this.piont - qty) >= 0) {
            this.piont -= qty;
        } else {
            this.piont = 0;
        }
        this.SavePiont();
    }

    SavePiont() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        userRecord.piont = this.piont;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    SaveVersion() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        userRecord.ver = this.ver;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }
    SaveWarRound() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        if (!userRecord.WarRound) {
            for (let i = 0; i < 147; i++) {
                this.warRound[i] = 0;
            }
        }
        //fake
        // this.warRound[1] = 1;
        // this.warRound[2] = 1;
        // this.warRound[3] = 1;
        // this.warRound[11] = 1;
        // this.warRound[14] = 1;
        // this.warRound[47] = 1;

        userRecord.WarRound = this.warRound;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }


    ExtractHeros(objArray) {
        var status = false;
        if (objArray != undefined) {
            var totalHeros = objArray.length;
            if (totalHeros >= 0 && totalHeros < this.MAX_HEROS) {
                for (var index = 0; index < totalHeros; index++) {
                    this.heros[index] = new HeroInfoOrigin(objArray[index].ID, objArray[index].StartLv, objArray[index].Lv, objArray[index].Exp);
                }
                status = true;
            }
        }

        return status;
    }

    SaveMusicConfig() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        userRecord.ConfigMusic = this.configMusic;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    SaveSoundConfig() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        userRecord.configSound = this.configSound;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    SaveHeros() {
        var userRecord = JSON.parse(cc.sys.localStorage.getItem(this.userFileName));
        if (userRecord == null) {
            userRecord = {};
        }
        userRecord.Heros = this.heros;
        cc.sys.localStorage.setItem(this.userFileName, JSON.stringify(userRecord));
    }

    AddHero(inputHero: HeroInfoBase, isForce: boolean) {
        var role = inputHero.getOrigin();
        var status = false;
        if (role != null) {
            var heroAmount = this.heros.length;
            if (heroAmount < this.MAX_HEROS) {
                var objArray = this.heros.filter(function (item, index, array) {
                    return item.ID == this;
                }, role.ID);
                if (objArray.length == 0) {
                    this.heros[heroAmount] = role;
                    status = true;
                } else if (isForce) {
                    var index = this.FindHero(role)
                    this.heros[index] = role;
                    status = true;
                    cc.log("Force Recruit~~~");
                }
            } else {
                cc.log("Reach Max@@");
            }
        }

        return status;
    }

    FindHero(role: HeroInfoOrigin) {
        var index = -1;
        index = this.heros.findIndex(function (item, index, array) {
            return item.ID == this;
        }, role.ID);
        return index;
    }

    DeleteHero(role: HeroInfoOrigin) {
        var status = false;
        var index = this.FindHero(role);
        if (index != -1) {
            this.heros.splice(index, 1);
            status = true;
        }
        return true;
    }

}
