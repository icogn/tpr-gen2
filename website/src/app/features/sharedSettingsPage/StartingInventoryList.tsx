'use client';

import { useMemo } from 'react';
import StartingInventoryListLeft from './StartingInventoryListLeft';
import StartingInventoryListRight from './StartingInventoryListRight';
import type { FormSchema, ItemId, StartingItemField } from './startingInventoryListShared';
import { startingItemDefsOrder } from './startingInventoryListShared';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';

type StartingInventoryListProps = {
  useFormRet: UseFormReturn<FormSchema>;
};

function StartingInventoryList({ useFormRet }: StartingInventoryListProps) {
  // const watchList = useFormRet.watch('list');

  // Don't want to have to define encoding and decoding of settings string in C#
  // as well as website. This causes problems with the ease of maintaining
  // backwards compatibility. Note that we should be able to add unit testing
  // for backwards compatibility if the only code is typescript.

  // As such, we want to provide the settings to the C# as base64-encoded json
  // settings which can be easily parsed into a class instance.

  // The downside is that getting the string to test will be a little more
  // difficult. Possibly let people manually set a localStorage value to
  // indicate they want "dev" things in the UI. Maybe a button for generating
  // this string.

  // Settings string <=> website form
  // website form => c# settings

  // Will need to watch out for character limits related to the length of the
  // base64 input. May need to do some stdin pipe stuff. Can wait until an
  // actual issue pops up though.

  // console.log('watchList');
  // console.log(watchList);

  const useFieldArrayRet = useFieldArray({
    name: 'list',
    control: useFormRet.control,
  });

  const leftData = useMemo(() => {
    const selectedItemIds: { [key in ItemId]?: boolean } = {};
    useFieldArrayRet.fields.forEach(({ itemId }) => {
      selectedItemIds[itemId] = true;
    });

    const ret: ItemId[] = [];
    startingItemDefsOrder.forEach((itemId: ItemId) => {
      if (!selectedItemIds[itemId]) {
        ret.push(itemId);
      }
    });
    return ret;
  }, [useFieldArrayRet.fields]);

  // const [selectedIndexes, setSelectedIndexes] = useState<Abc>({
  //   [ItemId.Hawkeye]: true,
  // });

  // right list - state is ordered list of which itemIds are in the list, as
  // well as state for certain rows.

  // The parsed settings will be a single array with multiple of some itemIds.
  // This gets passed down to the root list.

  const handleAdd = (selected: StartingItemField[]) => {
    console.log('selected');
    console.log(selected);
    useFieldArrayRet.prepend(selected);
    // setSelectedIndexes({
    //   ...selectedIndexes,
    //   ...selected,
    // });
  };

  return (
    <div className="flex">
      <StartingInventoryListLeft
        data={leftData}
        onAdd={handleAdd}
      />
      <StartingInventoryListRight
        useFormRet={useFormRet}
        useFieldArrayRet={useFieldArrayRet}
      />
    </div>
  );
}

export default StartingInventoryList;
