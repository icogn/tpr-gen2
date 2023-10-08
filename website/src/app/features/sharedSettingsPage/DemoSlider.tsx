'use client';

import { useState } from 'react';

type DemoSliderProps = {
  label: string;
  min: number;
  max: number;
  defaultValue?: number;
};

function DemoSlider({ label, min, max, defaultValue = undefined }: DemoSliderProps) {
  const defaultVal = String(defaultValue == null ? min : defaultValue);
  const [value, setValue] = useState(defaultVal);

  return (
    <div className="py-1">
      <div className="leading-tight">{label}</div>
      <div className="flex align-center">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
        />
        <div className="ml-1">{value}</div>
      </div>
    </div>
  );
}

export default DemoSlider;
