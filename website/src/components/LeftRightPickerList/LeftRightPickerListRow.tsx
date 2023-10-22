import { Checkbox } from '@mui/material';
import styles from './LeftRightPickerList.module.css';
import clsx from 'clsx';
import type { ChangeEvent } from 'react';

// type LeftRightPickerListRowProps = {
//   text?: string;
//   checked: boolean;
//   onClick(): void;
// };

// function LeftRightPickerListRow({ text = '', checked, onClick }: LeftRightPickerListRowProps) {
//   return (
//     <div
//       onClick={onClick}
//       className={styles.rowRoot}
//       style={{ userSelect: 'none' }}
//     >
//       <input
//         type="checkbox"
//         checked={checked}
//         readOnly
//       />
//       <span>{text}</span>
//     </div>
//   );
// }

type OnCheckChange = (e: ChangeEvent<HTMLInputElement>, tgtChecked: boolean) => void;

type LeftRightPickerListRowProps = {
  onClick(): void;
  onCheckChange: OnCheckChange;
  checked?: boolean;
  indeterminate?: boolean;
  expanded?: boolean;
  text?: string;
  isGroupNameRow?: boolean;
  isSubRow?: boolean;
  appearAnim?: boolean;
};

function LeftRightPickerListRow({
  onClick,
  onCheckChange,
  checked = false,
  indeterminate = false,
  expanded = false,
  text = '',
  isGroupNameRow = false,
  isSubRow = false,
  appearAnim = false,
}: LeftRightPickerListRowProps) {
  return (
    <div
      className={clsx(
        'flex items-center pr-2',
        isSubRow && 'pl-5',
        styles.rowRoot,
        appearAnim && styles.appearAnim,
      )}
      style={{ userSelect: 'none' }}
      onClick={onClick}
    >
      <Checkbox
        size="small"
        disableRipple
        sx={{ padding: 0 }}
        indeterminate={indeterminate}
        checked={indeterminate || checked}
        onClick={e => {
          e.stopPropagation();
        }}
        onChange={onCheckChange}
      />
      <span className={styles.rowText}>{text}</span>
      {isGroupNameRow && <div className="ml-auto">{expanded ? 'A' : 'V'}</div>}
    </div>
  );
}

export default LeftRightPickerListRow;
