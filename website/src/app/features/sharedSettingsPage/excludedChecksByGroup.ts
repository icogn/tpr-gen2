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
  'Eldin Field': [
    CheckId.Bridge_of_Eldin_Male_Phasmid,
    CheckId.Bridge_of_Eldin_Owl_Statue_Chest,
    CheckId.Eldin_Field_Bomb_Rock_Chest,
    CheckId.Eldin_Field_Bomskit_Grotto_Lantern_Chest,
    CheckId.Eldin_Field_Bomskit_Grotto_Left_Chest,
    CheckId.Eldin_Field_Female_Grasshopper,
    CheckId.Eldin_Field_Male_Grasshopper,
    CheckId.Eldin_Field_Water_Bomb_Fish_Grotto_Chest,
    CheckId.Goron_Springwater_Rush,
  ],
  'NE Hyrule Field': [
    CheckId.Bridge_of_Eldin_Female_Phasmid,
    CheckId.Bridge_of_Eldin_Owl_Statue_Sky_Character,
    CheckId.Eldin_Field_Stalfos_Grotto_Left_Small_Chest,
    CheckId.Eldin_Field_Stalfos_Grotto_Right_Small_Chest,
    CheckId.Eldin_Field_Stalfos_Grotto_Stalfos_Chest,
    CheckId.Eldin_Stockcave_Lantern_Chest,
    CheckId.Eldin_Stockcave_Lowest_Chest,
    CheckId.Eldin_Stockcave_Upper_Chest,
  ],
  'Death Mountain': [CheckId.Death_Mountain_Alcove_Chest, CheckId.Death_Mountain_Trail_Poe],
  'Hidden Village': [
    CheckId.Cats_Hide_and_Seek_Minigame,
    CheckId.Hidden_Village_Poe,
    CheckId.Ilia_Charm,
    CheckId.Skybook_From_Impaz,
  ],
  'Lanayru Field': [
    CheckId.Lanayru_Field_Behind_Gate_Underwater_Chest,
    CheckId.Lanayru_Field_Bridge_Poe,
    CheckId.Lanayru_Field_Female_Stag_Beetle,
    CheckId.Lanayru_Field_Male_Stag_Beetle,
    CheckId.Lanayru_Field_Poe_Grotto_Left_Poe,
    CheckId.Lanayru_Field_Poe_Grotto_Right_Poe,
    CheckId.Lanayru_Field_Skulltula_Grotto_Chest,
    CheckId.Lanayru_Field_Spinner_Track_Chest,
    CheckId.Lanayru_Ice_Block_Puzzle_Cave_Chest,
  ],
  'West of Castle Town': [
    CheckId.Hyrule_Field_Amphitheater_Owl_Statue_Chest,
    CheckId.Hyrule_Field_Amphitheater_Owl_Statue_Sky_Character,
    CheckId.Hyrule_Field_Amphitheater_Poe,
    CheckId.West_Hyrule_Field_Female_Butterfly,
    CheckId.West_Hyrule_Field_Helmasaur_Grotto_Chest,
    CheckId.West_Hyrule_Field_Male_Butterfly,
  ],
  'South of Castle Town': [
    CheckId.Outside_South_Castle_Town_Double_Clawshot_Chasm_Chest,
    CheckId.Outside_South_Castle_Town_Female_Ladybug,
    CheckId.Outside_South_Castle_Town_Fountain_Chest,
    CheckId.Outside_South_Castle_Town_Male_Ladybug,
    CheckId.Outside_South_Castle_Town_Poe,
    CheckId.Outside_South_Castle_Town_Tektite_Grotto_Chest,
    CheckId.Outside_South_Castle_Town_Tightrope_Chest,
    CheckId.Wooden_Statue,
  ],
  'Castle Town': [
    CheckId.Castle_Town_Malo_Mart_Magic_Armor,
    CheckId.Charlo_Donation_Blessing,
    CheckId.Doctors_Office_Balcony_Chest,
    CheckId.East_Castle_Town_Bridge_Poe,
    CheckId.Jovani_20_Poe_Soul_Reward,
    CheckId.Jovani_60_Poe_Soul_Reward,
    CheckId.Jovani_House_Poe,
    CheckId.STAR_Prize_1,
    CheckId.STAR_Prize_2,
    CheckId.Telma_Invoice,
  ],
  Agitha: [
    CheckId.Agitha_Female_Ant_Reward,
    CheckId.Agitha_Female_Beetle_Reward,
    CheckId.Agitha_Female_Butterfly_Reward,
    CheckId.Agitha_Female_Dayfly_Reward,
    CheckId.Agitha_Female_Dragonfly_Reward,
    CheckId.Agitha_Female_Grasshopper_Reward,
    CheckId.Agitha_Female_Ladybug_Reward,
    CheckId.Agitha_Female_Mantis_Reward,
    CheckId.Agitha_Female_Phasmid_Reward,
    CheckId.Agitha_Female_Pill_Bug_Reward,
    CheckId.Agitha_Female_Snail_Reward,
    CheckId.Agitha_Female_Stag_Beetle_Reward,
    CheckId.Agitha_Male_Ant_Reward,
    CheckId.Agitha_Male_Beetle_Reward,
    CheckId.Agitha_Male_Butterfly_Reward,
    CheckId.Agitha_Male_Dayfly_Reward,
    CheckId.Agitha_Male_Dragonfly_Reward,
    CheckId.Agitha_Male_Grasshopper_Reward,
    CheckId.Agitha_Male_Ladybug_Reward,
    CheckId.Agitha_Male_Mantis_Reward,
    CheckId.Agitha_Male_Phasmid_Reward,
    CheckId.Agitha_Male_Pill_Bug_Reward,
    CheckId.Agitha_Male_Snail_Reward,
    CheckId.Agitha_Male_Stag_Beetle_Reward,
  ],
  'Great Bridge of Hylia': [
    CheckId.Lake_Hylia_Bridge_Bubble_Grotto_Chest,
    CheckId.Lake_Hylia_Bridge_Cliff_Chest,
    CheckId.Lake_Hylia_Bridge_Cliff_Poe,
    CheckId.Lake_Hylia_Bridge_Female_Mantis,
    CheckId.Lake_Hylia_Bridge_Male_Mantis,
    CheckId.Lake_Hylia_Bridge_Owl_Statue_Chest,
    CheckId.Lake_Hylia_Bridge_Owl_Statue_Sky_Character,
    CheckId.Lake_Hylia_Bridge_Vines_Chest,
  ],
  'Lake Hylia': [
    CheckId.Auru_Gift_To_Fyer,
    CheckId.Flight_By_Fowl_Fifth_Platform_Chest,
    CheckId.Flight_By_Fowl_Fourth_Platform_Chest,
    CheckId.Flight_By_Fowl_Ledge_Poe,
    CheckId.Flight_By_Fowl_Second_Platform_Chest,
    CheckId.Flight_By_Fowl_Third_Platform_Chest,
    CheckId.Flight_By_Fowl_Top_Platform_Reward,
    CheckId.Isle_of_Riches_Poe,
    CheckId.Lake_Hylia_Alcove_Poe,
    CheckId.Lake_Hylia_Dock_Poe,
    CheckId.Lake_Hylia_Shell_Blade_Grotto_Chest,
    CheckId.Lake_Hylia_Tower_Poe,
    CheckId.Lake_Hylia_Underwater_Chest,
    CheckId.Lake_Hylia_Water_Toadpoli_Grotto_Chest,
    CheckId.Outside_Lanayru_Spring_Left_Statue_Chest,
    CheckId.Outside_Lanayru_Spring_Right_Statue_Chest,
  ],
  'Lake Lantern Cave': [
    CheckId.Lake_Lantern_Cave_Eighth_Chest,
    CheckId.Lake_Lantern_Cave_Eleventh_Chest,
    CheckId.Lake_Lantern_Cave_End_Lantern_Chest,
    CheckId.Lake_Lantern_Cave_Fifth_Chest,
    CheckId.Lake_Lantern_Cave_Final_Poe,
    CheckId.Lake_Lantern_Cave_First_Chest,
    CheckId.Lake_Lantern_Cave_First_Poe,
    CheckId.Lake_Lantern_Cave_Fourteenth_Chest,
    CheckId.Lake_Lantern_Cave_Fourth_Chest,
    CheckId.Lake_Lantern_Cave_Ninth_Chest,
    CheckId.Lake_Lantern_Cave_Second_Chest,
    CheckId.Lake_Lantern_Cave_Second_Poe,
    CheckId.Lake_Lantern_Cave_Seventh_Chest,
    CheckId.Lake_Lantern_Cave_Sixth_Chest,
    CheckId.Lake_Lantern_Cave_Tenth_Chest,
    CheckId.Lake_Lantern_Cave_Third_Chest,
    CheckId.Lake_Lantern_Cave_Thirteenth_Chest,
    CheckId.Lake_Lantern_Cave_Twelfth_Chest,
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
