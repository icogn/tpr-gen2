'use client';

import { useMemo, useState } from 'react';
import StartingInventoryListLeft from './StartingInventoryListLeft';
import StartingInventoryListRight from './StartingInventoryListRight';
import type { LeftData } from './startingInventoryListTypes';

const startingInventory = [
  'Shadow Crystal',
  'Progressive Sword',
  'Boomerang',
  'Lantern',
  'Slingshot',
  'Progressive Fishing Rod',
  'Iron Boots',
  'Progressive Bow',
  'Bomb Bag and Bombs',
  'Giant Bomb Bag',
  'Zora Armor',
  'Progressive Clawshot',
  "Auru's Memo",
  "Ashei's Sketch",
  'Spinner',
  'Ball and Chain',
  'Progressive Dominion Rod',
  'Progressive Sky Book',
  'Horse Call',
  'Gate Keys',
  'Empty Bottle',
  'Progressive Hidden Skill',
  'Magic Armor',
  'Ordon Shield',
  'Hylian Shield',
  'Hawkeye',
];

function StartingInventoryList() {
  const [selectedIndexes, setSelectedIndexes] = useState<Record<number, boolean>>({ 3: true });

  const [leftData, rightData] = useMemo(() => {
    const left: LeftData[] = [];
    const right: LeftData[] = [];

    for (let i = 0; i < startingInventory.length; i++) {
      const obj = {
        index: i,
        name: startingInventory[i],
      };
      if (selectedIndexes[i]) {
        right.push(obj);
      } else {
        left.push(obj);
      }
    }

    return [left, right];
  }, [selectedIndexes]);

  const handleAdd = (selected: Record<number, boolean>) => {
    setSelectedIndexes({
      ...selectedIndexes,
      ...selected,
    });
  };

  const handleRemove = (deselected: Record<number, boolean>) => {
    const newSelectedIndexes: Record<number, boolean> = {};

    Object.keys(selectedIndexes).forEach((idxStr: string) => {
      const index = parseInt(idxStr, 10);
      if (!deselected[index]) {
        newSelectedIndexes[index] = true;
      }
    });

    setSelectedIndexes(newSelectedIndexes);
  };

  return (
    <div className="flex">
      <StartingInventoryListLeft
        data={leftData}
        onAdd={handleAdd}
      />
      <StartingInventoryListRight
        data={rightData}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default StartingInventoryList;
