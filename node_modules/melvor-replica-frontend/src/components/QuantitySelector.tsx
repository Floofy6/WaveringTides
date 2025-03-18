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
 * Optimized for narrow sidebar with minimal width
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
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={name} className="text-xs text-gray-600">
          {label}
        </label>
      )}
      
      <div className="flex items-center">
        <button 
          type="button"
          className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="w-10 h-6 px-1 text-xs text-center border-y border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        
        <button 
          type="button"
          className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      
      {max !== Infinity && (
        <div className="flex space-x-1 text-xxs">
          <button 
            onClick={() => onChange(1)}
            className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Min
          </button>
          <button 
            onClick={() => onChange(Math.floor(max / 2))}
            className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Half
          </button>
          <button 
            onClick={() => onChange(max)}
            className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Max
          </button>
        </div>
      )}
    </div>
  );
};

export default QuantitySelector; 