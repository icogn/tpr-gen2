'use client';

import Button from '@mui/material/Button';
import Select from './Select';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

type ListPickerLeftProps = {
  items?: string[];
  onAddClick(): void;
};

function ListPickerLeft({ items = undefined, onAddClick }: ListPickerLeftProps) {
  console.log(onAddClick);
  // prop - list of items
  // prop - how to ID each row
  // state of which are selected
  // state of filter text

  // prop - how to filter each row (based on select and text filters)
  // prop - `select` el filter options
  // prop - onAddClick (param is list of selected IDs)
  return (
    <div style={{ maxWidth: '320px' }}>
      <div className="flex items-center">
        <span>X selected</span>
        <Button
          variant="contained"
          disableElevation
          sx={{ marginLeft: 'auto' }}
        >
          Add
        </Button>
      </div>
      <div>
        <Select options={['All', 'Golden Wolves', 'Sky Characters']} />
      </div>
      <div className="flex items-center">
        <Checkbox />
        <input
          type="text"
          placeholder="Search"
          className="flex-1"
          style={{ padding: '4px 8px' }}
        />
      </div>
      {items && (
        <List
          dense
          disablePadding
          sx={{ backgroundColor: '#282828' }}
        >
          {items.map((item: string) => {
            return (
              <ListItem key={item}>
                <ListItemIcon sx={{ minWidth: '0' }}>
                  <Checkbox
                    size="small"
                    edge="start"
                    // checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    // inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText>{item}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}

export default ListPickerLeft;
