import clsx from 'clsx';
import styles from './SharedSettingsPage.module.css';

type SelectProps = {
  label?: string;
  options: string[];
  defaultValue?: string;
  labelSameLine?: boolean;
};

function Select({
  label = undefined,
  options,
  defaultValue = undefined,
  labelSameLine = false,
}: SelectProps) {
  return (
    <div className="py-1">
      {label != null && (
        <span
          className={clsx(
            labelSameLine ? styles.selectLabelSameLine : styles.selectLabelNotSameLine,
            'leading-tight',
          )}
        >
          {label}
        </span>
      )}
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

export default Select;
