'use client';

import { useMemo, useState } from 'react';
import type { ItemId, StartingItemField, ItemIdRecord } from './startingInventoryListShared';
import { startingItemDefs, startingItemDefsOrder } from './startingInventoryListShared';
import Button from '@mui/material/Button';
import { ChevronRight } from '@mui/icons-material';

type StartingInventoryListLeftProps = {
  data: ItemId[];
  onAdd(selected: StartingItemField[]): void;
};

function StartingInventoryListLeft({ data, onAdd }: StartingInventoryListLeftProps) {
  const [selected, setSelected] = useState<ItemIdRecord<boolean>>({});

  const numSelected = useMemo(() => {
    return Object.keys(selected).reduce((acc, key) => {
      const itemId = parseInt(key, 10) as ItemId;
      if (selected[itemId]) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [selected]);

  return (
    <div className="border p-3">
      <div className="flex items-center justify-end full-width">
        <Button
          variant="contained"
          disableElevation
          disabled={numSelected < 1}
          endIcon={<ChevronRight />}
          sx={{
            marginBottom: '8px',
          }}
          onClick={() => {
            // Order should match what it looked like on the left side once added
            // to the right.
            const itemFields: StartingItemField[] = [];

            startingItemDefsOrder.forEach(itemId => {
              if (selected[itemId]) {
                const obj: StartingItemField = { itemId };
                const startingItemDef = startingItemDefs[itemId]!;
                if (startingItemDef.max) {
                  obj.count = 1;
                }

                itemFields.push(obj);
              }
            });

            onAdd(itemFields);
            setSelected({});
          }}
        >
          Add
        </Button>
      </div>
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
                className="border px-1"
                style={{
                  userSelect: 'none',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : undefined,
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
