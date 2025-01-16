import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
  Box,
  ChevronDown,
  ChevronRight,
  Home,
  PhoneCall,
  ShoppingCart,
  Star,
  Undo,
  UsersRound,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import logo from '../../images/logo.png';

export function Sidebar() {
  const {
    auth: { user },
    refundRequests,
  } = usePage().props;

  const hasRecentRefundRequest = refundRequests.some((request) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const requestTime = new Date(request.created_at);
    return requestTime > oneHourAgo && request.status === 'processing';
  });

  return (
    <div className="flex min-h-screen w-72 shrink-0 flex-col overflow-y-auto bg-cobalt-800 pb-6 text-white">
      <div className="flex flex-col items-center justify-center p-6">
        <img src={logo} alt="Logo" className="h-10" />
        <h2 className="mt-2 text-lg font-semibold text-white">
          {user.campus === 'Super Admin'
            ? 'Super Admin'
            : `${user.campus} Campus`}
        </h2>
      </div>

      <div className="flex flex-col space-y-2 px-6">
        <SidebarLink
          href={route('dashboard')}
          active={route().current('dashboard')}
        >
          <Home size={16} />
          <span>Dashboard</span>
        </SidebarLink>

        <SidebarLink
          href={route('admin.products.index')}
          active={route().current('admin.products.*')}
        >
          <Box size={16} />
          <span>Products</span>
        </SidebarLink>

        <OrdersLink />

        <SidebarLink
          href={route('admin.customers.index')}
          active={route().current('admin.customers.*')}
        >
          <UsersRound size={16} />
          <span>Customers</span>
        </SidebarLink>

        <SidebarLink
          href={route('admin.refund-requests.index')}
          active={route().current('admin.refund-requests.*')}
        >
          <Undo size={16} />
          <span>Refund Request</span>
          {hasRecentRefundRequest && (
            <span className="me-2 rounded-full bg-white p-1"></span>
          )}
        </SidebarLink>

        <SidebarLink
          href={route('admin.reviews.index')}
          active={route().current('admin.reviews.*')}
        >
          <Star size={16} />
          <span>User Reviews</span>
        </SidebarLink>

        <SidebarLink
          href={route('admin.contacts.index')}
          active={route().current('admin.contacts.*')}
        >
          <PhoneCall size={16} />
          <span>Feedback / Inquiries</span>
        </SidebarLink>

        {user.role === 'super-admin' && (
          <SidebarLink
            href={route('admin.users.index')}
            active={route().current('admin.users.*')}
          >
            <UsersRound size={16} />
            <span>User Management</span>
          </SidebarLink>
        )}
      </div>
    </div>
  );
}

function OrdersLink() {
  const [isOpen, setIsOpen] = useState(route().current('admin.orders.*'));

  function toggleAccordion() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <button
        className={`flex w-full items-center justify-between rounded-md px-4 py-2 text-left text-sm font-medium hover:bg-gray-100 hover:text-cobalt-800 ${
          isOpen ? 'bg-gray-100 text-cobalt-800' : ''
        }`}
        onClick={toggleAccordion}
      >
        <div className="flex items-center gap-2">
          <ShoppingCart size={16} />
          <span>Orders</span>
        </div>

        <ChevronDown
          size={16}
          className={`duration-160 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="mt-2 space-y-2 pl-4">
          <SidebarLink
            href={route('admin.orders.created')}
            active={route().current('admin.orders.created')}
          >
            <ChevronRight size={16} />
            <span>Created Orders</span>
          </SidebarLink>

          <SidebarLink
            href={route('admin.orders.processing')}
            active={route().current('admin.orders.processing')}
          >
            <ChevronRight size={16} />
            <span>Processing Orders</span>
          </SidebarLink>

          <SidebarLink
            href={route('admin.orders.ready-to-claim')}
            active={route().current('admin.orders.ready-to-claim')}
          >
            <ChevronRight size={16} />
            <span className="text-nowrap">Ready for Payment Orders</span>
          </SidebarLink>

          <SidebarLink
            href={route('admin.orders.completed')}
            active={route().current('admin.orders.completed')}
          >
            <ChevronRight size={16} />
            <span>Completed Orders</span>
          </SidebarLink>

          <SidebarLink
            href={route('admin.orders.cancelled')}
            active={route().current('admin.orders.cancelled')}
          >
            <ChevronRight size={16} />
            <span>Cancelled Orders</span>
          </SidebarLink>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-start space-x-2 rounded-md px-4 py-2 text-sm font-medium transition duration-150 ease-in-out',
        active
          ? 'bg-white text-cobalt-800'
          : 'hover:bg-gray-50 hover:text-cobalt-800',
      )}
    >
      {children}
    </Link>
  );
}
