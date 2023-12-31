'use client';

import clsx from 'clsx';
import styles from './SharedSettingsPage.module.css';
import DemoSlider from './DemoSlider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import Button from '@mui/material/Button';
// import ListPickerLeft from './ListPickerLeft';
import Select from './Select';
import StartingInventoryList from './StartingInventoryList';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { type FormSchema } from './startingInventoryListShared';
import FormWatcher from './FormWatcher';
import ExcludedChecks from './ExcludedChecks';
import { CheckId } from './checks';

function SharedSettingsPage() {
  const useFormRet = useForm<FormSchema>({
    values: {
      list: [],
      excludedChecks: [
        { checkId: CheckId.Cave_of_Ordeals_Floor_17_Poe },
        { checkId: CheckId.Cave_of_Ordeals_Floor_33_Poe },
        { checkId: CheckId.Cave_of_Ordeals_Floor_44_Poe },
        { checkId: CheckId.Cave_of_Ordeals_Great_Fairy_Reward },
        { checkId: CheckId.Faron_Woods_Golden_Wolf },
        { checkId: CheckId.Gerudo_Desert_Golden_Wolf },
        { checkId: CheckId.Kakariko_Graveyard_Golden_Wolf },
        { checkId: CheckId.North_Castle_Town_Golden_Wolf },
        { checkId: CheckId.Ordon_Spring_Golden_Wolf },
        { checkId: CheckId.Outside_South_Castle_Town_Golden_Wolf },
        { checkId: CheckId.West_Hyrule_Field_Golden_Wolf },
        { checkId: CheckId.Jovani_20_Poe_Soul_Reward },
        { checkId: CheckId.Jovani_60_Poe_Soul_Reward },
        { checkId: CheckId.Doctors_Office_Balcony_Chest },
        { checkId: CheckId.Iza_Raging_Rapids_Minigame },
      ],
      exBool: false,
    },
    defaultValues: {
      list: [],
      excludedChecks: [],
      exBool: false,
    },
    mode: 'onChange',
  });

  console.log('useFormRet.formState.errors');
  console.log(useFormRet.formState.errors);

  const [tabIndex, setTabIndex] = useState(1);

  const handleTabChange = (e: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <div className="flex justify-center">
      <FormWatcher useFormRet={useFormRet} />
      <div style={{ maxWidth: '1100px', width: '100%' }}>
        <div className="mb-2 mx-1">
          <div
            className="flex justify-center rounded pb-1"
            style={{ backgroundColor: '#202124' }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
            >
              <Tab label="Main Rules" />
              <Tab label="Excluded Checks" />
              <Tab label="Starting Inventory" />
              <Tab label="Other" />
            </Tabs>
          </div>
        </div>
        <CustomTabPanel
          index={0}
          value={tabIndex}
        >
          <MainRulesPage />
        </CustomTabPanel>
        <CustomTabPanel
          index={1}
          value={tabIndex}
        >
          <ExcludedChecksPage useFormRet={useFormRet} />
        </CustomTabPanel>
        <CustomTabPanel
          index={2}
          value={tabIndex}
        >
          <StartingInventoryPage useFormRet={useFormRet} />
        </CustomTabPanel>
        <CustomTabPanel
          index={3}
          value={tabIndex}
        >
          <OtherPage />
        </CustomTabPanel>
      </div>
    </div>
  );
}

type CustomTabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function CustomTabPanel({ children, value, index, ...other }: CustomTabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

function MainRulesPage() {
  return (
    <>
      <Box>
        <div className="flex pr-4">
          <Select
            label="Logic Rules:"
            options={['Glitchless', 'Glitched', 'No Logic']}
            labelSameLine
          />
          <Button
            variant="contained"
            disableElevation
            sx={{ marginLeft: 'auto' }}
          >
            Load Preset
          </Button>
        </div>
      </Box>
      <div className="flex">
        <Box title="Access Options">
          <SubSection
            title="General"
            noTopMargin
          />
          <Select
            label="Hyrule Castle Requirements"
            options={['Open', 'Fused Shadows', 'Mirror Shards', 'All Dungeons', 'Vanilla']}
            defaultValue="Vanilla"
          />
          <Select
            label="Palace of Twilight Requirements"
            options={['Open', 'Fused Shadows', 'Mirror Shards', 'Vanilla']}
            defaultValue="Vanilla"
          />
          <Checkbox label="Open Faron Woods" />
          <Checkbox label="Open Door of Time" />
          <Checkbox label="Overworld Keysy" />
          <SubSection title="Dungeon Entrances" />
          <Checkbox label="Lakebed does not require Water Bombs" />
          <Checkbox label="Arbiter's does not require Bulblin Camp" />
          <Checkbox label="Snowpeak does not require Reekfish" />
          <Checkbox label="City does not require Skybook" />
          <Select
            label="Goron Mines Entrance"
            options={['Closed', 'No Wrestling', 'Open']}
          />
          <Select
            label="Temple of Time Entrance"
            options={['Closed', 'Open Grove', 'Open']}
          />
        </Box>
        <Box title="Shuffle">
          <Checkbox label="Golden Bugs" />
          <Checkbox label="Sky Characters" />
          <Checkbox label="Gifts from NPCs" />
          <Checkbox label="Shop Items" />
          <Checkbox label="Hidden Skills" />
          <Select
            label="Poe Souls"
            options={['Vanilla', 'Overworld', 'Dungeons', 'All']}
          />
          <DemoSlider
            label="Agitha Rewards"
            min={0}
            max={24}
          />
          {/* <Checkbox label="Shuffle Poe Souls" /> */}
        </Box>
        <Box title="Dungeon Settings">
          <Checkbox label="Unrequired Dungeons are Barren" />
          <Select
            label="Small Keys"
            options={['Vanilla', 'Own Dungeon', 'Any Dungeon', 'Keysanity', 'Keysy']}
          />
          <Select
            label="Big Keys"
            options={['Vanilla', 'Own Dungeon', 'Any Dungeon', 'Keysanity', 'Keysy']}
          />
          <Select
            label="Maps and Compasses"
            options={['Vanilla', 'Own Dungeon', 'Any Dungeon', 'Anywhere', 'Start With']}
          />
        </Box>
      </div>
    </>
  );
}

type ExcludedChecksPageProps = {
  useFormRet: UseFormReturn<FormSchema>;
};

function ExcludedChecksPage({ useFormRet }: ExcludedChecksPageProps) {
  // return <Box>In excluded checks page</Box>;
  return (
    <Box>
      <ExcludedChecks useFormRet={useFormRet} />
    </Box>
  );
}

type StartingInventoryPageProps = {
  useFormRet: UseFormReturn<FormSchema>;
};

function StartingInventoryPage({ useFormRet }: StartingInventoryPageProps) {
  // return <Box>In starting inventory page</Box>;
  return (
    <Box>
      <StartingInventoryList useFormRet={useFormRet} />
      <div className="mt-4 pl-3 flex items-center">
        <input
          type="checkbox"
          {...useFormRet.register('exBool')}
        />
        <span className="ml-2">checkbox</span>
      </div>
    </Box>
  );
  // return (
  //   <Box>
  //     <div>In Starting Inventory page</div>
  //     <ListPickerLeft
  //       items={startingInventory}
  //       onAddClick={() => {}}
  //     />
  //   </Box>
  // );
}

function OtherPage() {
  return (
    <div className="flex">
      <Box title="Timesavers">
        <SubSection
          title="Skips"
          noTopMargin
        />
        <Checkbox label="Skip Prologue" />
        <Checkbox label="Faron Twilight Cleared" />
        <Checkbox label="Eldin Twilight Cleared" />
        <Checkbox label="Lanayru Twilight Cleared" />
        <Checkbox label="Skip Midna's Desperate Hour" />
        <Checkbox label="Skip Minor Cutscenes" />
        <SubSection title="Other" />
        <Checkbox label="Fast Iron Boots" />
        <Checkbox label="Fast Spinner" />
        <Checkbox label="Quick Transform" />
        <Checkbox label="Transform Anywhere" />
        <Checkbox label="Instant Message Text" />
        <Checkbox label="Unlock Map Regions" />
      </Box>
      <Box title="Shops & Rupees">
        <SubSection
          title="General"
          noTopMargin
        />
        <Checkbox label="Shop Models Show the Replaced Item" />
        <Checkbox label="Increase Wallet Capacity" />
        <SubSection title="Malo Mart Quest" />
        <Checkbox label="Bridge Donation Completed" />
        <DemoSlider
          label="Malo Mart New Branch Donation"
          min={0}
          max={2000}
          defaultValue={2000}
        />
        <DemoSlider
          label="Malo Mart New Branch Donation (reduced)"
          min={0}
          max={2000}
          defaultValue={200}
        />
        <DemoSlider
          label="Magic Armor Price"
          min={0}
          max={1000}
          defaultValue={598}
        />
      </Box>
      <Box title="Miscellaneous">
        <Select
          label="Hint Settings"
          options={['None', '<New Stuff>', 'French Community S1']}
          defaultValue="<New Stuff>"
        />
        <Select
          label="Damage Multiplier"
          options={['Glitchless', 'Glitched', 'No Logic']}
        />
        <Select
          label="Item Scarcity"
          options={['Vanilla', 'Minimal', 'Plentiful']}
        />
        <Select
          label="Trap Item Frequency"
          options={['None', 'Few', 'Many', 'Mayhem', 'Nightmare']}
        />
      </Box>
    </div>
  );
}

type BoxProps = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

function Box({ title = undefined, children = undefined, className = undefined }: BoxProps) {
  return (
    <div className={clsx(styles.box, 'flex-1', className)}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.boxContent}>{children}</div>
    </div>
  );
}

type CheckboxProps = {
  label: string;
};

function Checkbox({ label }: CheckboxProps) {
  return (
    <label className={styles.checkboxRoot}>
      <input
        type="checkbox"
        className="me-1"
      />
      {label}
    </label>
  );
}

type SubSectionProps = {
  title: string;
  noTopMargin?: boolean;
};

function SubSection({ title, noTopMargin = false }: SubSectionProps) {
  return (
    <div className={clsx(styles.subsectionRoot, noTopMargin && styles.subsectionRootNoTopMargin)}>
      <div className={clsx(styles.subsectionInner, 'text-sm')}>{title}</div>
    </div>
  );
}

export default SharedSettingsPage;
