const { ccclass, property } = cc._decorator;

@ccclass
export default class Battle extends cc.Component {
  ID: number = -1;
  Hard: number = -1;
  Name: string = "";
  SoldierType: string = ""; //平均：Avg, Infantry, Spearman, Cavalryman, Archer
  KillSoldiers: number = -1;
  EnemyHeroID: number = -1;
  EnemyHomeHP: number = -1;
  Map: string = "";


  static newBattle(ID: number, Hard: number, Name: string, SoldierType: string,
    KillSoldiers: number, EnemyHeroID: number, EnemyHomeHP: number, Map: string) {
      var b = new Battle();
      b.ID = ID;
      b.Hard = Hard;
      b.Name = Name;
      b.SoldierType = SoldierType;
      b.KillSoldiers = KillSoldiers;
      b.EnemyHeroID = EnemyHeroID;
      b.EnemyHomeHP = EnemyHomeHP;
      b.Map = Map;
      return b;
  }


}