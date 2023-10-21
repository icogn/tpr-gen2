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
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Checkbox } from '@mui/material';
import { CheckId, alphabeticalCheckIds, checkIdToName } from './checks';
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import type { ExcludedCheckField, FormSchema } from './startingInventoryListShared';
import ListBtnRow from './ListBtnRow';
import type { LeftListFilters, SelectOption } from './LeftList';
import LeftList, { LeftListRow } from './LeftList';

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

const groupDefs: { [key: string]: CheckId[] } = {
  'Golden Wolves': [
    CheckId.Faron_Woods_Golden_Wolf,
    CheckId.Gerudo_Desert_Golden_Wolf,
    CheckId.Kakariko_Graveyard_Golden_Wolf,
    CheckId.North_Castle_Town_Golden_Wolf,
    CheckId.Ordon_Spring_Golden_Wolf,
    CheckId.Outside_South_Castle_Town_Golden_Wolf,
    CheckId.West_Hyrule_Field_Golden_Wolf,
  ],
};

// const selectedChecks = [
//   checkNameToId('Uli Cradle Delivery'),
//   checkNameToId('Faron Woods Golden Wolf'),
//   checkNameToId('Gerudo Desert Golden Wolf'),
//   checkNameToId('Kakariko Graveyard Golden Wolf'),
//   checkNameToId('Agitha Female Dragonfly Reward'),
//   checkNameToId('North Castle Town Golden Wolf'),
//   checkNameToId('Ordon Spring Golden Wolf'),
//   checkNameToId('Outside South Castle Town Golden Wolf'),
//   checkNameToId('West Hyrule Field Golden Wolf'),
//   checkNameToId('Arbiters Grounds West Stalfos West Chest'),
// ];

