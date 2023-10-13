'use client';

import { useMemo, useState } from 'react';
import type { ItemId, StartingItemField, ItemIdRecord } from './startingInventoryListShared';
import { startingItemDefs, startingItemDefsOrder } from './startingInventoryListShared';
import Button from '@mui/material/Button';
import { ChevronRight } from '@mui/icons-material';
import { Checkbox } from '@mui/material';

type StartingInventoryListLeftProps = {
  data: ItemId[];
  onAdd(selected: StartingItemField[]): void;
};

function StartingInventoryListLeft({ data, onAdd }: StartingInventoryListLeftProps) {
  const [selected, setSelected] = useState<ItemIdRecord<boolean>>({});
  const [searchText, setSearchText] = useState('');

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
      <div className="flex items-center full-width">
        {numSelected > 0 && <span className="ml-1 text-sm">{`${numSelected} selected`}</span>}
        <Button
          variant="contained"
          disableElevation
          disabled={numSelected < 1}
          endIcon={<ChevronRight />}
          sx={{
            marginLeft: 'auto',
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
      <div className="flex items-center mb-1 w-full">
        <Checkbox sx={{ marginLeft: '-8px' }} />
        <input
          type="text"
          placeholder="Search"
          className="px-2 ml-1 flex-1 min-w-0"
          style={{ color: '#000' }}
          value={searchText}
          onChange={e => {
            setSearchText(e.target.value);
          }}
        />
      </div>
      <div>
        {data
          .filter(itemId => {
            const itemDef = startingItemDefs[itemId];
            if (!itemDef) {
              return false;
            }
            return itemDef.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
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
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="mr-2"
                />
                <span className="mr-1">{startingItemDef.name}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StartingInventoryListLeft;
