import { OrderDetailDialog } from '@/Pages/Admin/Orders/Index';
import { Order } from '@/types';
import { Button } from './ui/button';

export default function RecentOrdersTable({
  recentOrders,
}: {
  recentOrders: Order[];
}) {
  return (
    <div className="w-full rounded-md border bg-white p-4 shadow">
      <div className="flex items-start justify-between">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Recent Orders
        </h3>

        <Button size="sm" asChild>
          <a href={`${route('reports.recent-orders')}?format=csv`} target="_blank" rel="noreferrer">
            Export to CSV
          </a>
        </Button>
        <Button size="sm" asChild>
          <a href={`${route('reports.recent-orders')}?format=pdf`} target="_blank" rel="noreferrer">
            Export to PDF
          </a>
        </Button>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Order ID
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Date
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
              Total
            </th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.tracking_number} className="border-b">
              <td className="px-4 py-2 text-sm text-gray-700">
                <OrderDetailDialog order={order} />
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {new Date(order.created_at).toLocaleString()}
              </td>
              <td className="text-nowrap px-4 py-2 text-right text-sm text-gray-700">
                ₱ {order.total_amount.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center text-sm">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}

          {recentOrders.length === 0 && (
            <tr className="border-b">
              <td
                colSpan={4}
                className="text-nowrap px-4 py-2 text-center text-sm text-gray-700"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
