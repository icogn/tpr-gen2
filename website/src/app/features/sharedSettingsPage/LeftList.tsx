import { Virtuoso } from 'react-virtuoso';
import ListBtnRow from './ListBtnRow';
import { useMemo, useState } from 'react';

type LeftListProps = {
  numRows: number;
  getRowId(index: number): string;
  onSubmit(selectedRowIds: Record<string, boolean>): void;
};

function LeftList({ numRows, getRowId, onSubmit }: LeftListProps) {
  const [checkedRows, setCheckedRows] = useState<Record<string, boolean>>({});

  const totalSelected = useMemo(() => {
    return Object.keys(checkedRows).reduce((acc, rowId) => {
      if (checkedRows[rowId]) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [checkedRows]);

  return (
    <div className="flex-1">
      <ListBtnRow
        isAdd
        onBtnClick={() => {
          onSubmit(checkedRows);
        }}
        totalSelected={totalSelected}
      />
      <Virtuoso
        style={{ height: '400px' }}
        totalCount={numRows}
        itemContent={index => {
          const rowId = getRowId(index);
          return (
            <Row
              index={index}
              checked={Boolean(checkedRows[rowId])}
              onClick={() => {
                setCheckedRows({
                  ...checkedRows,
                  [rowId]: !checkedRows[rowId],
                });
              }}
            />
          );
        }}
      />
    </div>
  );
}

type RowProps = {
  index: number;
  checked: boolean;
  onClick(): void;
};

function Row({ index, checked, onClick }: RowProps) {
  return (
    <div onClick={onClick}>
      <input
        type="checkbox"
        checked={checked}
        readOnly
      />
      {/* <span>{`${index} ${excludedChecksList[index]}`}</span> */}
      <span>{`${index}`}</span>
    </div>
  );
}

export default LeftList;
