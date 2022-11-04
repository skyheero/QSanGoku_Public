import Battle from "./Battle";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelConfig extends cc.Component {

  //constant
  @property
  fileName: string = "LevelConfig";
  // Json fields
  @property
  Battles: Battle[] = [];

  static getBattle(LevelID: number) {
    var KillSoldiers = 10;
    var KillHome = 1000;
    //平均:Avg, Infantry, Spearman, Cavalryman, Archer
    switch (LevelID) {
      case 0: return Battle.newBattle(LevelID, LevelID % 3, "黃巾之亂", "Avg", KillSoldiers, -1, -1, "senlin1.png");
      case 1: return Battle.newBattle(LevelID, LevelID % 3, "黃巾之亂", "Avg", KillSoldiers, 10, -1, "senlin1.png");
      case 2: return Battle.newBattle(LevelID, LevelID % 3, "黃巾之亂", "Avg", KillSoldiers, 10, KillHome, "senlin1.png");
      case 3: return Battle.newBattle(LevelID, LevelID % 3, "董卓叛亂", "Infantry", KillSoldiers, -1, -1, "shamo1.png");
      case 4: return Battle.newBattle(LevelID, LevelID % 3, "董卓叛亂", "Infantry", KillSoldiers, 11, -1, "shamo1.png");
      case 5: return Battle.newBattle(LevelID, LevelID % 3, "董卓叛亂", "Infantry", KillSoldiers, 11, KillHome, "shamo1.png");
      default: null;
    }

  }
}