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
import { useMemo, useState } from 'react';
import clsx from 'clsx';

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

function OtherRow() {
  return <div style={{ height: '200px', backgroundColor: 'pink' }}>OtherRow</div>;
}

// type Group = {
//   checkIndexes: number[];
//   expanded: boolean;
// };

const groupDefs: { [key: string]: string[] } = {
  'Golden Wolves': [
    'Faron Woods Golden Wolf',
    'Gerudo Desert Golden Wolf',
    'Kakariko Graveyard Golden Wolf',
    'North Castle Town Golden Wolf',
    'Ordon Spring Golden Wolf',
    'Outside South Castle Town Golden Wolf',
    'West Hyrule Field Golden Wolf',
  ],
};

const selectedChecks = [
  'Uli Cradle Delivery',
  'Faron Woods Golden Wolf',
  'Gerudo Desert Golden Wolf',
  'Kakariko Graveyard Golden Wolf',
  'Agitha Female Dragonfly Reward',
  'North Castle Town Golden Wolf',
  'Ordon Spring Golden Wolf',
  'Outside South Castle Town Golden Wolf',
  'West Hyrule Field Golden Wolf',
  'Arbiters Grounds West Stalfos West Chest',
];

// type RowInfo = {
//   fieldIndex?: number;
//   groupName?: string;
//   checkIndex?: number;
// };

// type GroupInfo = {
//   groupName: string;
// };

type IndexInfo = {
  groupName?: string;
  checkName?: string;
  isSubRow?: boolean;
};

function ExcludedChecks() {
  const [expandedGroups] = useState<Record<string, boolean>>({ 'Golden Wolves': true });
  // const [expandedGroups] = useState<Record<string, boolean>>({});

  const { groupsToShow, checksInGroups } = useMemo(() => {
    const selectedChecksByName: Record<string, boolean> = {};
    selectedChecks.forEach(checkName => {
      selectedChecksByName[checkName] = true;
    });

    // const groupNames: Record<string, boolean> = {};
    const groupNames: string[] = [];
    let checkNamesInGroup: Record<string, boolean> = {};

    Object.keys(groupDefs).forEach(groupName => {
      const checksInGroup = groupDefs[groupName];
      const checkNamesInGroupDiff: Record<string, boolean> = {};

      for (let i = 0; i < checksInGroup.length; i++) {
        const checkName = checksInGroup[i];
        if (!selectedChecksByName[checkName]) {
          return;
        }
        checkNamesInGroupDiff[checkName] = true;
      }

      // Group is there.
      checkNamesInGroup = {
        ...checkNamesInGroup,
        ...checkNamesInGroupDiff,
      };
      // groupNames[groupName] = true;
      groupNames.push(groupName);
    });

    return {
      groupsToShow: groupNames,
      checksInGroups: checkNamesInGroup,
    };
  }, []);

  const { indexMapping, totalRows } = useMemo(() => {
    // Calc indexes and stuff for quick rendering.
    const idxMapping: Record<number, IndexInfo> = {};

    let currentIndex = 0;

    // Iterate over groups first
    groupsToShow.forEach(groupName => {
      idxMapping[currentIndex] = { groupName };
      currentIndex += 1;

      if (expandedGroups[groupName]) {
        groupDefs[groupName].forEach(checkName => {
          idxMapping[currentIndex] = { checkName, isSubRow: true };
          currentIndex += 1;
        });
      }
    });

    selectedChecks.forEach(checkName => {
      if (!checksInGroups[checkName]) {
        idxMapping[currentIndex] = { checkName };
        currentIndex += 1;
      }
    });

    return {
      indexMapping: idxMapping,
      totalRows: currentIndex,
    };
  }, [expandedGroups, groupsToShow, checksInGroups]);

  // Group state => selected or not. This can be derived at render time. Only
  // mess with if necessary.

  // Group state => expanded or not. This state is updated by callbacks on the
  // group row. Can be stored as a Record of groupName to boolean as state.

  // Info for rendering is memoed based off of the expanded state and groupInfo
  // output.

  // convert group

  // need total number of rows (add 1 for each group)

  // Render groups first, then the non-grouped.

  // Non-grouped just needs to know what the first index is. Then if the index
  // is >= to that, then we render from the non-grouped items.

  // Need the early indexes to quickly map to a group.

  // (requires groupState) Total number of rows (1 extra per group, only 1 for group is not expanded).
  // index to { groupId and checkIndex }

  // group info =>

  return (
    <div className="flex">
      <Virtuoso
        style={{ height: '400px' }}
        className="flex-1"
        totalCount={excludedChecksList.length}
        // itemContent={index => <div>{`${index} ${excludedChecksList[index]}`}</div>}
        itemContent={index => {
          if (index === 22) {
            return <OtherRow />;
          } else {
            return <Row index={index} />;
          }
        }}
      />
      <Virtuoso
        style={{ height: '400px' }}
        className="flex-1"
        totalCount={totalRows}
        itemContent={index => {
          const indexInfo = indexMapping[index];
          return (
            <FancyRow
              {...indexInfo}
              expanded={Boolean(indexInfo.groupName && expandedGroups[indexInfo.groupName])}
            />
          );
        }}
      />
    </div>
  );
}

type FancyRowProps = IndexInfo & {
  expanded?: boolean;
};

function FancyRow({ groupName, checkName, isSubRow, expanded }: FancyRowProps) {
  let text = '';
  if (groupName) {
    text = `${groupName} (${groupDefs[groupName].length})`;
  } else if (checkName) {
    text = checkName;
  }

  return (
    <div className={clsx('flex items-center px-2', isSubRow && 'pl-5')}>
      <input
        type="checkbox"
        className="mr-2"
      />
      <span>{text}</span>
      {groupName && <div className="ml-auto">{expanded ? 'A' : 'V'}</div>}
    </div>
  );
}

export default ExcludedChecks;
