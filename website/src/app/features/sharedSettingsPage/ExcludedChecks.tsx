'use client';

import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CheckId } from './checks';
import { alphabeticalCheckIds, checkIdToName } from './checks';
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import type { ExcludedCheckField, FormSchema } from './startingInventoryListShared';
import { excludedChecksByGroup, excludedChecksGroupsAsOptions } from './excludedChecksByGroup';
import type { LeftRightPickerListFilters } from '@/components/LeftRightPickerList/LeftRightPickerList';
import LeftRightPickerList from '@/components/LeftRightPickerList/LeftRightPickerList';
import LeftRightPickerListRow from '@/components/LeftRightPickerList/LeftRightPickerListRow';

type CheckRowInfo = {
  checkId: CheckId;
  isSubRow?: boolean;
};

type GroupRowInfo = {
  groupName: string;
};

type IndexInfo = CheckRowInfo | GroupRowInfo;

type OnCheckChange = (e: ChangeEvent<HTMLInputElement>, tgtChecked: boolean) => void;
type UpdateCheckedChecks = (checkIds: CheckId | CheckId[], checked: boolean) => void;
type UpdateExpandedGroups = (groupName: string, expanded: boolean) => void;

type ExcludedChecksProps = {
  useFormRet: UseFormReturn<FormSchema>;
};

function ExcludedChecks({ useFormRet }: ExcludedChecksProps) {
  const useFieldArrayRet = useFieldArray({
    name: 'excludedChecks',
    control: useFormRet.control,
  });

  const { fields, prepend } = useFieldArrayRet;

  const [leftFilters, setLeftFilters] = useState<LeftRightPickerListFilters>({
    search: '',
    selectVal: null,
  });

  const fullLeftRows = useMemo(() => {
    const selectedCheckIds: Record<string, boolean> = {};
    fields.forEach(({ checkId }: ExcludedCheckField) => {
      selectedCheckIds[checkId] = true;
    });

    const list: CheckId[] = [];
    alphabeticalCheckIds.forEach(checkId => {
      if (!selectedCheckIds[checkId]) {
        list.push(checkId);
      }
    });
    return list;
  }, [fields]);

  const filteredLeftRows = useMemo(() => {
    let checksOfGroup: Record<string, boolean> | null = null;

    if (leftFilters.selectVal) {
      checksOfGroup = {};
      const groupName = leftFilters.selectVal.value;
      const checkIds = excludedChecksByGroup[groupName];
      checkIds.forEach(checkId => {
        checksOfGroup![checkId] = true;
      });
    }

    return fullLeftRows.filter((checkId: CheckId) => {
      if (checksOfGroup && !checksOfGroup[checkId]) {
        return false;
      }

      const text = checkIdToName(checkId) || '';
      return text.toLowerCase().indexOf(leftFilters.search.toLowerCase()) >= 0;
    });
  }, [fullLeftRows, leftFilters]);

  const handleAdd = useCallback(
    (rowIdRecord: Record<string, boolean>) => {
      const list: ExcludedCheckField[] = [];
      alphabeticalCheckIds.forEach(checkId => {
        if (rowIdRecord[checkId]) {
          list.push({ checkId });
        }
      });

      prepend(list);
    },
    [prepend],
  );

  return (
    <div className="flex">
      <LeftRightPickerList
        isAdd
        totalRenderedRows={filteredLeftRows.length}
        unfilteredEntityIds={fullLeftRows}
        filteredEntityIds={filteredLeftRows}
        onSubmit={handleAdd}
        selectOptions={excludedChecksGroupsAsOptions}
        filters={leftFilters}
        onFiltersChange={setLeftFilters}
        computeRowKey={index => {
          const id = filteredLeftRows[index];
          return id;
        }}
        onRenderRowIndex={({ index, checkedRows, updateChecked }) => {
          const id = filteredLeftRows[index];
          const text = checkIdToName(id);
          const checked = Boolean(checkedRows[id]);

          const onClick = () => {
            updateChecked(String(id), !checked);
          };

          return (
            <LeftRightPickerListRow
              key={text}
              text={text}
              checked={checked}
              onClick={onClick}
              onCheckChange={onClick}
            />
          );
        }}
      />
      <RightList useFieldArrayRet={useFieldArrayRet} />
    </div>
  );
}

type RightListProps = {
  useFieldArrayRet: UseFieldArrayReturn<FormSchema, 'excludedChecks'>;
};

