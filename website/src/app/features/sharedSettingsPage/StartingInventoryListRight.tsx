'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import type { FormSchema } from './startingInventoryListShared';
import { startingItemDefs } from './startingInventoryListShared';
import { type UseFieldArrayReturn } from 'react-hook-form';

type StartingInventoryListRightProps = {
  useFieldArrayRet: UseFieldArrayReturn<FormSchema, 'list'>;
};

function StartingInventoryListRight({ useFieldArrayRet }: StartingInventoryListRightProps) {
  const { fields, remove } = useFieldArrayRet;

  console.log('fields');
  console.log(fields);

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
          remove();
          setSelected({});
        }}
      >
        Remove
      </Button>
      <div>
        {fields
          // .filter(({ itemId }) => {
          //   return startingItemDefs[itemId];
          // })
          .map(({ itemId, id }) => {
            const isSelected = Boolean(selected[itemId]);
            const startingItemDef = startingItemDefs[itemId]!;

            return (
              <div
                key={id}
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
