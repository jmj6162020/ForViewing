import OrderStatus from '@/Components/OrderStatus';
import Select from '@/Components/Select';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import { Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChangeEvent } from 'react';

export default function Orders({
  orders,
  campus,
}: {
  orders: Order[];
  campus: string;
}) {
  function handleCampusChange(e: ChangeEvent<HTMLSelectElement>) {
    router.get(
      route('orders.index', {
        'filter[campus]': e.target.value,
        campus: e.target.value,
      }),
    );
  }

  return (
    <AppLayout>
      <Head title="My Orders" />

      <div className="mx-auto md:px-6 lg:px-8">
        <div className="mb-2 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">My Orders</h2>

          <Select
            onChange={handleCampusChange}
            className="text-sm"
            defaultValue={campus}
          >
            <option value="">All Campuses</option>
            <option value="Main">Main Campus</option>
            <option value="Morelos">Morelos Campus</option>
          </Select>
        </div>

        <div className="mb-4">
          <div className="flex space-x-2 border-b border-gray-200 pb-1">
            {[
              'all',
              'processing',
              'ready-for-payment',
              'completed',
              'cancelled',
            ].map((status) => (
              <Link
                key={status}
                href={
                  status === 'all'
                    ? '/orders'
                    : `/orders?filter[status]=${status}`
                }
                className={cn(
                  'px-4 py-2 text-sm font-semibold transition duration-150 ease-in-out',
                  route().queryParams.filter?.status === status ||
                    (status === 'all' && !route().queryParams.filter?.status)
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900',
                )}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace('-', ' ')}
              </Link>
            ))}

            <Link
              href="/refund-requests"
              className={cn(
                'px-4 py-2 text-sm font-semibold transition duration-150 ease-in-out',
                route().current('refund-requests.index')
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900',
              )}
            >
              Refunded
            </Link>
          </div>
        </div>

        <OrdersTable orders={orders} />
      </div>
    </AppLayout>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  return orders.length === 0 ? (
    <div className="rounded-md bg-white p-4 text-center shadow">
      <p className="text-sm font-medium text-gray-700">No orders available.</p>
    </div>
  ) : (
    <div className="overflow-x-auto rounded-md border border-gray-300 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b text-gray-700">
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Campus</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-right">Items</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">
                {order.tracking_number}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                {order.campus}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                {new Date(order.created_at).toLocaleString()}
              </td>

              <td className="px-4 py-3 text-right text-sm text-gray-700">
                {order.items.length} item
                {order.items.length > 1 ? 's' : ''}
              </td>

              <td className="px-4 py-3 text-right text-sm text-gray-700">
                ₱ {order.total_amount.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-center text-sm">
                <OrderStatus status={order.status} />
              </td>
              <td className="px-4 py-3 text-center">
                <a
                  href={route('orders.show', order.id)}
                  className="text-sm font-medium text-cobalt-800 hover:underline"
                >
                  View Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
