import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
  active = false,
  className = '',
  children,
  ...props
}: InertiaLinkProps & { active: boolean }) {
  return (
    <Link
      {...props}
      className={
        'inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 focus:outline-none ' +
        (active
          ? 'text-white underline underline-offset-8'
          : 'text-white transition duration-150 ease-in-out hover:underline hover:underline-offset-8') +
        className
      }
    >
      {children}
    </Link>
  );
}
