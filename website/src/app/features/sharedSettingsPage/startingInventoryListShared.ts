export type LeftData = {
  index: number;
  name: string;
};

type StartingItemDef = {
  max?: number;
  onSubtext?(count: number): string;
};

export const startingItemDefs: Record<string, StartingItemDef> = {
  'Shadow Crystal': {},
  'Progressive Sword': { max: 4 },
  Boomerang: {},
  Lantern: {},
  Slingshot: {},
  'Progressive Fishing Rod': { max: 2 },
  'Iron Boots': {},
  'Progressive Bow': { max: 3 },
  'Bomb Bag and Bombs': { max: 3 },
  'Giant Bomb Bag': {},
  'Zora Armor': {},
  'Progressive Clawshot': { max: 2 },
  "Auru's Memo": {},
  "Ashei's Sketch": {},
  Spinner: {},
  'Ball and Chain': {},
  'Progressive Dominion Rod': { max: 2 },
  'Progressive Sky Book': {
    max: 7,
    onSubtext(count: number) {
      if (count > 0) {
        return `Sky Book and ${count - 1}/6 characters`;
      }
      return '';
    },
  },
  'Horse Call': {},
  'Gate Keys': {},
  'Empty Bottle': {},
  'Progressive Hidden Skill': { max: 7 },
  'Magic Armor': {},
  'Ordon Shield': {},
  'Hylian Shield': {},
  Hawkeye: {},
};
