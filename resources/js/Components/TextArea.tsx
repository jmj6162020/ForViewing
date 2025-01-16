import { forwardRef, Ref, TextareaHTMLAttributes } from 'react';

export default forwardRef(function TextInput(
  {
    className = '',
    children,
    ...props
  }: TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref: Ref<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={
        'rounded-md border-gray-300 shadow-sm focus:border-cobalt-800 focus:ring-cobalt-800 ' +
        className
      }
      ref={ref}
    >
      {children}
    </textarea>
  );
});
