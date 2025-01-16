import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, Ref, useState } from 'react';

export default forwardRef(function TextInput(
  { className = '', ...props }: InputHTMLAttributes<HTMLInputElement>,
  ref: Ref<HTMLInputElement>,
) {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisiblity() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={
          'focus:border-cobalt-800 focus:ring-cobalt-800 rounded-md border-gray-300 pe-10 shadow-sm ' +
          className
        }
        ref={ref}
      />
      <button
        type="button"
        onClick={togglePasswordVisiblity}
        className="focus:text-cobalt-800 absolute inset-y-0 end-0 z-20 flex items-center rounded-e-md px-3 text-gray-400"
      >
        {showPassword ? (
          <Eye className="size-4 shrink-0" />
        ) : (
          <EyeOff className="size-4 shrink-0" />
        )}
      </button>
    </div>
  );
});
