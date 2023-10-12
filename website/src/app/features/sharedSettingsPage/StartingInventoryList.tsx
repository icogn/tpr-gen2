'use client';

import { useEffect, useMemo, useState } from 'react';
import StartingInventoryListLeft from './StartingInventoryListLeft';
import StartingInventoryListRight from './StartingInventoryListRight';
import type { FormSchema } from './startingInventoryListShared';
import { ItemId } from './startingInventoryListShared';
import { startingItemDefsOrder } from './startingInventoryListShared';
import type { useForm } from 'react-hook-form';

type StartingInventoryListProps = {
  useFormRet: ReturnType<typeof useForm<FormSchema>>;
};

function StartingInventoryList({ useFormRet }: StartingInventoryListProps) {
  const watchList = useFormRet.watch('list');

  console.log('watchList');
  console.log(watchList);

  const [selectedIndexes, setSelectedIndexes] = useState<Record<number, boolean>>({
    [ItemId.Hawkeye]: true,
  });

  useEffect(() => {
    setTimeout(() => {
      useFormRet.setValue('list', [ItemId.AurusMemo]);
    }, 2000);
  }, []);

  // right list - state is ordered list of which itemIds are in the list, as
  // well as state for certain rows.

  // The parsed settings will be a single array with multiple of some itemIds.
  // This gets passed down to the root list.

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
