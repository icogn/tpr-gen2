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
  'Kakariko Gorge': [
    CheckId.Eldin_Lantern_Cave_First_Chest,
    CheckId.Eldin_Lantern_Cave_Lantern_Chest,
    CheckId.Eldin_Lantern_Cave_Poe,
    CheckId.Eldin_Lantern_Cave_Second_Chest,
    CheckId.Kakariko_Gorge_Double_Clawshot_Chest,
    CheckId.Kakariko_Gorge_Female_Pill_Bug,
    CheckId.Kakariko_Gorge_Male_Pill_Bug,
    CheckId.Kakariko_Gorge_Owl_Statue_Chest,
    CheckId.Kakariko_Gorge_Owl_Statue_Sky_Character,
    CheckId.Kakariko_Gorge_Poe,
    CheckId.Kakariko_Gorge_Spire_Heart_Piece,
  ],
  'Kakariko Village': [
    CheckId.Barnes_Bomb_Bag,
    CheckId.Eldin_Spring_Underwater_Chest,
    CheckId.Ilia_Memory_Reward,
    CheckId.Kakariko_Inn_Chest,
    CheckId.Kakariko_Village_Bomb_Rock_Spire_Heart_Piece,
    CheckId.Kakariko_Village_Bomb_Shop_Poe,
    CheckId.Kakariko_Village_Female_Ant,
    CheckId.Kakariko_Village_Malo_Mart_Hawkeye,
    CheckId.Kakariko_Village_Malo_Mart_Hylian_Shield,
    CheckId.Kakariko_Village_Watchtower_Poe,
    CheckId.Kakariko_Watchtower_Alcove_Chest,
    CheckId.Kakariko_Watchtower_Chest,
    CheckId.Renados_Letter,
    CheckId.Talo_Sharpshooting,
  ],
  'Kakariko Graveyard': [
    CheckId.Gift_From_Ralis,
    CheckId.Kakariko_Graveyard_Grave_Poe,
    CheckId.Kakariko_Graveyard_Lantern_Chest,
    CheckId.Kakariko_Graveyard_Male_Ant,
    CheckId.Kakariko_Graveyard_Open_Poe,
    CheckId.Rutelas_Blessing,
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
