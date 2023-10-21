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
  'Lanayru Spring': [
    CheckId.Lanayru_Spring_Back_Room_Lantern_Chest,
    CheckId.Lanayru_Spring_Back_Room_Left_Chest,
    CheckId.Lanayru_Spring_Back_Room_Right_Chest,
    CheckId.Lanayru_Spring_East_Double_Clawshot_Chest,
    CheckId.Lanayru_Spring_Underwater_Left_Chest,
    CheckId.Lanayru_Spring_Underwater_Right_Chest,
    CheckId.Lanayru_Spring_West_Double_Clawshot_Chest,
  ],
  "Zora's Domain": [
    CheckId.Zoras_Domain_Chest_Behind_Waterfall,
    CheckId.Zoras_Domain_Chest_By_Mother_and_Child_Isles,
    CheckId.Zoras_Domain_Extinguish_All_Torches_Chest,
    CheckId.Zoras_Domain_Light_All_Torches_Chest,
    CheckId.Zoras_Domain_Male_Dragonfly,
    CheckId.Zoras_Domain_Mother_and_Child_Isle_Poe,
    CheckId.Zoras_Domain_Underwater_Goron,
    CheckId.Zoras_Domain_Waterfall_Poe,
  ],
  "Upper Zora's River": [
    CheckId.Fishing_Hole_Bottle,
    CheckId.Fishing_Hole_Heart_Piece,
    CheckId.Upper_Zoras_River_Female_Dragonfly,
    CheckId.Upper_Zoras_River_Poe,
  ],
  'Gerudo Desert': [
    CheckId.Gerudo_Desert_Campfire_East_Chest,
    CheckId.Gerudo_Desert_Campfire_North_Chest,
    CheckId.Gerudo_Desert_Campfire_West_Chest,
    CheckId.Gerudo_Desert_East_Canyon_Chest,
    CheckId.Gerudo_Desert_East_Poe,
    CheckId.Gerudo_Desert_Female_Dayfly,
    CheckId.Gerudo_Desert_Lone_Small_Chest,
    CheckId.Gerudo_Desert_Male_Dayfly,
    CheckId.Gerudo_Desert_North_Peahat_Poe,
    CheckId.Gerudo_Desert_North_Small_Chest_Before_Bulblin_Camp,
    CheckId.Gerudo_Desert_Northeast_Chest_Behind_Gates,
    CheckId.Gerudo_Desert_Northwest_Chest_Behind_Gates,
    CheckId.Gerudo_Desert_Owl_Statue_Chest,
    CheckId.Gerudo_Desert_Owl_Statue_Sky_Character,
    CheckId.Gerudo_Desert_Peahat_Ledge_Chest,
    CheckId.Gerudo_Desert_Poe_Above_Cave_of_Ordeals,
    CheckId.Gerudo_Desert_Rock_Grotto_First_Poe,
    CheckId.Gerudo_Desert_Rock_Grotto_Lantern_Chest,
    CheckId.Gerudo_Desert_Rock_Grotto_Second_Poe,
    CheckId.Gerudo_Desert_Skulltula_Grotto_Chest,
    CheckId.Gerudo_Desert_South_Chest_Behind_Wooden_Gates,
    CheckId.Gerudo_Desert_West_Canyon_Chest,
  ],
  'Bulblin Camp': [
    CheckId.Bulblin_Camp_First_Chest_Under_Tower_At_Entrance,
    CheckId.Bulblin_Camp_Poe,
    CheckId.Bulblin_Camp_Roasted_Boar,
    CheckId.Bulblin_Camp_Small_Chest_in_Back_of_Camp,
    CheckId.Bulblin_Guard_Key,
    CheckId.Outside_Arbiters_Grounds_Lantern_Chest,
    CheckId.Outside_Arbiters_Grounds_Poe,
    CheckId.Outside_Bulblin_Camp_Poe,
  ],
  Snowpeak: [
    CheckId.Ashei_Sketch,
    CheckId.Snowboard_Racing_Prize,
    CheckId.Snowpeak_Above_Freezard_Grotto_Poe,
    CheckId.Snowpeak_Blizzard_Poe,
    CheckId.Snowpeak_Cave_Ice_Lantern_Chest,
    CheckId.Snowpeak_Cave_Ice_Poe,
    CheckId.Snowpeak_Freezard_Grotto_Chest,
    CheckId.Snowpeak_Icy_Summit_Poe,
    CheckId.Snowpeak_Poe_Among_Trees,
  ],
  "Hero's Shade": [
    CheckId.Faron_Woods_Golden_Wolf,
    CheckId.Gerudo_Desert_Golden_Wolf,
    CheckId.Kakariko_Graveyard_Golden_Wolf,
    CheckId.North_Castle_Town_Golden_Wolf,
    CheckId.Ordon_Spring_Golden_Wolf,
    CheckId.Outside_South_Castle_Town_Golden_Wolf,
    CheckId.West_Hyrule_Field_Golden_Wolf,
  ],
  'Multi-zone': [
    CheckId.Goron_Springwater_Rush,
    CheckId.Iza_Helping_Hand,
    CheckId.Iza_Raging_Rapids_Minigame,
    CheckId.Plumm_Fruit_Balloon_Minigame,
  ],
  'Cave of Ordeals': [
    CheckId.Cave_of_Ordeals_Floor_17_Poe,
    CheckId.Cave_of_Ordeals_Floor_33_Poe,
    CheckId.Cave_of_Ordeals_Floor_44_Poe,
    CheckId.Cave_of_Ordeals_Great_Fairy_Reward,
  ],
  'Forest Temple': [
    CheckId.Forest_Temple_Big_Baba_Key,
    CheckId.Forest_Temple_Big_Key_Chest,
    CheckId.Forest_Temple_Central_Chest_Behind_Stairs,
    CheckId.Forest_Temple_Central_Chest_Hanging_From_Web,
    CheckId.Forest_Temple_Central_North_Chest,
    CheckId.Forest_Temple_Diababa_Heart_Container,
    CheckId.Forest_Temple_Dungeon_Reward,
    CheckId.Forest_Temple_East_Tile_Worm_Chest,
    CheckId.Forest_Temple_East_Water_Cave_Chest,
    CheckId.Forest_Temple_Entrance_Vines_Chest,
    CheckId.Forest_Temple_Gale_Boomerang,
    CheckId.Forest_Temple_North_Deku_Like_Chest,
    CheckId.Forest_Temple_Second_Monkey_Under_Bridge_Chest,
    CheckId.Forest_Temple_Totem_Pole_Chest,
    CheckId.Forest_Temple_West_Deku_Like_Chest,
    CheckId.Forest_Temple_West_Tile_Worm_Chest_Behind_Stairs,
    CheckId.Forest_Temple_West_Tile_Worm_Room_Vines_Chest,
    CheckId.Forest_Temple_Windless_Bridge_Chest,
  ],
  'Goron Mines': [
    CheckId.Goron_Mines_After_Crystal_Switch_Room_Magnet_Wall_Chest,
    CheckId.Goron_Mines_Beamos_Room_Chest,
    CheckId.Goron_Mines_Chest_Before_Dangoro,
    CheckId.Goron_Mines_Crystal_Switch_Room_Small_Chest,
    CheckId.Goron_Mines_Crystal_Switch_Room_Underwater_Chest,
    CheckId.Goron_Mines_Dangoro_Chest,
    CheckId.Goron_Mines_Dungeon_Reward,
    CheckId.Goron_Mines_Entrance_Chest,
    CheckId.Goron_Mines_Fyrus_Heart_Container,
    CheckId.Goron_Mines_Gor_Amato_Chest,
    CheckId.Goron_Mines_Gor_Amato_Key_Shard,
    CheckId.Goron_Mines_Gor_Amato_Small_Chest,
    CheckId.Goron_Mines_Gor_Ebizo_Chest,
    CheckId.Goron_Mines_Gor_Ebizo_Key_Shard,
    CheckId.Goron_Mines_Gor_Liggs_Chest,
    CheckId.Goron_Mines_Gor_Liggs_Key_Shard,
    CheckId.Goron_Mines_Magnet_Maze_Chest,
    CheckId.Goron_Mines_Main_Magnet_Room_Bottom_Chest,
    CheckId.Goron_Mines_Main_Magnet_Room_Top_Chest,
    CheckId.Goron_Mines_Outside_Beamos_Chest,
    CheckId.Goron_Mines_Outside_Clawshot_Chest,
    CheckId.Goron_Mines_Outside_Underwater_Chest,
  ],
  'Lakebed Temple': [
    CheckId.Lakebed_Temple_Before_Deku_Toad_Alcove_Chest,
    CheckId.Lakebed_Temple_Before_Deku_Toad_Underwater_Left_Chest,
    CheckId.Lakebed_Temple_Before_Deku_Toad_Underwater_Right_Chest,
    CheckId.Lakebed_Temple_Big_Key_Chest,
    CheckId.Lakebed_Temple_Central_Room_Chest,
    CheckId.Lakebed_Temple_Central_Room_Small_Chest,
    CheckId.Lakebed_Temple_Central_Room_Spire_Chest,
    CheckId.Lakebed_Temple_Chandelier_Chest,
    CheckId.Lakebed_Temple_Deku_Toad_Chest,
    CheckId.Lakebed_Temple_Dungeon_Reward,
    CheckId.Lakebed_Temple_East_Lower_Waterwheel_Bridge_Chest,
    CheckId.Lakebed_Temple_East_Lower_Waterwheel_Stalactite_Chest,
    CheckId.Lakebed_Temple_East_Second_Floor_Southeast_Chest,
    CheckId.Lakebed_Temple_East_Second_Floor_Southwest_Chest,
    CheckId.Lakebed_Temple_East_Water_Supply_Clawshot_Chest,
    CheckId.Lakebed_Temple_East_Water_Supply_Small_Chest,
    CheckId.Lakebed_Temple_Lobby_Left_Chest,
    CheckId.Lakebed_Temple_Lobby_Rear_Chest,
    CheckId.Lakebed_Temple_Morpheel_Heart_Container,
    CheckId.Lakebed_Temple_Stalactite_Room_Chest,
    CheckId.Lakebed_Temple_Underwater_Maze_Small_Chest,
    CheckId.Lakebed_Temple_West_Lower_Small_Chest,
    CheckId.Lakebed_Temple_West_Second_Floor_Central_Small_Chest,
    CheckId.Lakebed_Temple_West_Second_Floor_Northeast_Chest,
    CheckId.Lakebed_Temple_West_Second_Floor_Southeast_Chest,
    CheckId.Lakebed_Temple_West_Second_Floor_Southwest_Underwater_Chest,
    CheckId.Lakebed_Temple_West_Water_Supply_Chest,
    CheckId.Lakebed_Temple_West_Water_Supply_Small_Chest,
  ],
  "Arbiter's Grounds": [
    CheckId.Arbiters_Grounds_Big_Key_Chest,
    CheckId.Arbiters_Grounds_Death_Sword_Chest,
    CheckId.Arbiters_Grounds_East_Lower_Turnable_Redead_Chest,
    CheckId.Arbiters_Grounds_East_Turning_Room_Poe,
    CheckId.Arbiters_Grounds_East_Upper_Turnable_Chest,
    CheckId.Arbiters_Grounds_East_Upper_Turnable_Redead_Chest,
    CheckId.Arbiters_Grounds_Entrance_Chest,
    CheckId.Arbiters_Grounds_Ghoul_Rat_Room_Chest,
    CheckId.Arbiters_Grounds_Hidden_Wall_Poe,
    CheckId.Arbiters_Grounds_North_Turning_Room_Chest,
    CheckId.Arbiters_Grounds_Spinner_Room_First_Small_Chest,
    CheckId.Arbiters_Grounds_Spinner_Room_Lower_Central_Small_Chest,
    CheckId.Arbiters_Grounds_Spinner_Room_Lower_North_Chest,
    CheckId.Arbiters_Grounds_Spinner_Room_Second_Small_Chest,
    CheckId.Arbiters_Grounds_Spinner_Room_Stalfos_Alcove_Chest,
    CheckId.Arbiters_Grounds_Stallord_Heart_Container,
    CheckId.Arbiters_Grounds_Torch_Room_East_Chest,
    CheckId.Arbiters_Grounds_Torch_Room_Poe,
    CheckId.Arbiters_Grounds_Torch_Room_West_Chest,
    CheckId.Arbiters_Grounds_West_Chandelier_Chest,
    CheckId.Arbiters_Grounds_West_Poe,
    CheckId.Arbiters_Grounds_West_Small_Chest_Behind_Block,
    CheckId.Arbiters_Grounds_West_Stalfos_Northeast_Chest,
    CheckId.Arbiters_Grounds_West_Stalfos_West_Chest,
  ],
  'Snowpeak Ruins': [
    CheckId.Snowpeak_Ruins_Ball_and_Chain,
    CheckId.Snowpeak_Ruins_Blizzeta_Heart_Container,
    CheckId.Snowpeak_Ruins_Broken_Floor_Chest,
    CheckId.Snowpeak_Ruins_Chapel_Chest,
    CheckId.Snowpeak_Ruins_Chest_After_Darkhammer,
    CheckId.Snowpeak_Ruins_Courtyard_Central_Chest,
    CheckId.Snowpeak_Ruins_Dungeon_Reward,
    CheckId.Snowpeak_Ruins_East_Courtyard_Buried_Chest,
    CheckId.Snowpeak_Ruins_East_Courtyard_Chest,
    CheckId.Snowpeak_Ruins_Ice_Room_Poe,
    CheckId.Snowpeak_Ruins_Lobby_Armor_Poe,
    CheckId.Snowpeak_Ruins_Lobby_Chandelier_Chest,
    CheckId.Snowpeak_Ruins_Lobby_East_Armor_Chest,
    CheckId.Snowpeak_Ruins_Lobby_Poe,
    CheckId.Snowpeak_Ruins_Lobby_West_Armor_Chest,
    CheckId.Snowpeak_Ruins_Mansion_Map,
    CheckId.Snowpeak_Ruins_Northeast_Chandelier_Chest,
    CheckId.Snowpeak_Ruins_Ordon_Pumpkin_Chest,
    CheckId.Snowpeak_Ruins_West_Cannon_Room_Central_Chest,
    CheckId.Snowpeak_Ruins_West_Cannon_Room_Corner_Chest,
    CheckId.Snowpeak_Ruins_West_Courtyard_Buried_Chest,
    CheckId.Snowpeak_Ruins_Wooden_Beam_Central_Chest,
    CheckId.Snowpeak_Ruins_Wooden_Beam_Chandelier_Chest,
    CheckId.Snowpeak_Ruins_Wooden_Beam_Northwest_Chest,
  ],
  'Temple of Time': [
    CheckId.Temple_of_Time_Armogohma_Heart_Container,
    CheckId.Temple_of_Time_Armos_Antechamber_East_Chest,
    CheckId.Temple_of_Time_Armos_Antechamber_North_Chest,
    CheckId.Temple_of_Time_Armos_Antechamber_Statue_Chest,
    CheckId.Temple_of_Time_Big_Key_Chest,
    CheckId.Temple_of_Time_Chest_Before_Darknut,
    CheckId.Temple_of_Time_Darknut_Chest,
    CheckId.Temple_of_Time_Dungeon_Reward,
    CheckId.Temple_of_Time_First_Staircase_Armos_Chest,
    CheckId.Temple_of_Time_First_Staircase_Gohma_Gate_Chest,
    CheckId.Temple_of_Time_First_Staircase_Window_Chest,
    CheckId.Temple_of_Time_Floor_Switch_Puzzle_Room_Upper_Chest,
    CheckId.Temple_of_Time_Gilloutine_Chest,
    CheckId.Temple_of_Time_Lobby_Lantern_Chest,
    CheckId.Temple_of_Time_Moving_Wall_Beamos_Room_Chest,
    CheckId.Temple_of_Time_Moving_Wall_Dinalfos_Room_Chest,
    CheckId.Temple_of_Time_Poe_Above_Scales,
    CheckId.Temple_of_Time_Poe_Behind_Gate,
    CheckId.Temple_of_Time_Scales_Gohma_Chest,
    CheckId.Temple_of_Time_Scales_Upper_Chest,
  ],
  'City in the Sky': [
    CheckId.City_in_The_Sky_Aeralfos_Chest,
    CheckId.City_in_The_Sky_Argorok_Heart_Container,
    CheckId.City_in_The_Sky_Baba_Tower_Alcove_Chest,
    CheckId.City_in_The_Sky_Baba_Tower_Narrow_Ledge_Chest,
    CheckId.City_in_The_Sky_Baba_Tower_Top_Small_Chest,
    CheckId.City_in_The_Sky_Big_Key_Chest,
    CheckId.City_in_The_Sky_Central_Outside_Ledge_Chest,
    CheckId.City_in_The_Sky_Central_Outside_Poe_Island_Chest,
    CheckId.City_in_The_Sky_Chest_Behind_North_Fan,
    CheckId.City_in_The_Sky_Chest_Below_Big_Key_Chest,
    CheckId.City_in_The_Sky_Dungeon_Reward,
    CheckId.City_in_The_Sky_East_First_Wing_Chest_After_Fans,
    CheckId.City_in_The_Sky_East_Tile_Worm_Small_Chest,
    CheckId.City_in_The_Sky_East_Wing_After_Dinalfos_Alcove_Chest,
    CheckId.City_in_The_Sky_East_Wing_After_Dinalfos_Ledge_Chest,
    CheckId.City_in_The_Sky_East_Wing_Lower_Level_Chest,
    CheckId.City_in_The_Sky_Garden_Island_Poe,
    CheckId.City_in_The_Sky_Poe_Above_Central_Fan,
    CheckId.City_in_The_Sky_Underwater_East_Chest,
    CheckId.City_in_The_Sky_Underwater_West_Chest,
    CheckId.City_in_The_Sky_West_Garden_Corner_Chest,
    CheckId.City_in_The_Sky_West_Garden_Ledge_Chest,
    CheckId.City_in_The_Sky_West_Garden_Lone_Island_Chest,
    CheckId.City_in_The_Sky_West_Garden_Lower_Chest,
    CheckId.City_in_The_Sky_West_Wing_Baba_Balcony_Chest,
    CheckId.City_in_The_Sky_West_Wing_First_Chest,
    CheckId.City_in_The_Sky_West_Wing_Narrow_Ledge_Chest,
    CheckId.City_in_The_Sky_West_Wing_Tile_Worm_Chest,
  ],
  'Palace of Twilight': [
    CheckId.Palace_of_Twilight_Big_Key_Chest,
    CheckId.Palace_of_Twilight_Central_First_Room_Chest,
    CheckId.Palace_of_Twilight_Central_Outdoor_Chest,
    CheckId.Palace_of_Twilight_Central_Tower_Chest,
    CheckId.Palace_of_Twilight_Collect_Both_Sols,
    CheckId.Palace_of_Twilight_East_Wing_First_Room_East_Alcove,
    CheckId.Palace_of_Twilight_East_Wing_First_Room_North_Small_Chest,
    CheckId.Palace_of_Twilight_East_Wing_First_Room_West_Alcove,
    CheckId.Palace_of_Twilight_East_Wing_First_Room_Zant_Head_Chest,
    CheckId.Palace_of_Twilight_East_Wing_Second_Room_Northeast_Chest,
    CheckId.Palace_of_Twilight_East_Wing_Second_Room_Northwest_Chest,
    CheckId.Palace_of_Twilight_East_Wing_Second_Room_Southeast_Chest,
    CheckId.Palace_of_Twilight_East_Wing_Second_Room_Southwest_Chest,
    CheckId.Palace_of_Twilight_West_Wing_Chest_Behind_Wall_of_Darkness,
    CheckId.Palace_of_Twilight_West_Wing_First_Room_Central_Chest,
    CheckId.Palace_of_Twilight_West_Wing_Second_Room_Central_Chest,
    CheckId.Palace_of_Twilight_West_Wing_Second_Room_Lower_South_Chest,
    CheckId.Palace_of_Twilight_West_Wing_Second_Room_Southeast_Chest,
    CheckId.Palace_of_Twilight_Zant_Heart_Container,
  ],
  'Hyrule Castle': [
    CheckId.Hyrule_Castle_Big_Key_Chest,
    CheckId.Hyrule_Castle_East_Wing_Balcony_Chest,
    CheckId.Hyrule_Castle_East_Wing_Boomerang_Puzzle_Chest,
    CheckId.Hyrule_Castle_Graveyard_Grave_Switch_Room_Back_Left_Chest,
    CheckId.Hyrule_Castle_Graveyard_Grave_Switch_Room_Front_Left_Chest,
    CheckId.Hyrule_Castle_Graveyard_Grave_Switch_Room_Right_Chest,
    CheckId.Hyrule_Castle_Graveyard_Owl_Statue_Chest,
    CheckId.Hyrule_Castle_King_Bulblin_Key,
    CheckId.Hyrule_Castle_Lantern_Staircase_Chest,
    CheckId.Hyrule_Castle_Main_Hall_Northeast_Chest,
    CheckId.Hyrule_Castle_Main_Hall_Northwest_Chest,
    CheckId.Hyrule_Castle_Main_Hall_Southwest_Chest,
    CheckId.Hyrule_Castle_Southeast_Balcony_Tower_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Eighth_Small_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Fifth_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Fifth_Small_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_First_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_First_Small_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Fourth_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Fourth_Small_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Second_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Second_Small_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Seventh_Small_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Sixth_Small_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Third_Chest,
    CheckId.Hyrule_Castle_Treasure_Room_Third_Small_Chest,
    CheckId.Hyrule_Castle_West_Courtyard_Central_Small_Chest,
    CheckId.Hyrule_Castle_West_Courtyard_North_Small_Chest,
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
