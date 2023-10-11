'use client';

import { useState } from 'react';
import type { LeftData } from './startingInventoryListShared';
import Button from '@mui/material/Button';

type StartingInventoryListLeftProps = {
  data: LeftData[];
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
        {data.map(({ index, name }) => {
          const isSelected = Boolean(selected[index]);

          return (
            <div
              key={index}
              className="border"
              style={{
                userSelect: 'none',
                backgroundColor: isSelected ? '#cc0000' : undefined,
              }}
              onClick={() => {
                setSelected({
                  ...selected,
                  [index]: !selected[index],
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
