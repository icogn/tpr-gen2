import type { CheckId } from './checks';

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
  Dog = 7,
}

export const startingItemDefs: { [key in ItemId]?: StartingItemDef } = {
  [ItemId.ShadowCrystal]: { name: 'Shadow Crystal' },
  [ItemId.ProgressiveSword]: {
    name: 'Progressive Sword',
    max: 4,
    onSubtext(count: number) {
      switch (count) {
        case 4:
          return 'Light Sword';
        case 3:
          return 'Master Sword';
        case 2:
          return 'Ordon Sword';
        case 1:
          return 'Wooden Sword';
        default:
          return '';
      }
    },
  },
  [ItemId.Boomerang]: { name: 'Boomerang' },
  [ItemId.Lantern]: { name: 'Lantern' },
  [ItemId.Slingshot]: { name: 'Slingshot' },
  [ItemId.ProgressiveFishingRod]: {
    name: 'Progressive Fishing Rod',
    max: 2,
    onSubtext(count: number) {
      if (count === 2) {
        return 'Fishing Rod with Coral Earring';
      } else if (count === 1) {
        return 'Fishing Rod';
      }
      return '';
    },
  },
  [ItemId.IronBoots]: { name: 'Iron Boots' },
  [ItemId.ProgressiveBow]: {
    name: 'Progressive Bow',
    max: 3,
    onSubtext(count: number) {
      switch (count) {
        case 3:
          return 'Giant Quiver (100)';
        case 2:
          return 'Big Quiver (60)';
        case 1:
          return 'Base Quiver (30)';
        default:
          return '';
      }
    },
  },
  [ItemId.BombBagAndBombs]: { name: 'Bomb Bag and Bombs', max: 3 },
  [ItemId.GiantBombBag]: { name: 'Giant Bomb Bag' },
  [ItemId.ZoraArmor]: { name: 'Zora Armor' },
  [ItemId.ProgressiveClawshot]: {
    name: 'Progressive Clawshot',
    max: 2,
    onSubtext(count: number) {
      if (count === 2) {
        return 'Double Clawshots';
      } else if (count === 1) {
        return 'Clawshot';
      }
      return '';
    },
  },
  [ItemId.AurusMemo]: { name: "Auru's Memo" },
  [ItemId.AsheisSketch]: { name: "Ashei's Sketch" },
  [ItemId.Spinner]: { name: 'Spinner' },
  [ItemId.BallAndChain]: { name: 'Ball and Chain' },
  [ItemId.ProgressiveDominionRod]: {
    name: 'Progressive Dominion Rod',
    max: 2,
    onSubtext(count: number) {
      if (count === 2) {
        return 'Dominion Rod (restored)';
      } else if (count === 1) {
        return 'Dominion Rod';
      }
      return '';
    },
  },
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
  [ItemId.ProgressiveHiddenSkill]: {
    name: 'Progressive Hidden Skill',
    max: 7,
    onSubtext(count: number) {
      let str = '';
      switch (count) {
        case 7:
          return 'All hidden skills';
        case 6:
          str = 'Jump Strike';
          break;
        case 5:
          str = 'Mortal Draw';
          break;
        case 4:
          str = 'Helm Splitter';
          break;
        case 3:
          str = 'Back Slice';
          break;
        case 2:
          str = 'Shield Attack';
          break;
        case 1:
          return 'Ending Blow';
        default:
          return '';
      }
      return str + ' and earlier skills';
    },
  },
  [ItemId.MagicArmor]: { name: 'Magic Armor' },
  [ItemId.OrdonShield]: { name: 'Ordon Shield' },
  [ItemId.HylianShield]: { name: 'Hylian Shield' },
  [ItemId.Hawkeye]: { name: 'Hawkeye' },
};

// export const startingItemDefsOrder: ItemId[] = [
//   ItemId.ShadowCrystal,
//   ItemId.ProgressiveSword,
//   ItemId.Boomerang,
//   ItemId.Lantern,
//   ItemId.Slingshot,
//   ItemId.ProgressiveFishingRod,
//   ItemId.IronBoots,
//   ItemId.ProgressiveBow,
//   ItemId.BombBagAndBombs,
//   ItemId.GiantBombBag,
//   ItemId.ZoraArmor,
//   ItemId.ProgressiveClawshot,
//   ItemId.AurusMemo,
//   ItemId.AsheisSketch,
//   ItemId.Spinner,
//   ItemId.BallAndChain,
//   ItemId.ProgressiveDominionRod,
//   ItemId.ProgressiveSkyBook,
//   ItemId.HorseCall,
//   ItemId.GateKeys,
//   ItemId.EmptyBottle,
//   ItemId.ProgressiveHiddenSkill,
//   ItemId.MagicArmor,
//   ItemId.OrdonShield,
//   ItemId.HylianShield,
//   ItemId.Hawkeye,
// ];

export const startingItemDefsOrder: ItemId[] = [
  ItemId.AsheisSketch,
  ItemId.AurusMemo,
  ItemId.BallAndChain,
  ItemId.BombBagAndBombs,
  ItemId.Boomerang,
  ItemId.EmptyBottle,
  ItemId.GateKeys,
  ItemId.GiantBombBag,
  ItemId.Hawkeye,
  ItemId.HorseCall,
  ItemId.HylianShield,
  ItemId.IronBoots,
  ItemId.Lantern,
  ItemId.MagicArmor,
  ItemId.OrdonShield,
  ItemId.ProgressiveBow,
  ItemId.ProgressiveClawshot,
  ItemId.ProgressiveDominionRod,
  ItemId.ProgressiveFishingRod,
  ItemId.ProgressiveHiddenSkill,
  ItemId.ProgressiveSkyBook,
  ItemId.ProgressiveSword,
  ItemId.ShadowCrystal,
  ItemId.Slingshot,
  ItemId.Spinner,
  ItemId.ZoraArmor,
];

export type StartingItemField = {
  itemId: ItemId;
  count?: number;
};

export type ExcludedCheckField = {
  checkId: CheckId;
};

export type FormSchema = {
  list: StartingItemField[];
  // Note react-hook-form requires field arrays to be arrays of objects. This is
  // why `excludedChecks` is not simply an array of CheckId.
  excludedChecks: ExcludedCheckField[];
  exBool: boolean;
};

export type ItemIdRecord<T> = {
  [key in ItemId]?: T;
};
