'use client';

import { useMemo, useState } from 'react';
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
  const {
    formState: { errors },
    getValues,
  } = useFormRet;
  const { fields, remove } = useFieldArrayRet;

  console.log('fields');
  console.log(fields);

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const numSelected = useMemo(() => {
    return Object.keys(selected).reduce((acc, key) => {
      if (selected[key]) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [selected]);

  return (
    <div className="border p-3">
      <Button
        variant="contained"
        disableElevation
        disabled={numSelected < 1}
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

          let currentError = '';
          let maxValue = 0;
          let shouldRenderInput = false;
          let subtext = '';

          if (startingItemDef.onSubtext) {
            let val = getValues(`list.${index}.count`);
            if (val == null) {
              val = 1;
            }
            subtext = startingItemDef.onSubtext(val);
          }

          if (startingItemDef.max != null) {
            shouldRenderInput = true;
            maxValue = startingItemDef.max;
            if (errors?.list?.[index]?.count?.message) {
              currentError = errors?.list?.[index]?.count?.message || '';
            }
          }

          return (
            <div
              key={id}
              className={clsx('border px-1', styles.anim)}
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
              <div className={'flex items-center'}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="mr-2"
                />
                <span className="mr-1">{startingItemDef.name}</span>
                {shouldRenderInput && (
                  <>
                    <input
                      type="number"
                      className={clsx('ml-auto text-sm', styles.startingItemNumInput)}
                      {...useFormRet.register(`list.${index}.count`, {
                        min: {
                          value: 1,
                          message: 'Min is 1',
                        },
                        max: {
                          value: maxValue,
                          message: `Max is ${maxValue}`,
                        },
                        required: 'Required',
                      })}
                      min={1}
                      max={startingItemDef.max}
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    />
                  </>
                )}
              </div>
              {currentError && <span style={{ color: 'pink' }}>{currentError}</span>}
              {!currentError && subtext && <span>{subtext}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StartingInventoryListRight;
