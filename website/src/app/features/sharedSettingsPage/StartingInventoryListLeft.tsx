'use client';

import { useState } from 'react';
import type { StartingItemFullDef } from './startingInventoryListShared';
import Button from '@mui/material/Button';

type StartingInventoryListLeftProps = {
  data: StartingItemFullDef[];
  onAdd(selected: Record<number, boolean>): void;
};

function StartingInventoryListLeft({ data, onAdd }: StartingInventoryListLeftProps) {
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
          onAdd(selected);
          setSelected({});
        }}
      >
        Add
      </Button>
      <div>
        {data.map(({ id, name }) => {
          const isSelected = Boolean(selected[id]);

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
                  [id]: !selected[id],
                });
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StartingInventoryListLeft;
