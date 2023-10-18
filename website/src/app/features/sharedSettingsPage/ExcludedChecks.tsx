'use client';

// import { FixedSizeList as List } from 'react-window';

// type RowProps = {
//   index: number;
//   style: React.CSSProperties;
// };

// function Row({ index, style }: RowProps) {
//   return <div style={style}>Row {index}</div>;
// }

// function ExcludedChecks() {
//   return (
//     <div>
//       <List
//         height={500}
//         itemCount={1000}
//         itemSize={35}
//         width={300}
//       >
//         {Row}
//       </List>
//     </div>
//   );
// }

// export default ExcludedChecks;

import { Virtuoso } from 'react-virtuoso';
import { excludedChecksList } from './excludedChecksList';

type RowProps = {
  index: number;
};

function Row({ index }: RowProps) {
  return (
    <div>
      <input type="checkbox" />
      <span>{`${index} ${excludedChecksList[index]}`}</span>
    </div>
  );
}

function ExcludedChecks() {
  return (
    <div className="flex">
      <Virtuoso
        style={{ height: '400px' }}
        className="flex-1"
        totalCount={excludedChecksList.length}
        // itemContent={index => <div>{`${index} ${excludedChecksList[index]}`}</div>}
        itemContent={index => <Row index={index} />}
      />
      <Virtuoso
        style={{ height: '400px' }}
        className="flex-1"
        totalCount={excludedChecksList.length}
        itemContent={index => <div>{`${index} ${excludedChecksList[index]}`}</div>}
      />
    </div>
  );
}

export default ExcludedChecks;
