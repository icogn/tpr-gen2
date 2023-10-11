'use client';

import { useMemo, useState } from 'react';
import StartingInventoryListLeft from './StartingInventoryListLeft';
import StartingInventoryListRight from './StartingInventoryListRight';
import { ItemId } from './startingInventoryListShared';
import { startingItemDefsOrder } from './startingInventoryListShared';

function StartingInventoryList() {
  const [selectedIndexes, setSelectedIndexes] = useState<Record<number, boolean>>({
    [ItemId.Hawkeye]: true,
  });

  const [leftData, rightData] = useMemo(() => {
    const left: ItemId[] = [];
    const right: ItemId[] = [];

    startingItemDefsOrder.forEach((itemId: ItemId) => {
      if (selectedIndexes[itemId]) {
        right.push(itemId);
      } else {
        left.push(itemId);
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
