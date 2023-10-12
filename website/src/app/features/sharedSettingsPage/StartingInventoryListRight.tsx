'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import type { FormSchema } from './startingInventoryListShared';
import { startingItemDefs } from './startingInventoryListShared';
import type { UseFormReturn } from 'react-hook-form';
import { type UseFieldArrayReturn } from 'react-hook-form';
import styles from './SharedSettingsPage.module.css';
import clsx from 'clsx';

type StartingInventoryListRightProps = {
  useFormRet: UseFormReturn<FormSchema>;
  useFieldArrayRet: UseFieldArrayReturn<FormSchema, 'list'>;
};

function StartingInventoryListRight({
  useFormRet,
  useFieldArrayRet,
}: StartingInventoryListRightProps) {
  const { fields, remove } = useFieldArrayRet;

  console.log('fields');
  console.log(fields);

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  return (
    <div className="border p-3">
      <Button
        variant="contained"
        disableElevation
        sx={{
          marginBottom: '8px',
        }}
        onClick={() => {
          const toRemove: number[] = [];

          fields.forEach(({ id }, index) => {
            if (selected[id]) {
              toRemove.push(index);
            }
          });

          remove(toRemove);
          setSelected({});
        }}
      >
        Remove
      </Button>
      <div>
        {fields.map(({ itemId, id }, index) => {
          const isSelected = Boolean(selected[id]);
          const startingItemDef = startingItemDefs[itemId]!;

          return (
            <div
              key={id}
              className={clsx('border px-1 flex items-center', styles.anim)}
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
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="mr-2"
              />
              <span className="mr-1">{startingItemDef.name}</span>
              {startingItemDef.max != null && (
                <input
                  type="number"
                  className={clsx('ml-auto text-sm', styles.startingItemNumInput)}
                  {...useFormRet.register(`list.${index}.count`)}
                  min={1}
                  max={startingItemDef.max}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StartingInventoryListRight;
