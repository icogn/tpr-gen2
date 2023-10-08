import clsx from 'clsx';
import styles from './SharedSettingsPage.module.css';
import DemoSlider from './DemoSlider';

function SharedSettingsPage() {
  return (
    <div>
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
        <Box title="Dungeon Items">def</Box>
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

export default SharedSettingsPage;
