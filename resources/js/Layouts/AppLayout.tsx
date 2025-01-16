import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import logo from '../../images/logo.png';

export default function AppLayout({ children }: PropsWithChildren) {
  const {
    auth: { user },
    flash,
    cartItemCount,
  } = usePage().props;

  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  useEffect(() => {
    if (flash.message) {
      toast(flash.message);
    }
  }, [flash.message]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="border-b border-gray-100 bg-cobalt-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <Link href="/">
                  <img src={logo} alt="Logo" className="block h-9 w-auto" />
                </Link>
              </div>

              <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <NavLink href={route('home')} active={route().current('home')}>
                  Home
                </NavLink>

                <NavLink href={route('categories.index')} active={false}>
                  Shop
                </NavLink>

                <NavLink
                  href={route('about')}
                  active={route().current('about')}
                >
                  About
                </NavLink>

                <NavLink
                  href={route('contact-us')}
                  active={route().current('contact-us')}
                >
                  Contact
                </NavLink>
              </div>
            </div>

            <div className="hidden sm:ms-6 sm:flex sm:items-center">
              <Link
                href={route('cart.index', { campus: 'Main' })}
                className="relative ms-3"
              >
                <ShoppingCart
                  className="size-5 shrink-0 text-white"
                  strokeWidth="2.25"
                />
                <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-cobalt-800">
                  {cartItemCount}
                </div>
              </Link>

              <div className="relative ms-3">
                {user ? (
                  <Dropdown>
                    <Dropdown.Trigger>
                      <span className="inline-flex rounded-md">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:underline hover:underline-offset-8 focus:outline-none"
                        >
                          {user.name}

                          <svg
                            className="-me-0.5 ms-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                      <Dropdown.Link href={route('orders.index')}>
                        My Orders
                      </Dropdown.Link>

                      <Dropdown.Link
                        href={route('logout')}
                        method="post"
                        as="button"
                      >
                        Log Out
                      </Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                ) : (
                  <>
                    <Link
                      href={route('register')}
                      className="ms-3 text-sm font-medium text-white transition duration-150 ease-in-out hover:underline hover:underline-offset-8"
                    >
                      Register
                    </Link>
                    <span className="ms-3 font-medium text-white">|</span>
                    <Link
                      href={route('login')}
                      className="ms-3 text-sm font-medium text-white transition duration-150 ease-in-out hover:underline hover:underline-offset-8"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() =>
                  setShowingNavigationDropdown(
                    (previousState) => !previousState,
                  )
                }
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={
                      !showingNavigationDropdown ? 'inline-flex' : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={
                      showingNavigationDropdown ? 'inline-flex' : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={
            (showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'
          }
        >
          <div className="space-y-1 pb-3 pt-2">
            <ResponsiveNavLink
              href={route('dashboard')}
              active={route().current('dashboard')}
            >
              Dashboard
            </ResponsiveNavLink>
          </div>

          {user && (
            <div className="border-t border-gray-200 pb-1 pt-4">
              <div className="px-4">
                <div className="text-base font-medium text-gray-800">
                  {user.name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user.email}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <ResponsiveNavLink href={route('profile.edit')}>
                  Profile
                </ResponsiveNavLink>

                <ResponsiveNavLink
                  method="post"
                  href={route('logout')}
                  as="button"
                >
                  Log Out
                </ResponsiveNavLink>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="p-8 py-5">{children}</div>

      <Toaster />
    </div>
  );
}
