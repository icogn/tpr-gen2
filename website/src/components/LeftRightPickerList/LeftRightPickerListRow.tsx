type LeftRightPickerListRowProps = {
  text?: string;
  checked: boolean;
  onClick(): void;
};

function LeftRightPickerListRow({ text = '', checked, onClick }: LeftRightPickerListRowProps) {
  return (
    <div
      onClick={onClick}
      style={{ userSelect: 'none' }}
    >
      <input
        type="checkbox"
        checked={checked}
        readOnly
      />
      <span>{text}</span>
    </div>
  );
}

export default LeftRightPickerListRow;
