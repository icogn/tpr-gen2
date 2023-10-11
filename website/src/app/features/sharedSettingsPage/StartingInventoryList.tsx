'use client';

import { useMemo, useState } from 'react';
import StartingInventoryListLeft from './StartingInventoryListLeft';
import StartingInventoryListRight from './StartingInventoryListRight';
import type { StartingItemFullDef } from './startingInventoryListShared';
import { ItemId } from './startingInventoryListShared';
import { startingItemDefsOrder, startingItemDefs } from './startingInventoryListShared';

function StartingInventoryList() {
  const [selectedIndexes, setSelectedIndexes] = useState<Record<number, boolean>>({
    [ItemId.ProgressiveBow]: true,
  });

  const [leftData, rightData] = useMemo(() => {
    const left: StartingItemFullDef[] = [];
    const right: StartingItemFullDef[] = [];

    startingItemDefsOrder.forEach((itemId: ItemId) => {
      const startingItemDef = startingItemDefs[itemId];

      const obj = {
        ...startingItemDef,
        id: itemId,
      };
      if (selectedIndexes[itemId]) {
        right.push(obj);
      } else {
        left.push(obj);
      }
    });

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
