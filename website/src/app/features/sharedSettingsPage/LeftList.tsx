import { Virtuoso } from 'react-virtuoso';
import ListBtnRow from './ListBtnRow';
import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Checkbox } from '@mui/material';
import Select, { type SingleValue } from 'react-select';

export type LeftListFilters = {
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
  filteredEntityIds: string[] | number[];
  // filteredEntityIds: string[];
  onSubmit(selectedRowIds: Record<string, boolean>): void;
  // onFiltersChange(search: string): void;
  onRenderRowIndex: OnRenderRowIndex;
  filters: LeftListFilters;
  onFiltersChange(filters: LeftListFilters): void;
  selectOptions?: SelectOption[];
  invisibleSelectRow?: boolean;
};

function LeftList({
  isAdd,
  totalRenderedRows,
  filteredEntityIds,
  onSubmit,
  onRenderRowIndex,
  filters,
  onFiltersChange,
  selectOptions = [],
  invisibleSelectRow = false,
}: LeftListProps) {
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});

  // TODO: allow for right content rendering so that this component can be used
  // for left and right side lists

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

  return (
    <div className="flex-1">
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
        style={{ height: '400px' }}
        totalCount={totalRenderedRows}
        itemContent={index => {
          return onRenderRowIndex({ index, checkedRows, updateChecked });
        }}
      />
    </div>
  );
}

type RowProps = {
  text?: string;
  checked: boolean;
  onClick(): void;
};

export function LeftListRow({ text = '', checked, onClick }: RowProps) {
  return (
    <div
      onClick={onClick}
      style={{ userSelect: 'none' }}
    >
      <input
        type="checkbox"
        checked={checked}
        readOnly
      />
      <span>{text}</span>
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

export type SelectOption = {
  value: string;
  label: string;
};

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

export default LeftList;
