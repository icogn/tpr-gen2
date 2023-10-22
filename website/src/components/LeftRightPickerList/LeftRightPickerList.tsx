import { Virtuoso } from 'react-virtuoso';
import ListBtnRow from './ListBtnRow';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox } from '@mui/material';
import Select, { type SingleValue } from 'react-select';
import { usePreviousDistinct } from 'react-use';
import type { SelectOption } from '@/types/commonTypes';
import styles from './LeftRightPickerList.module.css';
import clsx from 'clsx';

const staticObj = {};

export type LeftRightPickerListFilters = {
  search: string;
  selectVal: SingleValue<SelectOption>;
};

type UpdateCheckedEntities = (
  entityIds: string | string[] | number | number[],
  checked: boolean,
) => void;

type OnRenderRowIndexParam = {
  index: number;
  checkedRows: Record<string, boolean>;
  updateChecked: UpdateCheckedEntities;
  canAnimNewEntityIds: Record<string, boolean>;
};

type OnRenderRowIndex = (param: OnRenderRowIndexParam) => React.ReactNode;

type LeftListProps = {
  isAdd: boolean;
  // Note `totalRenderedRows` is the number of rows which will be rendered in
  // the list. This does necessarily equal the number of base entities in the
  // list since we might render rows which do not correspond one-to-one with the
  // entities. For example, 9 grouped rows might be 9 rows + 1 header row above
  // the group. In that case, this value would be 10 since that is how many rows
  // we render.
  totalRenderedRows: number;
  unfilteredEntityIds: string[] | number[];
  filteredEntityIds: string[] | number[];
  // filteredEntityIds: string[];
  onSubmit(selectedRowIds: Record<string, boolean>): void;
  // onFiltersChange(search: string): void;
  onRenderRowIndex: OnRenderRowIndex;
  filters: LeftRightPickerListFilters;
  onFiltersChange(filters: LeftRightPickerListFilters): void;
  selectOptions?: SelectOption[];
  invisibleSelectRow?: boolean;
  computeRowKey?(index: number): React.Key;
};

