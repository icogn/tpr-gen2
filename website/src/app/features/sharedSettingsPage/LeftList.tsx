import { Virtuoso } from 'react-virtuoso';
import ListBtnRow from './ListBtnRow';
import { useMemo, useState } from 'react';

type LeftListProps = {
  numRows: number;
  getRowInfo(index: number): { id: string; text?: string };
  onSubmit(selectedRowIds: Record<string, boolean>): void;
};

function LeftList({ numRows, getRowInfo, onSubmit }: LeftListProps) {
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
          setCheckedRows({});
        }}
        totalSelected={totalSelected}
      />
      <Virtuoso
        style={{ height: '400px' }}
        totalCount={numRows}
        itemContent={index => {
          const { id, text } = getRowInfo(index);
          return (
            <Row
              text={text}
              checked={Boolean(checkedRows[id])}
              onClick={() => {
                setCheckedRows({
                  ...checkedRows,
                  [id]: !checkedRows[id],
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
  text?: string;
  checked: boolean;
  onClick(): void;
};

function Row({ text = '', checked, onClick }: RowProps) {
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

export default LeftList;
