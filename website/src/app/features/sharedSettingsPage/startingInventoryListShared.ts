export type LeftData = {
  index: number;
  name: string;
};

type StartingItemDef = {
  name: string;
  max?: number;
  onSubtext?(count: number): string;
};

export type StartingItemFullDef = StartingItemDef & {
  id: number;
};

export enum ItemId {
  OrdonShield = 42,
  HylianShield = 44,
  MagicArmor = 48,
  ZoraArmor = 49,
  ShadowCrystal = 50,
  Hawkeye = 62,
  ProgressiveSword = 63,
  Boomerang = 64,
  Spinner = 65,
  BallAndChain = 66,
  ProgressiveBow = 67,
  ProgressiveClawshot = 68,
  IronBoots = 69,
  ProgressiveDominionRod = 70,
  Lantern = 72,
  ProgressiveFishingRod = 74,
  Slingshot = 75,
  GiantBombBag = 79,
  BombBagAndBombs = 81,
  EmptyBottle = 96,
  HorseCall = 132,
  AurusMemo = 144,
  AsheisSketch = 145,
  ProgressiveHiddenSkill = 225,
  ProgressiveSkyBook = 233,
  GateKeys = 243,
}

export const startingItemDefs: Record<ItemId, StartingItemDef> = {
  [ItemId.ShadowCrystal]: { name: 'Shadow Crystal' },
  [ItemId.ProgressiveSword]: { name: 'Progressive Sword', max: 4 },
  [ItemId.Boomerang]: { name: 'Boomerang' },
  [ItemId.Lantern]: { name: 'Lantern' },
  [ItemId.Slingshot]: { name: 'Slingshot' },
  [ItemId.ProgressiveFishingRod]: { name: 'Progressive Fishing Rod', max: 2 },
  [ItemId.IronBoots]: { name: 'Iron Boots' },
  [ItemId.ProgressiveBow]: { name: 'Progressive Bow', max: 3 },
  [ItemId.BombBagAndBombs]: { name: 'Bomb Bag and Bombs', max: 3 },
  [ItemId.GiantBombBag]: { name: 'Giant Bomb Bag' },
  [ItemId.ZoraArmor]: { name: 'Zora Armor' },
  [ItemId.ProgressiveClawshot]: { name: 'Progressive Clawshot', max: 2 },
  [ItemId.AurusMemo]: { name: "Auru's Memo" },
  [ItemId.AsheisSketch]: { name: "Ashei's Sketch" },
  [ItemId.Spinner]: { name: 'Spinner' },
  [ItemId.BallAndChain]: { name: 'Ball and Chain' },
  [ItemId.ProgressiveDominionRod]: { name: 'Progressive Dominion Rod', max: 2 },
  [ItemId.ProgressiveSkyBook]: {
    name: 'Progressive Sky Book',
    max: 7,
    onSubtext(count: number) {
      if (count > 0) {
        return `Sky Book and ${count - 1}/6 characters`;
      }
      return '';
    },
  },
  [ItemId.HorseCall]: { name: 'Horse Call' },
  [ItemId.GateKeys]: { name: 'Gate Keys' },
  [ItemId.EmptyBottle]: { name: 'Empty Bottle' },
  [ItemId.ProgressiveHiddenSkill]: { name: 'Progressive Hidden Skill', max: 7 },
  [ItemId.MagicArmor]: { name: 'Magic Armor' },
  [ItemId.OrdonShield]: { name: 'Ordon Shield' },
  [ItemId.HylianShield]: { name: 'Hylian Shield' },
  [ItemId.Hawkeye]: { name: 'Hawkeye' },
};

export const startingItemDefsOrder: ItemId[] = [
  ItemId.ShadowCrystal,
  ItemId.ProgressiveSword,
  ItemId.Boomerang,
  ItemId.Lantern,
  ItemId.Slingshot,
  ItemId.ProgressiveFishingRod,
  ItemId.IronBoots,
  ItemId.ProgressiveBow,
  ItemId.BombBagAndBombs,
  ItemId.GiantBombBag,
  ItemId.ZoraArmor,
  ItemId.ProgressiveClawshot,
  ItemId.AurusMemo,
  ItemId.AsheisSketch,
  ItemId.Spinner,
  ItemId.BallAndChain,
  ItemId.ProgressiveDominionRod,
  ItemId.ProgressiveSkyBook,
  ItemId.HorseCall,
  ItemId.GateKeys,
  ItemId.EmptyBottle,
  ItemId.ProgressiveHiddenSkill,
  ItemId.MagicArmor,
  ItemId.OrdonShield,
  ItemId.HylianShield,
  ItemId.Hawkeye,
];
