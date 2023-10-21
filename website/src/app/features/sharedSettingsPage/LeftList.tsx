import { Virtuoso } from 'react-virtuoso';
import ListBtnRow from './ListBtnRow';
import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Checkbox } from '@mui/material';

type UpdateCheckedEntities = (checkIds: string | string[], checked: boolean) => void;

type OnRenderRowIndexParam = {
  index: number;
  checkedRows: Record<string, boolean>;
  updateChecked: UpdateCheckedEntities;
};

type OnRenderRowIndex = (param: OnRenderRowIndexParam) => React.ReactNode;

type LeftListProps = {
  // Note `totalRenderedRows` is the number of rows which will be rendered in
  // the list. This does necessarily equal the number of base entities in the
  // list since we might render rows which do not correspond one-to-one with the
  // entities. For example, 9 grouped rows might be 9 rows + 1 header row above
  // the group. In that case, this value would be 10 since that is how many rows
  // we render.
  totalRenderedRows: number;
  // filteredEntityIds: string[];
  onSubmit(selectedRowIds: Record<string, boolean>): void;
  // onFiltersChange(search: string): void;
  onRenderRowIndex: OnRenderRowIndex;
};

function LeftList({ totalRenderedRows, onSubmit, onRenderRowIndex }: LeftListProps) {
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  // TODO: checkbox and search row

  // TODO: ability to add

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

  // useMemo(() => {

  // }, [allEntityIds]);

  // const { indeterminateChecked, allChecked } = useMemo(() => {
  //   let numFilteredSelected = 0;

  //   for (let i = 0; i < allEntityIds.length; i++) {
  //     const entityId = allEntityIds[i];
  //     if (checkedRows[entityId]) {
  //       numFilteredSelected += 0;
  //     }
  //   }

  //   const filtered = data.filter(itemId => {
  //     const itemDef = startingItemDefs[itemId];
  //     if (!itemDef) {
  //       return false;
  //     }
  //     if (itemDef.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
  //       if (selected[itemId]) {
  //         numFilteredSelected += 1;
  //       }
  //       return true;
  //     }
  //   });

  //   const allChecks = allEntityIds.length === numFilteredSelected && numFilteredSelected > 0;

  //   return {
  //     filteredData: filtered,
  //     indeterminateChecked: !allChecks && numFilteredSelected > 0,
  //     allChecked: allChecks,
  //   };
  // }, [data, selected, searchText]);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch],
  );

  const updateChecked: UpdateCheckedEntities = useCallback(
    (ids: string | string[], checked: boolean) => {
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

  return (
    <div className="flex-1">
      <ListBtnRow
        isAdd
        onBtnClick={() => {
          onSubmit(checkedRows);
          setCheckedRows({});
        }}
        totalSelected={totalSelected}
      />
      <SearchRow
        search={search}
        onSearchChange={handleSearchChange}
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
};

function SearchRow({ search, onSearchChange }: SearchRowProps) {
  return (
    <div className="flex items-center mb-1 w-full">
      <Checkbox
        sx={{ marginLeft: '-8px' }}
        // indeterminate={indeterminateChecked}
        // checked={indeterminateChecked || allChecked}
        // onChange={e => {
        //   console.log('e.target.checked');
        //   console.log(e.target.checked);

        //   const diff: ItemIdRecord<boolean> = {};
        //   filteredData.forEach(itemId => {
        //     diff[itemId] = e.target.checked;
        //   });

        //   setSelected({
        //     ...selected,
        //     ...diff,
        //   });
        // }}
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

export default LeftList;