// const selectedChecks = [
//   CheckId.Palace_of_Twilight_East_Wing_Second_Room_Southwest_Chest,
//   CheckId.Faron_Field_Poe,
//   CheckId.Goron_Mines_Crystal_Switch_Room_Small_Chest,
//   CheckId.Goron_Mines_Gor_Liggs_Key_Shard,
//   CheckId.Wrestling_With_Bo,
//   CheckId.Goron_Mines_After_Crystal_Switch_Room_Magnet_Wall_Chest,
//   CheckId.Agitha_Female_Phasmid_Reward,
//   CheckId.Snowpeak_Ruins_East_Courtyard_Buried_Chest,
//   CheckId.Snowpeak_Ruins_Lobby_East_Armor_Chest,
//   CheckId.Bridge_of_Eldin_Owl_Statue_Sky_Character,
//   CheckId.Arbiters_Grounds_Entrance_Chest,
//   CheckId.Hyrule_Castle_Treasure_Room_Third_Chest,
//   CheckId.Arbiters_Grounds_Torch_Room_Poe,
//   CheckId.Palace_of_Twilight_East_Wing_Second_Room_Northwest_Chest,
//   CheckId.Hyrule_Castle_Graveyard_Owl_Statue_Chest,
//   CheckId.Faron_Field_Corner_Grotto_Rear_Chest,
//   CheckId.Zoras_Domain_Male_Dragonfly,
//   CheckId.Gerudo_Desert_Lone_Small_Chest,
//   CheckId.Gerudo_Desert_Rock_Grotto_Lantern_Chest,
//   CheckId.Lake_Hylia_Water_Toadpoli_Grotto_Chest,
//   CheckId.Faron_Mist_Stump_Chest,
//   CheckId.Lanayru_Field_Poe_Grotto_Left_Poe,
//   CheckId.City_in_The_Sky_Underwater_West_Chest,
//   CheckId.Temple_of_Time_Dungeon_Reward,
//   CheckId.Ordon_Spring_Golden_Wolf,
//   CheckId.Hyrule_Castle_Main_Hall_Northeast_Chest,
//   CheckId.Gerudo_Desert_Northeast_Chest_Behind_Gates,
//   CheckId.Ilia_Charm,
//   CheckId.Agitha_Male_Ladybug_Reward,
//   CheckId.Hyrule_Castle_Treasure_Room_Seventh_Small_Chest,
//   CheckId.Lake_Hylia_Tower_Poe,
//   CheckId.Arbiters_Grounds_Spinner_Room_Lower_North_Chest,
//   CheckId.Sacred_Grove_Past_Owl_Statue_Chest,
//   CheckId.Lakebed_Temple_Morpheel_Heart_Container,
//   CheckId.Lost_Woods_Lantern_Chest,
//   CheckId.Lanayru_Field_Skulltula_Grotto_Chest,
//   CheckId.Faron_Mist_Cave_Lantern_Chest,
//   CheckId.Eldin_Lantern_Cave_First_Chest,
//   CheckId.Faron_Field_Corner_Grotto_Right_Chest,
//   CheckId.Ordon_Ranch_Grotto_Lantern_Chest,
//   CheckId.Sera_Shop_Slingshot,
//   CheckId.Lakebed_Temple_East_Lower_Waterwheel_Stalactite_Chest,
//   CheckId.Snowpeak_Ruins_Chest_After_Darkhammer,
//   CheckId.Goron_Mines_Gor_Liggs_Chest,
//   CheckId.Arbiters_Grounds_East_Turning_Room_Poe,
//   CheckId.Lanayru_Field_Female_Stag_Beetle,
//   CheckId.Zoras_Domain_Chest_By_Mother_and_Child_Isles,
//   CheckId.North_Faron_Woods_Deku_Baba_Chest,
//   CheckId.City_in_The_Sky_Baba_Tower_Top_Small_Chest,
//   CheckId.Kakariko_Village_Bomb_Rock_Spire_Heart_Piece,
//   CheckId.Arbiters_Grounds_Stallord_Heart_Container,
//   CheckId.Zoras_Domain_Chest_Behind_Waterfall,
//   CheckId.City_in_The_Sky_Central_Outside_Ledge_Chest,
//   CheckId.Palace_of_Twilight_East_Wing_First_Room_West_Alcove,
//   CheckId.Bulblin_Camp_First_Chest_Under_Tower_At_Entrance,
//   CheckId.Arbiters_Grounds_West_Stalfos_Northeast_Chest,
//   CheckId.Outside_South_Castle_Town_Male_Ladybug,
//   CheckId.Jovani_20_Poe_Soul_Reward,
//   CheckId.West_Hyrule_Field_Helmasaur_Grotto_Chest,
//   CheckId.Zoras_Domain_Underwater_Goron,
//   CheckId.Kakariko_Inn_Chest,
//   CheckId.Agitha_Female_Beetle_Reward,
//   CheckId.Lanayru_Spring_Back_Room_Left_Chest,
//   CheckId.Agitha_Female_Grasshopper_Reward,
//   CheckId.City_in_The_Sky_Baba_Tower_Alcove_Chest,
//   CheckId.Goron_Mines_Gor_Amato_Chest,
//   CheckId.Goron_Mines_Gor_Ebizo_Chest,
//   CheckId.Faron_Mist_North_Chest,
//   CheckId.Lakebed_Temple_West_Lower_Small_Chest,
//   CheckId.Agitha_Male_Phasmid_Reward,
//   CheckId.City_in_The_Sky_Chest_Behind_North_Fan,
//   CheckId.Lake_Lantern_Cave_Final_Poe,
//   CheckId.Temple_of_Time_Lobby_Lantern_Chest,
//   CheckId.Lakebed_Temple_East_Second_Floor_Southeast_Chest,
//   CheckId.Hyrule_Field_Amphitheater_Poe,
//   CheckId.Gerudo_Desert_Peahat_Ledge_Chest,
//   CheckId.Iza_Helping_Hand,
//   CheckId.Lake_Lantern_Cave_Second_Chest,
//   CheckId.Lakebed_Temple_Central_Room_Small_Chest,
//   CheckId.Links_Basement_Chest,
//   CheckId.Snowpeak_Cave_Ice_Lantern_Chest,
//   CheckId.Gerudo_Desert_Poe_Above_Cave_of_Ordeals,
//   CheckId.Eldin_Field_Water_Bomb_Fish_Grotto_Chest,
//   CheckId.Kakariko_Village_Watchtower_Poe,
//   CheckId.Agitha_Female_Dragonfly_Reward,
//   CheckId.Gift_From_Ralis,
//   CheckId.South_Faron_Cave_Chest,
//   CheckId.Lakebed_Temple_West_Second_Floor_Southeast_Chest,
//   CheckId.Temple_of_Time_Darknut_Chest,
//   CheckId.Forest_Temple_Central_North_Chest,
//   CheckId.Lanayru_Field_Male_Stag_Beetle,
//   CheckId.City_in_The_Sky_Underwater_East_Chest,
//   CheckId.Forest_Temple_East_Water_Cave_Chest,
//   CheckId.Hyrule_Castle_Treasure_Room_Second_Small_Chest,
//   CheckId.Lake_Hylia_Bridge_Vines_Chest,
//   CheckId.City_in_The_Sky_East_Wing_After_Dinalfos_Ledge_Chest,
//   CheckId.Snowpeak_Ruins_Lobby_Armor_Poe,
//   CheckId.Faron_Field_Tree_Heart_Piece,
//   CheckId.Eldin_Field_Stalfos_Grotto_Right_Small_Chest,
//   CheckId.Lake_Lantern_Cave_First_Poe,
//   CheckId.Hyrule_Castle_Treasure_Room_Fourth_Small_Chest,
//   CheckId.Kakariko_Village_Malo_Mart_Hawkeye,
//   CheckId.Uli_Cradle_Delivery,
//   CheckId.Flight_By_Fowl_Ledge_Poe,
//   CheckId.Lakebed_Temple_West_Water_Supply_Chest,
//   CheckId.Palace_of_Twilight_East_Wing_Second_Room_Northeast_Chest,
//   CheckId.Kakariko_Village_Bomb_Shop_Poe,
//   CheckId.Faron_Mist_Poe,
//   CheckId.Lake_Hylia_Bridge_Cliff_Poe,
//   CheckId.Hyrule_Castle_Main_Hall_Southwest_Chest,
//   CheckId.Wooden_Sword_Chest,
//   CheckId.Goron_Mines_Dangoro_Chest,
//   CheckId.City_in_The_Sky_Garden_Island_Poe,
//   CheckId.Faron_Field_Female_Beetle,
//   CheckId.Eldin_Field_Male_Grasshopper,
//   CheckId.Gerudo_Desert_Rock_Grotto_First_Poe,
//   CheckId.Eldin_Lantern_Cave_Second_Chest,
//   CheckId.Palace_of_Twilight_West_Wing_Second_Room_Southeast_Chest,
//   CheckId.Arbiters_Grounds_East_Upper_Turnable_Redead_Chest,
//   CheckId.Sacred_Grove_Temple_of_Time_Owl_Statue_Poe,
//   CheckId.Forest_Temple_West_Tile_Worm_Room_Vines_Chest,
//   CheckId.Agitha_Male_Dragonfly_Reward,
//   CheckId.City_in_The_Sky_East_Tile_Worm_Small_Chest,
//   CheckId.Palace_of_Twilight_Central_Tower_Chest,
//   CheckId.Outside_Arbiters_Grounds_Poe,
//   CheckId.Outside_South_Castle_Town_Double_Clawshot_Chasm_Chest,
//   CheckId.Hyrule_Field_Amphitheater_Owl_Statue_Chest,
//   CheckId.Snowpeak_Ruins_Northeast_Chandelier_Chest,
//   CheckId.Hyrule_Castle_West_Courtyard_North_Small_Chest,
//   CheckId.Agitha_Female_Stag_Beetle_Reward,
//   CheckId.Lakebed_Temple_West_Second_Floor_Central_Small_Chest,
//   CheckId.Agitha_Female_Mantis_Reward,
//   CheckId.Lakebed_Temple_Lobby_Rear_Chest,
//   CheckId.Bridge_of_Eldin_Owl_Statue_Chest,
//   CheckId.West_Hyrule_Field_Golden_Wolf,
//   CheckId.Lake_Hylia_Bridge_Cliff_Chest,
//   CheckId.City_in_The_Sky_West_Garden_Lower_Chest,
//   CheckId.Goron_Mines_Outside_Clawshot_Chest,
//   CheckId.Lake_Lantern_Cave_Fifth_Chest,
//   CheckId.Palace_of_Twilight_Big_Key_Chest,
//   CheckId.Agitha_Male_Beetle_Reward,
//   CheckId.Gerudo_Desert_Campfire_East_Chest,
//   CheckId.Hyrule_Castle_Big_Key_Chest,
//   CheckId.Temple_of_Time_Moving_Wall_Beamos_Room_Chest,
//   CheckId.Lake_Lantern_Cave_Fourth_Chest,
//   CheckId.Lakebed_Temple_East_Lower_Waterwheel_Bridge_Chest,
//   CheckId.City_in_The_Sky_East_First_Wing_Chest_After_Fans,
//   CheckId.Lake_Lantern_Cave_Tenth_Chest,
//   CheckId.Lake_Lantern_Cave_Ninth_Chest,
//   CheckId.Kakariko_Watchtower_Alcove_Chest,
//   CheckId.West_Hyrule_Field_Male_Butterfly,
//   CheckId.Hyrule_Castle_King_Bulblin_Key,
//   CheckId.Hyrule_Castle_East_Wing_Boomerang_Puzzle_Chest,
//   CheckId.Palace_of_Twilight_Central_Outdoor_Chest,
//   CheckId.Hyrule_Castle_Treasure_Room_First_Small_Chest,
//   CheckId.Goron_Mines_Outside_Underwater_Chest,
//   CheckId.Lake_Lantern_Cave_Eleventh_Chest,
//   CheckId.Agitha_Female_Ant_Reward,
//   CheckId.Cave_of_Ordeals_Great_Fairy_Reward,
//   CheckId.Forest_Temple_Central_Chest_Hanging_From_Web,
//   CheckId.Lost_Woods_Waterfall_Poe,
//   CheckId.Kakariko_Graveyard_Open_Poe,
//   CheckId.Eldin_Field_Bomskit_Grotto_Left_Chest,
//   CheckId.Hyrule_Castle_West_Courtyard_Central_Small_Chest,
//   CheckId.City_in_The_Sky_West_Wing_Narrow_Ledge_Chest,
//   CheckId.Snowpeak_Ruins_Ordon_Pumpkin_Chest,
//   CheckId.Skybook_From_Impaz,
//   CheckId.STAR_Prize_1,
//   CheckId.Hyrule_Castle_Treasure_Room_Fifth_Chest,
//   CheckId.Zoras_Domain_Mother_and_Child_Isle_Poe,
//   CheckId.Ordon_Shield,
//   CheckId.Flight_By_Fowl_Fourth_Platform_Chest,
//   CheckId.Goron_Springwater_Rush,
//   CheckId.Arbiters_Grounds_Hidden_Wall_Poe,
//   CheckId.Agitha_Female_Dayfly_Reward,
//   CheckId.Outside_South_Castle_Town_Tightrope_Chest,
//   CheckId.Lake_Hylia_Bridge_Bubble_Grotto_Chest,
//   CheckId.Hyrule_Castle_Main_Hall_Northwest_Chest,
//   CheckId.Snowpeak_Ruins_Ice_Room_Poe,
//   CheckId.Forest_Temple_Dungeon_Reward,
//   CheckId.Arbiters_Grounds_Spinner_Room_Lower_Central_Small_Chest,
//   CheckId.Hyrule_Castle_Treasure_Room_Fifth_Small_Chest,
//   CheckId.Goron_Mines_Chest_Before_Dangoro,
//   CheckId.Agitha_Male_Snail_Reward,
//   CheckId.Agitha_Male_Ant_Reward,
//   CheckId.Lakebed_Temple_Before_Deku_Toad_Underwater_Left_Chest,
//   CheckId.Temple_of_Time_Poe_Above_Scales,
//   CheckId.Forest_Temple_North_Deku_Like_Chest,
//   CheckId.Lakebed_Temple_Central_Room_Chest,
//   CheckId.Temple_of_Time_First_Staircase_Gohma_Gate_Chest,
//   CheckId.Temple_of_Time_First_Staircase_Window_Chest,
//   CheckId.Forest_Temple_Totem_Pole_Chest,
//   CheckId.Faron_Mist_South_Chest,
//   CheckId.Lake_Lantern_Cave_Eighth_Chest,
//   CheckId.Snowpeak_Ruins_Lobby_Chandelier_Chest,
//   CheckId.Lakebed_Temple_Deku_Toad_Chest,
//   CheckId.Lake_Hylia_Dock_Poe,
//   CheckId.Lake_Hylia_Shell_Blade_Grotto_Chest,
//   CheckId.Forest_Temple_West_Tile_Worm_Chest_Behind_Stairs,
//   CheckId.Renados_Letter,
//   CheckId.Lake_Lantern_Cave_Thirteenth_Chest,
//   CheckId.Arbiters_Grounds_Spinner_Room_First_Small_Chest,
//   CheckId.Palace_of_Twilight_Collect_Both_Sols,
//   CheckId.Upper_Zoras_River_Female_Dragonfly,
//   CheckId.Temple_of_Time_Moving_Wall_Dinalfos_Room_Chest,
//   CheckId.Lanayru_Spring_Underwater_Right_Chest,
//   CheckId.Gerudo_Desert_East_Canyon_Chest,
//   CheckId.Forest_Temple_Central_Chest_Behind_Stairs,
//   CheckId.City_in_The_Sky_Baba_Tower_Narrow_Ledge_Chest,
//   CheckId.Outside_South_Castle_Town_Golden_Wolf,
//   CheckId.Snowpeak_Blizzard_Poe,
//   CheckId.Hyrule_Castle_Treasure_Room_Fourth_Chest,
//   CheckId.Arbiters_Grounds_West_Poe,
//   CheckId.Arbiters_Grounds_Torch_Room_East_Chest,
//   CheckId.Temple_of_Time_Big_Key_Chest,
//   CheckId.Lanayru_Spring_Back_Room_Right_Chest,
//   CheckId.City_in_The_Sky_East_Wing_Lower_Level_Chest,
//   CheckId.Lakebed_Temple_West_Second_Floor_Southwest_Underwater_Chest,
//   CheckId.Kakariko_Graveyard_Golden_Wolf,
//   CheckId.Goron_Mines_Beamos_Room_Chest,
//   CheckId.Ashei_Sketch,
//   CheckId.West_Hyrule_Field_Female_Butterfly,
//   CheckId.Sacred_Grove_Female_Snail,
//   CheckId.Faron_Woods_Owl_Statue_Sky_Character,
//   CheckId.Arbiters_Grounds_Spinner_Room_Stalfos_Alcove_Chest,
//   CheckId.Eldin_Stockcave_Lowest_Chest,
//   CheckId.Kakariko_Gorge_Poe,
//   CheckId.Lanayru_Field_Behind_Gate_Underwater_Chest,
//   CheckId.Arbiters_Grounds_East_Lower_Turnable_Redead_Chest,
//   CheckId.Sacred_Grove_Male_Snail,
//   CheckId.Eldin_Field_Stalfos_Grotto_Left_Small_Chest,
//   CheckId.Coro_Bottle,
//   CheckId.Lake_Lantern_Cave_Second_Poe,
//   CheckId.Lake_Lantern_Cave_Fourteenth_Chest,
//   CheckId.Snowpeak_Ruins_Mansion_Map,
//   CheckId.Flight_By_Fowl_Third_Platform_Chest,
//   CheckId.Lake_Lantern_Cave_Twelfth_Chest,
//   CheckId.Snowpeak_Ruins_Dungeon_Reward,
//   CheckId.Gerudo_Desert_Golden_Wolf,
//   CheckId.Gerudo_Desert_Campfire_West_Chest,
//   CheckId.Lakebed_Temple_West_Second_Floor_Northeast_Chest,
//   CheckId.Gerudo_Desert_Female_Dayfly,
//   CheckId.Palace_of_Twilight_West_Wing_Chest_Behind_Wall_of_Darkness,
//   CheckId.Forest_Temple_Big_Baba_Key,
//   CheckId.Sacred_Grove_Master_Sword_Poe,
//   CheckId.Temple_of_Time_First_Staircase_Armos_Chest,
//   CheckId.Outside_South_Castle_Town_Fountain_Chest,
//   CheckId.Arbiters_Grounds_Big_Key_Chest,
//   CheckId.Hyrule_Castle_Treasure_Room_Eighth_Small_Chest,
//   CheckId.Snowpeak_Ruins_West_Courtyard_Buried_Chest,
//   CheckId.Cave_of_Ordeals_Floor_33_Poe,
//   CheckId.Agitha_Male_Dayfly_Reward,
//   CheckId.Palace_of_Twilight_East_Wing_First_Room_Zant_Head_Chest,
//   CheckId.City_in_The_Sky_Big_Key_Chest,
//   CheckId.Hyrule_Castle_Treasure_Room_Third_Small_Chest,
//   CheckId.Goron_Mines_Main_Magnet_Room_Top_Chest,
//   CheckId.Agitha_Male_Butterfly_Reward,
//   CheckId.Outside_South_Castle_Town_Tektite_Grotto_Chest,
//   CheckId.Palace_of_Twilight_West_Wing_Second_Room_Lower_South_Chest,
//   CheckId.Goron_Mines_Gor_Ebizo_Key_Shard,
//   CheckId.Bridge_of_Eldin_Female_Phasmid,
//   CheckId.East_Castle_Town_Bridge_Poe,
//   CheckId.Forest_Temple_Entrance_Vines_Chest,
//   CheckId.Hyrule_Castle_Southeast_Balcony_Tower_Chest,
//   CheckId.Hyrule_Castle_Treasure_Room_Sixth_Small_Chest,
//   CheckId.Faron_Field_Bridge_Chest,
//   CheckId.Death_Mountain_Trail_Poe,
//   CheckId.Snowpeak_Ruins_Lobby_West_Armor_Chest,
//   CheckId.Charlo_Donation_Blessing,
//   CheckId.Snowpeak_Ruins_Lobby_Poe,
//   CheckId.City_in_The_Sky_Aeralfos_Chest,
//   CheckId.Faron_Woods_Owl_Statue_Chest,
//   CheckId.Snowpeak_Ruins_Wooden_Beam_Chandelier_Chest,
//   CheckId.City_in_The_Sky_Argorok_Heart_Container,
//   CheckId.Hyrule_Castle_Graveyard_Grave_Switch_Room_Front_Left_Chest,
//   CheckId.Snowpeak_Ruins_Courtyard_Central_Chest,
//   CheckId.Flight_By_Fowl_Second_Platform_Chest,
//   CheckId.Gerudo_Desert_Male_Dayfly,
//   CheckId.Gerudo_Desert_Northwest_Chest_Behind_Gates,
//   CheckId.Eldin_Spring_Underwater_Chest,
//   CheckId.Kakariko_Gorge_Owl_Statue_Chest,
//   CheckId.City_in_The_Sky_West_Garden_Lone_Island_Chest,
//   CheckId.Hyrule_Castle_Graveyard_Grave_Switch_Room_Right_Chest,
//   CheckId.Lanayru_Spring_West_Double_Clawshot_Chest,
//   CheckId.Snowpeak_Ruins_Broken_Floor_Chest,
//   CheckId.Arbiters_Grounds_Torch_Room_West_Chest,
//   CheckId.Isle_of_Riches_Poe,
//   CheckId.Goron_Mines_Crystal_Switch_Room_Underwater_Chest,
//   CheckId.City_in_The_Sky_West_Wing_First_Chest,
//   CheckId.Snowboard_Racing_Prize,
//   CheckId.Sacred_Grove_Baba_Serpent_Grotto_Chest,
//   CheckId.Lost_Woods_Boulder_Poe,
//   CheckId.City_in_The_Sky_Poe_Above_Central_Fan,
//   CheckId.Ordon_Sword,
//   CheckId.Hyrule_Castle_Treasure_Room_Second_Chest,
//   CheckId.Gerudo_Desert_South_Chest_Behind_Wooden_Gates,
//   CheckId.Snowpeak_Freezard_Grotto_Chest,
//   CheckId.Goron_Mines_Outside_Beamos_Chest,
//   CheckId.Palace_of_Twilight_Zant_Heart_Container,
//   CheckId.Castle_Town_Malo_Mart_Magic_Armor,
//   CheckId.Lakebed_Temple_East_Water_Supply_Clawshot_Chest,
//   CheckId.Jovani_House_Poe,
//   CheckId.Arbiters_Grounds_West_Chandelier_Chest,
//   CheckId.Hyrule_Field_Amphitheater_Owl_Statue_Sky_Character,
//   CheckId.Cave_of_Ordeals_Floor_44_Poe,
//   CheckId.Kakariko_Graveyard_Lantern_Chest,
//   CheckId.Forest_Temple_East_Tile_Worm_Chest,
//   CheckId.Agitha_Female_Snail_Reward,
//   CheckId.Lakebed_Temple_East_Water_Supply_Small_Chest,
//   CheckId.Eldin_Field_Female_Grasshopper,
//   CheckId.Goron_Mines_Dungeon_Reward,
//   CheckId.Arbiters_Grounds_Death_Sword_Chest,
//   CheckId.Lake_Hylia_Bridge_Female_Mantis,
//   CheckId.Arbiters_Grounds_East_Upper_Turnable_Chest,
//   CheckId.City_in_The_Sky_West_Wing_Baba_Balcony_Chest,
//   CheckId.Outside_Arbiters_Grounds_Lantern_Chest,
//   CheckId.Lakebed_Temple_West_Water_Supply_Small_Chest,
//   CheckId.Faron_Mist_Cave_Open_Chest,
//   CheckId.Lakebed_Temple_Lobby_Left_Chest,
//   CheckId.Bulblin_Guard_Key,
//   CheckId.Lake_Hylia_Underwater_Chest,
//   CheckId.Temple_of_Time_Armos_Antechamber_North_Chest,
//   CheckId.Lakebed_Temple_Big_Key_Chest,
//   CheckId.City_in_The_Sky_Chest_Below_Big_Key_Chest,
//   CheckId.Kakariko_Village_Female_Ant,
//   CheckId.Temple_of_Time_Poe_Behind_Gate,
//   CheckId.Kakariko_Gorge_Male_Pill_Bug,
//   CheckId.Palace_of_Twilight_East_Wing_Second_Room_Southeast_Chest,
//   CheckId.Hyrule_Castle_Graveyard_Grave_Switch_Room_Back_Left_Chest,
//   CheckId.City_in_The_Sky_West_Garden_Ledge_Chest,
//   CheckId.Lake_Hylia_Bridge_Male_Mantis,
//   CheckId.Eldin_Stockcave_Upper_Chest,
//   CheckId.Temple_of_Time_Floor_Switch_Puzzle_Room_Upper_Chest,
//   CheckId.Lake_Lantern_Cave_Third_Chest,
//   CheckId.Snowpeak_Ruins_Blizzeta_Heart_Container,
//   CheckId.Lanayru_Field_Spinner_Track_Chest,
//   CheckId.Iza_Raging_Rapids_Minigame,
//   CheckId.Arbiters_Grounds_North_Turning_Room_Chest,
//   CheckId.Agitha_Female_Pill_Bug_Reward,
//   CheckId.Goron_Mines_Main_Magnet_Room_Bottom_Chest,
//   CheckId.Goron_Mines_Gor_Amato_Small_Chest,
//   CheckId.Zoras_Domain_Waterfall_Poe,
//   CheckId.Forest_Temple_Diababa_Heart_Container,
//   CheckId.Arbiters_Grounds_Spinner_Room_Second_Small_Chest,
//   CheckId.Sacred_Grove_Spinner_Chest,
//   CheckId.Arbiters_Grounds_West_Stalfos_West_Chest,
//   CheckId.Forest_Temple_Big_Key_Chest,
//   CheckId.Gerudo_Desert_Rock_Grotto_Second_Poe,
//   CheckId.Lakebed_Temple_East_Second_Floor_Southwest_Chest,
//   CheckId.Temple_of_Time_Armos_Antechamber_East_Chest,
//   CheckId.Temple_of_Time_Armogohma_Heart_Container,
//   CheckId.Snowpeak_Ruins_West_Cannon_Room_Central_Chest,
//   CheckId.Kakariko_Graveyard_Grave_Poe,
//   CheckId.Gerudo_Desert_Campfire_North_Chest,
//   CheckId.Goron_Mines_Fyrus_Heart_Container,
//   CheckId.Hyrule_Castle_Lantern_Staircase_Chest,
//   CheckId.Goron_Mines_Magnet_Maze_Chest,
//   CheckId.Barnes_Bomb_Bag,
//   CheckId.Eldin_Field_Bomskit_Grotto_Lantern_Chest,
//   CheckId.City_in_The_Sky_Central_Outside_Poe_Island_Chest,
//   CheckId.STAR_Prize_2,
//   CheckId.City_in_The_Sky_West_Garden_Corner_Chest,
//   CheckId.Death_Mountain_Alcove_Chest,
//   CheckId.North_Castle_Town_Golden_Wolf,
//   CheckId.Forest_Temple_Second_Monkey_Under_Bridge_Chest,
//   CheckId.Gerudo_Desert_West_Canyon_Chest,
//   CheckId.Agitha_Male_Mantis_Reward,
//   CheckId.Lanayru_Ice_Block_Puzzle_Cave_Chest,
//   CheckId.City_in_The_Sky_West_Wing_Tile_Worm_Chest,
//   CheckId.Fishing_Hole_Heart_Piece,
//   CheckId.Bridge_of_Eldin_Male_Phasmid,
//   CheckId.Forest_Temple_Windless_Bridge_Chest,
//   CheckId.Zoras_Domain_Light_All_Torches_Chest,
//   CheckId.Palace_of_Twilight_West_Wing_Second_Room_Central_Chest,
//   CheckId.Rutelas_Blessing,
//   CheckId.City_in_The_Sky_East_Wing_After_Dinalfos_Alcove_Chest,
//   CheckId.Snowpeak_Cave_Ice_Poe,
//   CheckId.Lakebed_Temple_Stalactite_Room_Chest,
//   CheckId.Temple_of_Time_Armos_Antechamber_Statue_Chest,
//   CheckId.Cave_of_Ordeals_Floor_17_Poe,
//   CheckId.Arbiters_Grounds_West_Small_Chest_Behind_Block,
//   CheckId.Temple_of_Time_Gilloutine_Chest,
//   CheckId.Cats_Hide_and_Seek_Minigame,
//   CheckId.Goron_Mines_Entrance_Chest,
//   CheckId.Auru_Gift_To_Fyer,
//   CheckId.Snowpeak_Above_Freezard_Grotto_Poe,
//   CheckId.Lake_Lantern_Cave_First_Chest,
//   CheckId.Flight_By_Fowl_Fifth_Platform_Chest,
//   CheckId.Kakariko_Watchtower_Chest,
//   CheckId.Faron_Field_Corner_Grotto_Left_Chest,
//   CheckId.Outside_Lanayru_Spring_Left_Statue_Chest,
//   CheckId.Hidden_Village_Poe,
//   CheckId.Arbiters_Grounds_Ghoul_Rat_Room_Chest,
//   CheckId.Gerudo_Desert_East_Poe,
//   CheckId.Bulblin_Camp_Small_Chest_in_Back_of_Camp,
//   CheckId.Ilia_Memory_Reward,
//   CheckId.Lanayru_Spring_Back_Room_Lantern_Chest,
//   CheckId.Agitha_Female_Ladybug_Reward,
//   CheckId.Palace_of_Twilight_West_Wing_First_Room_Central_Chest,
//   CheckId.City_in_The_Sky_Dungeon_Reward,
//   CheckId.Kakariko_Gorge_Owl_Statue_Sky_Character,
//   CheckId.Forest_Temple_Gale_Boomerang,
//   CheckId.Gerudo_Desert_Skulltula_Grotto_Chest,
//   CheckId.Forest_Temple_West_Deku_Like_Chest,
//   CheckId.Agitha_Male_Stag_Beetle_Reward,
//   CheckId.Faron_Field_Male_Beetle,
//   CheckId.Palace_of_Twilight_East_Wing_First_Room_North_Small_Chest,
//   CheckId.Kakariko_Graveyard_Male_Ant,
//   CheckId.Temple_of_Time_Scales_Upper_Chest,
//   CheckId.Eldin_Field_Stalfos_Grotto_Stalfos_Chest,
//   CheckId.Ordon_Cat_Rescue,
//   CheckId.Lakebed_Temple_Underwater_Maze_Small_Chest,
//   CheckId.Snowpeak_Ruins_West_Cannon_Room_Corner_Chest,
//   CheckId.Lanayru_Spring_Underwater_Left_Chest,
//   CheckId.Lake_Hylia_Bridge_Owl_Statue_Chest,
//   CheckId.Talo_Sharpshooting,
//   CheckId.Lakebed_Temple_Central_Room_Spire_Chest,
//   CheckId.Lake_Hylia_Bridge_Owl_Statue_Sky_Character,
//   CheckId.Gerudo_Desert_North_Small_Chest_Before_Bulblin_Camp,
//   CheckId.Lakebed_Temple_Chandelier_Chest,
//   CheckId.Zoras_Domain_Extinguish_All_Torches_Chest,
//   CheckId.Lake_Lantern_Cave_End_Lantern_Chest,
//   CheckId.Temple_of_Time_Chest_Before_Darknut,
//   CheckId.Snowpeak_Poe_Among_Trees,
//   CheckId.Agitha_Male_Pill_Bug_Reward,
//   CheckId.Herding_Goats_Reward,
//   CheckId.Gerudo_Desert_North_Peahat_Poe,
//   CheckId.Snowpeak_Ruins_Chapel_Chest,
//   CheckId.Lakebed_Temple_Dungeon_Reward,
//   CheckId.Lake_Lantern_Cave_Sixth_Chest,
//   CheckId.Eldin_Field_Bomb_Rock_Chest,
//   CheckId.Agitha_Male_Grasshopper_Reward,
//   CheckId.Flight_By_Fowl_Top_Platform_Reward,
//   CheckId.Kakariko_Gorge_Double_Clawshot_Chest,
//   CheckId.Lanayru_Field_Bridge_Poe,
//   CheckId.Wooden_Statue,
//   CheckId.Fishing_Hole_Bottle,
//   CheckId.Snowpeak_Ruins_East_Courtyard_Chest,
//   CheckId.Lake_Hylia_Alcove_Poe,
//   CheckId.Lanayru_Field_Poe_Grotto_Right_Poe,
//   CheckId.Gerudo_Desert_Owl_Statue_Sky_Character,
//   CheckId.Gerudo_Desert_Owl_Statue_Chest,
//   CheckId.Palace_of_Twilight_Central_First_Room_Chest,
//   CheckId.Snowpeak_Ruins_Wooden_Beam_Central_Chest,
//   CheckId.Snowpeak_Ruins_Ball_and_Chain,
//   CheckId.Plumm_Fruit_Balloon_Minigame,
//   CheckId.Kakariko_Gorge_Spire_Heart_Piece,
//   CheckId.Lakebed_Temple_Before_Deku_Toad_Underwater_Right_Chest,
//   CheckId.Outside_Bulblin_Camp_Poe,
//   CheckId.Doctors_Office_Balcony_Chest,
//   CheckId.Outside_Lanayru_Spring_Right_Statue_Chest,
//   CheckId.Upper_Zoras_River_Poe,
//   CheckId.Bulblin_Camp_Poe,
//   CheckId.Hyrule_Castle_East_Wing_Balcony_Chest,
//   CheckId.Lake_Lantern_Cave_Seventh_Chest,
//   CheckId.Lanayru_Spring_East_Double_Clawshot_Chest,
//   CheckId.Snowpeak_Icy_Summit_Poe,
//   CheckId.Outside_South_Castle_Town_Poe,
//   CheckId.Temple_of_Time_Scales_Gohma_Chest,
//   CheckId.Goron_Mines_Gor_Amato_Key_Shard,
//   CheckId.Kakariko_Gorge_Female_Pill_Bug,
//   CheckId.Eldin_Stockcave_Lantern_Chest,
//   CheckId.Eldin_Lantern_Cave_Lantern_Chest,
//   CheckId.Agitha_Female_Butterfly_Reward,
//   CheckId.Outside_South_Castle_Town_Female_Ladybug,
//   CheckId.Hyrule_Castle_Treasure_Room_First_Chest,
//   CheckId.Telma_Invoice,
//   CheckId.Snowpeak_Ruins_Wooden_Beam_Northwest_Chest,
//   CheckId.Lakebed_Temple_Before_Deku_Toad_Alcove_Chest,
//   CheckId.Eldin_Lantern_Cave_Poe,
//   CheckId.Kakariko_Village_Malo_Mart_Hylian_Shield,
//   CheckId.Palace_of_Twilight_East_Wing_First_Room_East_Alcove,
//   CheckId.Bulblin_Camp_Roasted_Boar,
//   CheckId.Faron_Woods_Golden_Wolf,
//   CheckId.Jovani_60_Poe_Soul_Reward,
// ];