function RightList({ useFieldArrayRet }: RightListProps) {
  const { fields, remove } = useFieldArrayRet;

  const checkIdToFieldIndex = useMemo(() => {
    const map: Record<string, number> = {};
    fields.forEach(({ checkId }, i) => {
      map[checkId] = i;
    });
    return map;
  }, [fields]);

  const [rightFilters, setRightFilters] = useState<LeftRightPickerListFilters>({
    search: '',
    selectVal: null,
  });

  const { search } = rightFilters;

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const updateExpandedGroups = useCallback(
    (groupName: string, expanded: boolean) => {
      setExpandedGroups(prevVal => ({
        ...prevVal,
        [groupName]: expanded,
      }));
    },
    [setExpandedGroups],
  );

  const { groupsToShow, checksInGroups } = useMemo(() => {
    const groupNames: string[] = [];
    let checkIdsInGroup: Record<string, boolean> = {};

    if (search) {
      return {
        groupsToShow: groupNames,
        checksInGroups: checkIdsInGroup,
      };
    }

    const selectedChecksById: Record<number, boolean> = {};
    fields.forEach(({ checkId }) => {
      selectedChecksById[checkId] = true;
    });

    excludedChecksGroupsAsOptions.forEach(({ value: groupName }) => {
      const checksInGroup = excludedChecksByGroup[groupName];
      const checkIdsInGroupDiff: Record<string, boolean> = {};

      for (let i = 0; i < checksInGroup.length; i++) {
        const checkId = checksInGroup[i];
        if (!selectedChecksById[checkId]) {
          return;
        }
        checkIdsInGroupDiff[checkId] = true;
      }

      // Group is there.
      checkIdsInGroup = {
        ...checkIdsInGroup,
        ...checkIdsInGroupDiff,
      };
      groupNames.push(groupName);
    });

    return {
      groupsToShow: groupNames,
      checksInGroups: checkIdsInGroup,
    };
  }, [fields, search]);

  useEffect(() => {
    setExpandedGroups(prevVal =>
      groupsToShow.reduce<Record<string, boolean>>((acc, groupName) => {
        acc[groupName] = prevVal[groupName];
        return acc;
      }, {}),
    );
  }, [groupsToShow]);

  const unfilteredEntityIds = useMemo(() => {
    const entityIds: CheckId[] = [];
    fields.forEach(({ checkId }) => {
      entityIds.push(checkId);
    });

    return entityIds;
  }, [fields]);

  const { indexMapping, totalRows, filteredEntityIds } = useMemo(() => {
    // Calc indexes and stuff for quick rendering.
    const idxMapping: Record<number, IndexInfo> = {};
    const filteredEntityIds: CheckId[] = [];

    let currentIndex = 0;

    // Iterate over groups first
    groupsToShow.forEach(groupName => {
      idxMapping[currentIndex] = { groupName };
      currentIndex += 1;

      const groupIsExpanded = expandedGroups[groupName];

      excludedChecksByGroup[groupName].forEach(checkId => {
        filteredEntityIds.push(checkId);
        if (groupIsExpanded) {
          idxMapping[currentIndex] = { checkId, isSubRow: true };
          currentIndex += 1;
        }
      });
    });

    const lowercaseSearch = search.toLowerCase();

    fields.forEach(({ checkId }) => {
      if (!checksInGroups[checkId]) {
        const text = checkIdToName(checkId)?.toLowerCase() || '';
        if (text.indexOf(lowercaseSearch) >= 0) {
          idxMapping[currentIndex] = { checkId };
          filteredEntityIds.push(checkId);
          currentIndex += 1;
        }
      }
    });

    return {
      indexMapping: idxMapping,
      totalRows: currentIndex,
      filteredEntityIds,
    };
  }, [expandedGroups, groupsToShow, checksInGroups, fields, search]);

  const handleRemove = useCallback(
    (rowIdRecord: Record<string, boolean>) => {
      const list: number[] = [];
      alphabeticalCheckIds.forEach(checkId => {
        if (rowIdRecord[checkId]) {
          checkIdToFieldIndex;
          const index = checkIdToFieldIndex[checkId];
          if (typeof index === 'number' && !Number.isNaN(index)) {
            list.push(index);
          }
        }
      });

      remove(list);
    },
    [remove, checkIdToFieldIndex],
  );

  return (
    <LeftRightPickerList
      isAdd={false}
      totalRenderedRows={totalRows}
      unfilteredEntityIds={unfilteredEntityIds}
      filteredEntityIds={filteredEntityIds}
      onSubmit={handleRemove}
      filters={rightFilters}
      invisibleSelectRow
      onFiltersChange={setRightFilters}
      computeRowKey={index => {
        const indexInfo = indexMapping[index];
        if ('checkId' in indexInfo) {
          return indexInfo.checkId;
        } else if ('groupName' in indexInfo) {
          return indexInfo.groupName;
        }
        return 'null'; // Expected to never return this.
      }}
      onRenderRowIndex={({ index, checkedRows, updateChecked, canAnimNewEntityIds }) => {
        const indexInfo = indexMapping[index];

        if ('checkId' in indexInfo) {
          return (
            <FancyRowCheck
              checkRowInfo={indexInfo}
              checked={checkedRows[indexInfo.checkId]}
              updateCheckedChecks={updateChecked}
              appearAnim={!indexInfo.isSubRow && canAnimNewEntityIds[indexInfo.checkId]}
            />
          );
        } else if ('groupName' in indexInfo) {
          const { groupName } = indexInfo;
          const checkIds = excludedChecksByGroup[groupName];

          let canAnim = false;
          if (Object.keys(canAnimNewEntityIds).length > 0) {
            for (let i = 0; i < checkIds.length; i++) {
              if (canAnimNewEntityIds[checkIds[i]]) {
                canAnim = true;
                break;
              }
            }
          }

          return (
            <FancyRowGroup
              groupRowInfo={indexInfo}
              checkedChecks={checkedRows}
              updateCheckedChecks={updateChecked}
              expanded={expandedGroups[groupName]}
              updateExpandedGroups={updateExpandedGroups}
              appearAnim={canAnim}
            />
          );
        }
        return null; // Expected to never return null.
      }}
    />
  );
}

