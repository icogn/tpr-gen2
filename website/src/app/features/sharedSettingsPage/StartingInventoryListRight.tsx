'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import { startingItemDefs, type ItemId } from './startingInventoryListShared';

type StartingInventoryListRightProps = {
  data: ItemId[];
  onRemove(deselected: Record<number, boolean>): void;
};

function StartingInventoryListRight({ data, onRemove }: StartingInventoryListRightProps) {
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  return (
    <div className="border p-3">
      <Button
        variant="contained"
        disableElevation
        sx={{
          marginBottom: '8px',
        }}
        onClick={() => {
          onRemove(selected);
          setSelected({});
        }}
      >
        Remove
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

export default StartingInventoryListRight;
