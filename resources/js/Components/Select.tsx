import { forwardRef, InputHTMLAttributes, Ref } from 'react';

export default forwardRef(function Select(
  {
    className = '',
    children,
    ...props
  }: InputHTMLAttributes<HTMLSelectElement>,
  ref: Ref<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      ref={ref}
      className={
        'focus:border-cobalt-800 focus:ring-cobalt-800 rounded-md border-gray-300 shadow-sm ' +
        className
      }
    >
      {children}
    </select>
  );
});
