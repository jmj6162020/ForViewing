import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
  children: ReactNode;
  asChild?: boolean;
}

export default function SecondaryButton({
  type = 'button',
  className = '',
  disabled,
  children,
  asChild = false,
  ...props
}: SecondaryButtonProps) {
  const buttonClasses = twMerge(
    `inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-gray-200 disabled:opacity-25`,
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
    <button
      {...props}
      type={type}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