function LeftRightPickerList({
  isAdd,
  totalRenderedRows,
  unfilteredEntityIds,
  filteredEntityIds,
  onSubmit,
  onRenderRowIndex,
  filters,
  onFiltersChange,
  selectOptions = [],
  invisibleSelectRow = false,
  computeRowKey = undefined,
}: LeftListProps) {
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});
  const preventAnims = useRef(true);

  // TODO: allow for right content rendering so that this component can be used
  // for left and right side lists

  const prevFields = usePreviousDistinct(unfilteredEntityIds, (prev, next) => {
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
      if (prevVal !== nextVal) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    preventAnims.current = true;
  }, [filters]);

  const newestEntityIds = useMemo(() => {
    if (prevFields && unfilteredEntityIds.length > prevFields.length) {
      preventAnims.current = false;

      const oldFieldIds: Record<string, boolean> = {};
      if (prevFields) {
        prevFields.forEach(id => {
          oldFieldIds[id] = true;
        });
      }

      const res: Record<string, boolean> = {};
      unfilteredEntityIds.forEach(id => {
        if (!oldFieldIds[id]) {
          res[id] = true;
        }
      });
      return res;
    }

    return {};
  }, [prevFields, unfilteredEntityIds]);

  const totalSelected = useMemo(() => {
    return Object.keys(checkedRows).reduce((acc, rowId) => {
      if (checkedRows[rowId]) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [checkedRows]);

  const { indeterminateChecked, allChecked } = useMemo(() => {
    let numChecked = 0;

    filteredEntityIds.forEach(id => {
      if (checkedRows[id]) {
        numChecked += 1;
      }
    });

    const allChecks = filteredEntityIds.length === numChecked && numChecked > 0;

    return {
      indeterminateChecked: !allChecks && numChecked > 0,
      allChecked: allChecks,
    };
  }, [filteredEntityIds, checkedRows]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({
        ...filters,
        search: e.target.value,
      });
    },
    [filters, onFiltersChange],
  );

  const handleSelectChange = useCallback(
    (newVal: SingleValue<SelectOption>) => {
      onFiltersChange({
        ...filters,
        selectVal: newVal,
      });
    },
    [filters, onFiltersChange],
  );

  const updateChecked: UpdateCheckedEntities = useCallback(
    (ids: string | string[] | number | number[], checked: boolean) => {
      if (Array.isArray(ids)) {
        const diff: Record<string, boolean> = {};

        ids.forEach(id => {
          diff[id] = checked;
        });

        setCheckedRows(currVal => ({
          ...currVal,
          ...diff,
        }));
      } else {
        setCheckedRows(currVal => ({
          ...currVal,
          [ids]: checked,
        }));
      }
    },
    [setCheckedRows],
  );

  const handleCheckChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const diff: Record<string, boolean> = {};
      filteredEntityIds.forEach(id => {
        diff[id] = checked;
      });

      setCheckedRows(currVal => ({
        ...currVal,
        ...diff,
      }));
    },
    [setCheckedRows, filteredEntityIds],
  );

  const handleScroll = useCallback(() => {
    preventAnims.current = true;
  }, []);

  // Only apply `computeItemKey` prop when not undefined. React Virtuoso is not
  // happy if we explicitly set the prop value to undefined.
  const otherVirtuosoProps = computeRowKey ? { computeItemKey: computeRowKey } : {};

  return (
    <div className={clsx('flex-1', !isAdd && styles.rightList)}>
      <ListBtnRow
        isAdd={isAdd}
        onBtnClick={() => {
          onSubmit(checkedRows);
          setCheckedRows({});
        }}
        totalSelected={totalSelected}
      />
      {invisibleSelectRow && <SelectRow invisible />}
      {!invisibleSelectRow && selectOptions?.length > 0 && (
        <SelectRow
          value={filters.selectVal}
          options={selectOptions}
          onChange={handleSelectChange}
        />
      )}
      <SearchRow
        search={filters.search}
        onSearchChange={handleSearchChange}
        indeterminateChecked={indeterminateChecked}
        allChecked={allChecked}
        onCheckChange={handleCheckChange}
      />
      <Virtuoso
        {...otherVirtuosoProps}
        onScroll={handleScroll}
        style={{ height: '400px' }}
        totalCount={totalRenderedRows}
        className={styles.listRoot}
        itemContent={index => {
          return onRenderRowIndex({
            index,
            checkedRows,
            updateChecked,
            canAnimNewEntityIds: preventAnims.current ? staticObj : newestEntityIds,
          });
        }}
      />
    </div>
  );
}

type SearchRowProps = {
  search: string;
  onSearchChange(e: ChangeEvent<HTMLInputElement>): void;
  indeterminateChecked: boolean;
  allChecked: boolean;
  onCheckChange(e: ChangeEvent<HTMLInputElement>, checked: boolean): void;
};

function SearchRow({
  search,
  onSearchChange,
  indeterminateChecked,
  allChecked,
  onCheckChange,
}: SearchRowProps) {
  return (
    <div className="flex items-center mb-1 w-full">
      <Checkbox
        sx={{ marginLeft: '-8px' }}
        indeterminate={indeterminateChecked}
        checked={indeterminateChecked || allChecked}
        onChange={onCheckChange}
      />
      <input
        type="text"
        placeholder="Search"
        className="px-2 ml-1 flex-1 min-w-0"
        style={{ color: '#000' }}
        value={search}
        onChange={onSearchChange}
      />
    </div>
  );
}

type SelectRowProps = {
  value?: SingleValue<SelectOption>;
  options?: SelectOption[];
  onChange?(value: SingleValue<SelectOption>): void;
  invisible?: boolean;
};

const emptyList: SelectOption[] = [];
const noop = () => {};

function SelectRow({
  value = null,
  options = emptyList,
  onChange = noop,
  invisible = false,
}: SelectRowProps) {
  return (
    <div
      className="pb-1"
      style={invisible ? { visibility: 'hidden' } : undefined}
    >
      <Select
        value={value}
        options={options}
        onChange={onChange}
        className="my-react-select-container"
        classNamePrefix="my-react-select"
        placeholder="(All)"
        isClearable
      />
    </div>
  );
}

export default LeftRightPickerList;