// type RowInfo = {
//   fieldIndex?: number;
//   groupName?: string;
//   checkIndex?: number;
// };

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

const selOptions: SelectOption[] = [
  {
    value: '1',
    label: 'LLLL',
  },
  {
    value: '2',
    label: 'Dog',
  },
  {
    value: '3',
    label: 'Progressive Fishing Rod Progressive Fishing Rod',
  },
  {
    value: '3',
    label: 'Progressive Fishing Rod',
  },
];

type ExcludedChecksProps = {
  useFormRet: UseFormReturn<FormSchema>;
};

function ExcludedChecks({ useFormRet }: ExcludedChecksProps) {
  const useFieldArrayRet = useFieldArray({
    name: 'excludedChecks',
    control: useFormRet.control,
  });

  const { fields, replace, prepend } = useFieldArrayRet;

  const [leftFilters, setLeftFilters] = useState<LeftListFilters>({ search: '', selectVal: null });
  console.log('newLeftFilters');
  console.log(leftFilters);

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
    return fullLeftRows.filter((checkId: CheckId) => {
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

  useEffect(() => {
    setTimeout(() => {
      // const newVal = selectedChecks.reduce<ExcludedCheckField[]>((acc, checkId, i) => {
      const newVal = alphabeticalCheckIds.reduce<ExcludedCheckField[]>((acc, checkId, i) => {
        if (i < 460) {
          acc.push({ checkId });
        }
        return acc;
      }, []);

      replace(newVal);
    }, 3000);
  }, [replace]);

  return (
    <div className="flex">
      <LeftList
        isAdd
        totalRenderedRows={filteredLeftRows.length}
        filteredEntityIds={filteredLeftRows}
        onSubmit={handleAdd}
        selectOptions={selOptions}
        filters={leftFilters}
        onFiltersChange={setLeftFilters}
        onRenderRowIndex={({ index, checkedRows, updateChecked }) => {
          const id = filteredLeftRows[index];
          const text = checkIdToName(id);
          const checked = Boolean(checkedRows[id]);

          return (
            <LeftListRow
              text={text}
              checked={checked}
              onClick={() => {
                updateChecked(String(id), !checked);
              }}
            />
          );
        }}
      />
      <div className="flex-1">
        <ListBtnRow
          isAdd
          onBtnClick={() => {}}
        />
        <Virtuoso
          style={{ height: '400px' }}
          totalCount={excludedChecksList.length}
          itemContent={index => {
            if (index === 22) {
              return <OtherRow />;
            } else {
              return <Row index={index} />;
            }
          }}
        />
      </div>
      <RightList useFieldArrayRet={useFieldArrayRet} />
    </div>
  );
}

type RightListProps = {
  useFieldArrayRet: UseFieldArrayReturn<FormSchema, 'excludedChecks'>;
};

function RightList({ useFieldArrayRet }: RightListProps) {
  const { fields } = useFieldArrayRet;

  const [checkedChecks, setCheckedChecks] = useState<Record<string, boolean>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const updateCheckedChecks: UpdateCheckedChecks = useCallback(
    (checkIds: CheckId | CheckId[], checked: boolean) => {
      if (Array.isArray(checkIds)) {
        const diff: Record<string, boolean> = {};

        checkIds.forEach(checkId => {
          diff[checkId] = checked;
        });

        setCheckedChecks(currVal => ({
          ...currVal,
          ...diff,
        }));
      } else {
        setCheckedChecks(currVal => ({
          ...currVal,
          [checkIds]: checked,
        }));
      }
    },
    [setCheckedChecks],
  );

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
    const selectedChecksById: Record<number, boolean> = {};
    fields.forEach(({ checkId }) => {
      selectedChecksById[checkId] = true;
    });

    const groupNames: string[] = [];
    let checkIdsInGroup: Record<string, boolean> = {};

    Object.keys(groupDefs).forEach(groupName => {
      const checksInGroup = groupDefs[groupName];
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
  }, [fields]);

  const { indexMapping, totalRows } = useMemo(() => {
    // Calc indexes and stuff for quick rendering.
    const idxMapping: Record<number, IndexInfo> = {};

    let currentIndex = 0;

    // Iterate over groups first
    groupsToShow.forEach(groupName => {
      idxMapping[currentIndex] = { groupName };
      currentIndex += 1;

      if (expandedGroups[groupName]) {
        groupDefs[groupName].forEach(checkId => {
          idxMapping[currentIndex] = { checkId, isSubRow: true };
          currentIndex += 1;
        });
      }
    });

    fields.forEach(({ checkId }) => {
      if (!checksInGroups[checkId]) {
        idxMapping[currentIndex] = { checkId };
        currentIndex += 1;
      }
    });

    return {
      indexMapping: idxMapping,
      totalRows: currentIndex,
    };
  }, [expandedGroups, groupsToShow, checksInGroups, fields]);

  return (
    <Virtuoso
      style={{ height: '400px' }}
      className="flex-1"
      totalCount={totalRows}
      itemContent={index => {
        const indexInfo = indexMapping[index];

        if ('checkId' in indexInfo) {
          return (
            <FancyRowCheck
              checkRowInfo={indexInfo}
              checked={checkedChecks[indexInfo.checkId]}
              updateCheckedChecks={updateCheckedChecks}
            />
          );
        } else if ('groupName' in indexInfo) {
          const { groupName } = indexInfo;
          return (
            <FancyRowGroup
              groupRowInfo={indexInfo}
              checkedChecks={checkedChecks}
              updateCheckedChecks={updateCheckedChecks}
              expanded={expandedGroups[groupName]}
              updateExpandedGroups={updateExpandedGroups}
            />
          );
        }
        return null; // Expected to never return null.
      }}
    />
  );
}

type FancyRowProps = {
  onClick(): void;
  onCheckChange: OnCheckChange;
  checked?: boolean;
  indeterminate?: boolean;
  expanded?: boolean;
  text?: string;
  isGroupNameRow?: boolean;
  isSubRow?: boolean;
};

function FancyRow({
  onClick,
  onCheckChange,
  checked = false,
  indeterminate = false,
  expanded = false,
  text = '',
  isGroupNameRow = false,
  isSubRow = false,
}: FancyRowProps) {
  return (
    <div
      className={clsx('flex items-center px-2', isSubRow && 'pl-5')}
      style={{ userSelect: 'none' }}
      onClick={onClick}
    >
      <Checkbox
        size="small"
        disableRipple
        sx={{ padding: 0, marginRight: '0.5rem' }}
        indeterminate={indeterminate}
        checked={indeterminate || checked}
        onClick={e => {
          e.stopPropagation();
        }}
        onChange={onCheckChange}
      />
      <span>{text}</span>
      {isGroupNameRow && <div className="ml-auto">{expanded ? 'A' : 'V'}</div>}
    </div>
  );
}

type FancyRowCheckProps = {
  checkRowInfo: CheckRowInfo;
  checked?: boolean;
  updateCheckedChecks: UpdateCheckedChecks;
};

function FancyRowCheck({ checkRowInfo, checked = false, updateCheckedChecks }: FancyRowCheckProps) {
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
    <FancyRow
      {...memoedProps}
      checked={checked}
      isSubRow={checkRowInfo.isSubRow}
    />
  );
}

type FancyRowGroupProps = {
  groupRowInfo: GroupRowInfo;
  checkedChecks: Record<string, boolean>;
  updateCheckedChecks: UpdateCheckedChecks;
  expanded?: boolean;
  updateExpandedGroups: UpdateExpandedGroups;
};

function FancyRowGroup({
  groupRowInfo,
  checkedChecks,
  updateCheckedChecks,
  expanded = false,
  updateExpandedGroups,
}: FancyRowGroupProps) {
  const { groupName } = groupRowInfo;

  const memoedProps = useMemo(() => {
    console.log(`doing memo for: ${groupName}`);

    let numChecked = 0;

    const groupDef = groupDefs[groupName];
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
    return `${groupName} (${groupDefs[groupName].length})`;
  }, [groupName]);

  const handleClick = useCallback(() => {
    updateExpandedGroups(groupName, !expanded);
  }, [groupName, updateExpandedGroups, expanded]);

  const handleCheckChange: OnCheckChange = useCallback(
    (e, tgtChecked) => {
      updateCheckedChecks(groupDefs[groupName], tgtChecked);
    },
    [groupName, updateCheckedChecks],
  );

  return (
    <FancyRow
      {...memoedProps}
      text={text}
      onClick={handleClick}
      onCheckChange={handleCheckChange}
      isGroupNameRow
    />
  );
}

export default ExcludedChecks;
