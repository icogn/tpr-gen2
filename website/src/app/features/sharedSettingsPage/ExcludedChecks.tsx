'use client';

import { FixedSizeList as List } from 'react-window';

type RowProps = {
  index: number;
  style: React.CSSProperties;
};

function Row({ index, style }: RowProps) {
  return <div style={style}>Row {index}</div>;
}

function ExcludedChecks() {
  return (
    <div>
      <List
        height={500}
        itemCount={1000}
        itemSize={35}
        width={300}
      >
        {Row}
      </List>
    </div>
  );
}

export default ExcludedChecks;
