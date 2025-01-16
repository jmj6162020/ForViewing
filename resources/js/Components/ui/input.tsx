import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'rounded-md border-gray-300 shadow-sm file:border-0 file:border-gray-300 file:bg-transparent file:font-medium file:text-gray-900 focus:border-cobalt-800 focus:ring-cobalt-800 file:focus:outline-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
