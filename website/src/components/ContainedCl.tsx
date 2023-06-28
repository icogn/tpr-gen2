'use client';

import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import {useState, useId} from 'react';
import type {ChannelInfo} from '@/stateful/branches';

type ContainedClProps = {
  channels: ChannelInfo[];
};

function ContainedCl({channels}: ContainedClProps) {
  const btnId = useId();
  const menuId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleBtnClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleBtnClick}
        id={btnId}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Generate Seed
      </Button>
      <Menu
        open={open}
        anchorEl={anchorEl}
        id={menuId}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {channels.length > 0 ? (
          channels.map((channelInfo: ChannelInfo) => {
            const {channel, name, latestVersion} = channelInfo;
            return (
              <MenuItem
                key={channel}
                onClick={() => {
                  window.top?.postMessage({type: 'changeToChannel', channelInfo}, '*');
                  handleClose();
                }}
              >
                {name}
                {latestVersion ? <sup>{latestVersion}</sup> : null}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem>No channels</MenuItem>
        )}
      </Menu>
    </div>
  );
}

export default ContainedCl;
