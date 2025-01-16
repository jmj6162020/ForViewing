import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './Sidebar';

export default function AdminLayout({ children }: PropsWithChildren) {
  const user = usePage().props.auth.user;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-transparent">
          <div className="flex h-12 items-center justify-end">
            <div className="ms-6 flex">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center space-x-2 text-sm font-medium text-gray-700">
                  {user.name}
                  <ChevronDown className="size-4 shrink-0" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={route('logout')}
                      as="button"
                      method="post"
                      className="w-full"
                    >
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {children}
      </div>

      <Toaster duration={1000} />
    </div>
  );
}
