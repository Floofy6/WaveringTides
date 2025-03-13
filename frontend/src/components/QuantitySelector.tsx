import React from 'react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  name?: string;
}

/**
 * QuantitySelector component - Reusable input for selecting quantities
 * Used in multiple places like inventory, shop, etc.
 */
const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  label = 'Quantity:',
  name = 'quantity'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    onChange(Math.min(max, Math.max(min, newValue)));
  };

  const increment = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleBlur = () => {
    // Ensure the value stays within bounds on blur
    if (value < min) onChange(min);
    if (value > max) onChange(max);
  };

  return (
    <div className="quantity-selector">
      {label && <label htmlFor={name}>{label}</label>}
      
      <div className="quantity-controls">
        <button 
          type="button"
          className="quantity-btn decrease"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease quantity"
        >
          -
        </button>
        
        <input
          type="number"
          id={name}
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="quantity-input"
        />
        
        <button 
          type="button"
          className="quantity-btn increase"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      
      {max !== Infinity && (
        <div className="quantity-presets">
          <button onClick={() => onChange(1)}>Min</button>
          <button onClick={() => onChange(Math.floor(max / 2))}>Half</button>
          <button onClick={() => onChange(max)}>Max</button>
        </div>
      )}
    </div>
  );
};

export default QuantitySelector; 