type FancyRowCheckProps = {
  checkRowInfo: CheckRowInfo;
  checked?: boolean;
  updateCheckedChecks: UpdateCheckedChecks;
  appearAnim: boolean;
};

function FancyRowCheck({
  checkRowInfo,
  checked = false,
  updateCheckedChecks,
  appearAnim,
}: FancyRowCheckProps) {
  const memoedProps = useMemo(() => {
    const { checkId } = checkRowInfo;
    console.log(`doing memo for: ${checkIdToName(checkId)}`);
    const text = checkIdToName(checkRowInfo.checkId) || '';

    const onClick = () => {
      updateCheckedChecks(checkId, !checked);
    };
    const onCheckChange = onClick;

    return {
      text,
      onClick,
      onCheckChange,
    };
  }, [checkRowInfo, checked, updateCheckedChecks]);

  return (
    <LeftRightPickerListRow
      {...memoedProps}
      checked={checked}
      isSubRow={checkRowInfo.isSubRow}
      appearAnim={appearAnim}
    />
  );
}

type FancyRowGroupProps = {
  groupRowInfo: GroupRowInfo;
  checkedChecks: Record<string, boolean>;
  updateCheckedChecks: UpdateCheckedChecks;
  expanded?: boolean;
  updateExpandedGroups: UpdateExpandedGroups;
  appearAnim: boolean;
};

function FancyRowGroup({
  groupRowInfo,
  checkedChecks,
  updateCheckedChecks,
  expanded = false,
  updateExpandedGroups,
  appearAnim,
}: FancyRowGroupProps) {
  const { groupName } = groupRowInfo;

  const memoedProps = useMemo(() => {
    console.log(`doing memo for: ${groupName}`);

    let numChecked = 0;

    const groupDef = excludedChecksByGroup[groupName];
    for (let i = 0; i < groupDef.length; i++) {
      if (checkedChecks[groupDef[i]]) {
        numChecked += 1;
      }
    }

    const checked = numChecked === groupDef.length;
    const indeterminate = !checked && numChecked > 0;

    return {
      checked,
      indeterminate,
    };
  }, [groupName, checkedChecks]);

  const text = useMemo(() => {
    return `${groupName} (${excludedChecksByGroup[groupName].length})`;
  }, [groupName]);

  const handleClick = useCallback(() => {
    updateExpandedGroups(groupName, !expanded);
  }, [groupName, updateExpandedGroups, expanded]);

  const handleCheckChange: OnCheckChange = useCallback(
    (e, tgtChecked) => {
      updateCheckedChecks(excludedChecksByGroup[groupName], tgtChecked);
    },
    [groupName, updateCheckedChecks],
  );

  return (
    <LeftRightPickerListRow
      {...memoedProps}
      text={text}
      onClick={handleClick}
      onCheckChange={handleCheckChange}
      isGroupNameRow
      expanded={expanded}
      appearAnim={appearAnim}
    />
  );
}

export default ExcludedChecks;
