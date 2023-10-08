import clsx from 'clsx';
import styles from './SharedSettingsPage.module.css';
import DemoSlider from './DemoSlider';

function SharedSettingsPage() {
  return (
    <div className="flex justify-center">
      <div style={{ maxWidth: '1100px', width: '100%' }}>
        <Box>
          <Select
            label="Logic Rules:"
            options={['Glitchless', 'Glitched', 'No Logic']}
            labelSameLine
          />
        </Box>
        <div className="flex">
          <Box title="Access Options">
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
      </div>
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

type SelectProps = {
  label: string;
  options: string[];
  defaultValue?: string;
  labelSameLine?: boolean;
};

function Select({ label, options, defaultValue = undefined, labelSameLine = false }: SelectProps) {
  return (
    <div className="py-1">
      <span
        className={clsx(
          labelSameLine ? styles.selectLabelSameLine : styles.selectLabelNotSameLine,
          'leading-tight',
        )}
      >
        {label}
      </span>
      <select
        className={styles.select}
        defaultValue={defaultValue}
      >
        {options.map(option => {
          return (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}

type SubSectionProps = {
  title: string;
};

function SubSection({ title }: SubSectionProps) {
  return (
    <div className={styles.subsectionRoot}>
      <div className={clsx(styles.subsectionInner, 'text-sm')}>{title}</div>
    </div>
  );
}

export default SharedSettingsPage;
