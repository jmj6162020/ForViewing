import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
  children: ReactNode;
  asChild?: boolean;
}

export default function PrimaryButton({
  className = '',
  disabled,
  children,
  asChild = false,
  ...props
}: PrimaryButtonProps) {
  const buttonClasses = twMerge(
    `inline-flex items-center justify-center rounded-md border border-transparent bg-cobalt-800 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-cobalt-800/90 focus:bg-cobalt-800/90 focus:outline-none focus:ring-2 focus:ring-cobalt-800 focus:ring-offset-2 active:bg-cobalt-900`,
    disabled && 'opacity-25',
    className,
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: twMerge(
        buttonClasses,
        (children as React.ReactElement).props.className,
      ),
      disabled,
      ...props,
    });
  }

  return (
    <button {...props} className={buttonClasses} disabled={disabled}>
      {children}
    </button>
  );
}
