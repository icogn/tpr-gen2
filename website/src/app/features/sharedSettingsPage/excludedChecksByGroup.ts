// const excludedChecksByGroups
import type { SelectOption } from './LeftList';
import { CheckId, checkIdToName } from './checks';

export const excludedChecksByGroup: Record<string, CheckId[]> = {
  Ordon: [
    CheckId.Wrestling_With_Bo,
    CheckId.Herding_Goats_Reward,
    CheckId.Links_Basement_Chest,
    CheckId.Ordon_Cat_Rescue,
    CheckId.Ordon_Ranch_Grotto_Lantern_Chest,
    CheckId.Ordon_Shield,
    CheckId.Ordon_Sword,
    CheckId.Sera_Shop_Slingshot,
    CheckId.Uli_Cradle_Delivery,
    CheckId.Wooden_Sword_Chest,
  ],
  'Sacred Grove': [
    CheckId.Lost_Woods_Boulder_Poe,
    CheckId.Lost_Woods_Lantern_Chest,
    CheckId.Lost_Woods_Waterfall_Poe,
    CheckId.Sacred_Grove_Baba_Serpent_Grotto_Chest,
    CheckId.Sacred_Grove_Female_Snail,
    CheckId.Sacred_Grove_Male_Snail,
    CheckId.Sacred_Grove_Master_Sword_Poe,
    CheckId.Sacred_Grove_Past_Owl_Statue_Chest,
    CheckId.Sacred_Grove_Spinner_Chest,
    CheckId.Sacred_Grove_Temple_of_Time_Owl_Statue_Poe,
  ],
  'Faron Field': [
    CheckId.Faron_Field_Bridge_Chest,
    CheckId.Faron_Field_Corner_Grotto_Left_Chest,
    CheckId.Faron_Field_Corner_Grotto_Rear_Chest,
    CheckId.Faron_Field_Corner_Grotto_Right_Chest,
    CheckId.Faron_Field_Female_Beetle,
    CheckId.Faron_Field_Male_Beetle,
    CheckId.Faron_Field_Poe,
    CheckId.Faron_Field_Tree_Heart_Piece,
  ],
  'Faron Woods': [
    CheckId.Coro_Bottle,
    CheckId.Faron_Mist_Cave_Lantern_Chest,
    CheckId.Faron_Mist_Cave_Open_Chest,
    CheckId.Faron_Mist_North_Chest,
    CheckId.Faron_Mist_Poe,
    CheckId.Faron_Mist_South_Chest,
    CheckId.Faron_Mist_Stump_Chest,
    CheckId.Faron_Woods_Owl_Statue_Chest,
    CheckId.Faron_Woods_Owl_Statue_Sky_Character,
    CheckId.North_Faron_Woods_Deku_Baba_Chest,
    CheckId.South_Faron_Cave_Chest,
  ],
};

Object.keys(excludedChecksByGroup).forEach(groupName => {
  const group = excludedChecksByGroup[groupName];
  const sorted = group.sort((checkIdA, checkIdB) => {
    const checkNameA = checkIdToName(checkIdA)?.toLowerCase() || '';
    const checkNameB = checkIdToName(checkIdB)?.toLowerCase() || '';

    if (checkNameA === checkNameB) {
      return 0;
    } else if (checkNameA > checkNameB) {
      return 1;
    } else {
      return -1;
    }
  });

  excludedChecksByGroup[groupName] = sorted;
});

console.log(excludedChecksByGroup.Ordon.map(checkId => checkIdToName(checkId)));

export const excludedChecksGroupsAsOptions: SelectOption[] = Object.keys(excludedChecksByGroup)
  .sort()
  .reduce<SelectOption[]>((acc, groupName) => {
    acc.push({
      value: groupName,
      label: groupName,
    });
    return acc;
  }, []);
