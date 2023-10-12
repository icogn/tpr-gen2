'use client';

import { useState } from 'react';
import type { ItemId, StartingItemField, ItemIdRecord } from './startingInventoryListShared';
import { startingItemDefs, startingItemDefsOrder } from './startingInventoryListShared';
import Button from '@mui/material/Button';

type StartingInventoryListLeftProps = {
  data: ItemId[];
  onAdd(selected: StartingItemField[]): void;
};

function StartingInventoryListLeft({ data, onAdd }: StartingInventoryListLeftProps) {
  const [selected, setSelected] = useState<ItemIdRecord<boolean>>({});

  return (
    <div className="border p-3">
      <Button
        variant="contained"
        disableElevation
        sx={{
          marginBottom: '8px',
        }}
        onClick={() => {
          // Order should match what it looked like on the left side once added
          // to the right.
          const itemFields: StartingItemField[] = [];

          startingItemDefsOrder.forEach(itemId => {
            if (selected[itemId]) {
              itemFields.push({ itemId });
            }
          });

          onAdd(itemFields);
          setSelected({});
        }}
      >
        Add
      </Button>
      <div>
        {data
          .filter(itemId => {
            return startingItemDefs[itemId];
          })
          .map(itemId => {
            const isSelected = Boolean(selected[itemId]);
            const startingItemDef = startingItemDefs[itemId]!;

            return (
              <div
                key={itemId}
                className="border"
                style={{
                  userSelect: 'none',
                  backgroundColor: isSelected ? '#cc0000' : undefined,
                }}
                onClick={() => {
                  setSelected({
                    ...selected,
                    [itemId]: !selected[itemId],
                  });
                }}
              >
                {startingItemDef.name}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StartingInventoryListLeft;
