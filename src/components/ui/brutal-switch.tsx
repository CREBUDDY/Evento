import React from 'react';

interface BrutalSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function BrutalSwitch({ checked, onCheckedChange, className = "" }: BrutalSwitchProps) {
  return (
    <label className={`switch ${className}`}>
      <input 
        className="toggle" 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onCheckedChange(e.target.checked)} 
      />
      <span className="slider"></span>
      <span className="card-side"></span>
    </label>
  );
}
