import React from 'react';
import CurrencyInputField from 'react-currency-input-field';

const CurrencyInput = ({ 
  value, 
  onValueChange, 
  placeholder = "R$ 0,00", 
  className = "",
  disabled = false,
  ...props 
}) => {
  return (
    <CurrencyInputField
      prefix="R$ "
      groupSeparator="."
      decimalSeparator=","
      decimalsLimit={2}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};

export default CurrencyInput;

