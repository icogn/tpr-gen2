'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import type { FormSchema } from './startingInventoryListShared';
import { startingItemDefs } from './startingInventoryListShared';
import type { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { type UseFieldArrayReturn } from 'react-hook-form';
import styles from './SharedSettingsPage.module.css';
import clsx from 'clsx';
import { ChevronLeft } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { usePrevious, usePreviousDistinct } from 'react-use';

type FilteredItem = {
  fieldIndex: number;
  field: FieldArrayWithId<FormSchema, 'list', 'id'>;
};

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

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [searchText, setSearchText] = useState('');
  const preventAnims = useRef(true);

  const prevFields = usePreviousDistinct(fields, (prev, next) => {
    const prevIsArray = Array.isArray(prev);
    const nextIsArray = Array.isArray(next);

    if (prevIsArray !== nextIsArray) {
      return false;
    } else if (!prevIsArray) {
      return prev === next;
    }

    const prevArr = prev!;
    const nextArr = next!;

    if (prevArr.length !== nextArr.length) {
      return false;
    }

    for (let i = 0; i < prevArr.length; i++) {
      const prevVal = prevArr[i];
      const nextVal = nextArr[i];
      if (prevVal.id !== nextVal.id) {
        return false;
      }
    }

    return true;
  });
  const prevSearchText = usePrevious(searchText);

  // Can only play anims if filters haven't changed. Once filters change, we
  // cannot play anims again until fields are added (size increases). And then,
  // we can only play anims for fields which are new.
  useEffect(() => {
    if (searchText !== prevSearchText) {
      preventAnims.current = true;
    }
  }, [searchText, prevSearchText]);

  const fieldIdsCanAnim = useMemo(() => {
    if (prevFields && fields.length > prevFields.length) {
      preventAnims.current = false;

      const oldFieldIds: Record<string, boolean> = {};
      if (prevFields) {
        prevFields.forEach(({ id }) => {
          oldFieldIds[id] = true;
        });
      }

      const res: Record<string, boolean> = {};
      fields.forEach(({ id }) => {
        if (!oldFieldIds[id]) {
          res[id] = true;
        }
      });
      return res;
    }

    return {};
  }, [fields, prevFields]);

  const totalSelected = useMemo(() => {
    return Object.keys(selected).reduce((acc, key) => {
      if (selected[key]) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [selected]);

  const { filteredData, indeterminateChecked, allChecked } = useMemo(() => {
    let numFilteredSelected = 0;

    const filtered: FilteredItem[] = [];

    fields.forEach((entry, index) => {
      const { itemId, id } = entry;
      const itemDef = startingItemDefs[itemId];
      if (!itemDef) {
        return;
      }
      if (itemDef.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
        if (selected[id]) {
          numFilteredSelected += 1;
        }
        filtered.push({
          fieldIndex: index,
          field: entry,
        });
      }
    });

    const allChecks = filtered.length === numFilteredSelected && numFilteredSelected > 0;

    return {
      filteredData: filtered,
      indeterminateChecked: !allChecks && numFilteredSelected > 0,
      allChecked: allChecks,
    };
  }, [fields, selected, searchText]);

  return (
    <div className="border p-3">
      <div className="flex items-center full-width">
        <Button
          variant="contained"
          disableElevation
          disabled={totalSelected < 1}
          startIcon={<ChevronLeft />}
          sx={{
            marginRight: 'auto',
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
        {totalSelected > 0 && <span className="ml-1 text-sm">{`${totalSelected} selected`}</span>}
      </div>
      <div className="flex items-center mb-1 w-full">
        <Checkbox
          sx={{ marginLeft: '-8px' }}
          indeterminate={indeterminateChecked}
          checked={indeterminateChecked || allChecked}
          onChange={e => {
            console.log('e.target.checked');
            console.log(e.target.checked);

            const diff: Record<string, boolean> = {};
            filteredData.forEach(({ field: { id } }) => {
              diff[id] = e.target.checked;
            });

            setSelected({
              ...selected,
              ...diff,
            });
          }}
        />
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
        {filteredData.map(({ fieldIndex: index, field: { itemId, id } }) => {
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

          const showAnim = !preventAnims.current && Boolean(fieldIdsCanAnim[id]);

          return (
            <div
              key={id}
              className={clsx('border px-1', showAnim && styles.anim)}
              style={{
                userSelect: 'none',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : undefined,
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
                        valueAsNumber: true,
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
              {!currentError && subtext && <span className="text-sm">{subtext}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StartingInventoryListRight;
