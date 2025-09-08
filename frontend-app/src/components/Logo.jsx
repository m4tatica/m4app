import React from 'react';
import { Calculator, Target } from 'lucide-react';

const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="bg-primary rounded-lg p-2 shadow-lg">
          <Calculator className={`${sizes[size]} text-primary-foreground`} />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
          <Target className="h-3 w-3 text-white" />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary ${textSizes[size]}`}>
            PrecificaPro
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Sistema de Precificação
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;

