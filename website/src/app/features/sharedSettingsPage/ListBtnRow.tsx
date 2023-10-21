import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Button } from '@mui/material';

type ListBtnRowProps = {
  totalSelected?: number;
  isAdd: boolean;
  onBtnClick(): void;
};

function ListBtnRow({ totalSelected = 0, isAdd, onBtnClick }: ListBtnRowProps) {
  const nodes: React.ReactNode[] = [];

  const sharedBtnProps = {
    disableElevation: true,
    disabled: totalSelected < 1,
    onClick: onBtnClick,
  };

  const tryPushTotalSelectedSpan = () => {
    if (totalSelected > 0) {
      nodes.push(
        <span
          key="totalSelected"
          className="ml-1 text-sm"
        >{`${totalSelected} selected`}</span>,
      );
    }
  };

  if (isAdd) {
    tryPushTotalSelectedSpan();
    nodes.push(
      <Button
        key="add"
        variant="contained"
        {...sharedBtnProps}
        endIcon={<ChevronRight />}
        sx={{
          marginLeft: 'auto',
        }}
      >
        Add
      </Button>,
    );
  } else {
    nodes.push(
      <Button
        key="remove"
        variant="contained"
        {...sharedBtnProps}
        startIcon={<ChevronLeft />}
        sx={{
          marginRight: 'auto',
        }}
      >
        Remove
      </Button>,
    );
    tryPushTotalSelectedSpan();
  }

  return <div className="flex items-center full-width pb-2">{nodes}</div>;
}

export default ListBtnRow;
