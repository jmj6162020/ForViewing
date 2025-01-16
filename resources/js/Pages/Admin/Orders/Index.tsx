import InputLabel from '@/Components/InputLabel';
import OrderStatus from '@/Components/OrderStatus';
import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import AdminLayout from '@/Layouts/AdminLayout';
import { ucFirst } from '@/lib/utils';
import { Order } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useId, useState } from 'react';
import { toast } from 'sonner';

export default function Orders({
  title,
  orders,
}: {
  title: string;
  orders: Order[];
}) {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]); // For tracking selected orders
  const [batchStatus, setBatchStatus] = useState<string>('processing');

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const handleBatchUpdate = async () => {
    if (!batchStatus) {
      toast.error('Please select a status to update.');
      return;
    }

    if (selectedOrders.length === 0) {
      toast.error('No orders selected.');
      return;
    }

    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          axios.post(route('orders.status.update', orderId), {
            _method: 'PATCH',
            status: batchStatus,
          }),
        ),
      );
      toast.success('Batch update completed!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('An error occurred during batch update.');
    }
  };

  return (
    <AdminLayout>
      <Head title="Orders" />

      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold leading-tight text-gray-800">
          {title || 'Order List'}
        </h2>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <form className="flex flex-1 items-center">
          <TextInput
            type="search"
            name="tracking_number"
            placeholder="Search using Order ID"
            className="w-full max-w-xs text-sm"
          />

          <Link
            href={route('admin.products.index')}
            className="ms-2 text-gray-700 hover:underline hover:underline-offset-4"
          >
            Reset
          </Link>
        </form>

        <div className="flex items-end gap-2">
          <Select
            id="status"
            name="status"
            className="mt-1 block w-full text-sm"
            value={batchStatus}
            onChange={(e) => setBatchStatus(e.target.value)}
            disabled={
              title === 'Cancelled Orders' || title === 'Completed Orders'
            }
          >
            <option value="created" disabled>
              Created
            </option>
            {['processing', 'ready-for-payment', 'completed'].map(
              (status, index) => (
                <option
                  key={status}
                  value={status}
                  disabled={
                    index <
                    [
                      'processing',
                      'ready-for-payment',
                      'completed',
                      'cancelled',
                    ].indexOf(
                      title
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, -1)
                        .join('-')
                        .toLowerCase(),
                    )
                  }
                >
                  {ucFirst(status)}
                </option>
              ),
            )}
          </Select>
          <Button onClick={handleBatchUpdate} className="h-[2.3rem] py-0">
            Update Selected
          </Button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-md bg-white shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-left font-bold">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedOrders(
                      e.target.checked ? orders.map((o) => o.id) : [],
                    )
                  }
                  checked={selectedOrders.length === orders.length}
                  className="rounded-full text-sm"
                />
              </th>
              <th className="px-3 py-3 text-left text-sm text-gray-700">
                Status
              </th>

              <th className="px-3 py-3 text-left text-sm text-gray-700">
                Order ID
              </th>

              <th className="px-3 py-3 text-left text-sm text-gray-700">
                Customer Email
              </th>

              <th className="px-3 py-3 text-left text-sm text-gray-700">
                Date Ordered
              </th>

              <th className="px-3 py-3 text-left text-sm text-gray-700">
                Payment Method
              </th>

              <th className="px-3 py-3 text-right text-sm text-gray-700">
                # of Items
              </th>

              <th className="px-3 py-3 text-right text-sm text-gray-700">
                Total Amount
              </th>

              <th className="px-3 py-3 text-right text-sm text-gray-700"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              return (
                <tr key={order.id} className="border-t border-gray-300">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded-full text-sm"
                    />
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700">
                    <OrderStatus status={order.status} />
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-700">
                    <OrderDetailDialog order={order} />
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-700">
                    {order.user.email}
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-700">
                    {new Date(order.created_at).toLocaleString()}
                  </td>

                  <td className="px-3 py-3 text-sm text-gray-700">
                    {order.payment_type === 'cash'
                      ? 'Cash'
                      : 'Salary Deduction'}
                  </td>

                  <td className="px-3 py-3 text-right text-sm text-gray-700">
                    {order.items.length}
                  </td>

                  <td className="px-3 py-3 text-right text-sm text-gray-700">
                    {order.total_amount === 0
                      ? 'Refunded'
                      : `₱ ${order.total_amount}`}
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr className="border-t border-gray-300">
                <td
                  colSpan={7}
                  className="px-3 py-4 text-center text-sm font-medium text-gray-700"
                >
                  No orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export function OrderDetailDialog({ order }: { order: Order }) {
  const formId = useId();

  const { data, setData, patch } = useForm({
    status: order.status,
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    patch(route('orders.status.update', order.id), {
      onSuccess: () => toast('Product status updated'),
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="font-medium text-cobalt-800 hover:underline">
        {order.tracking_number}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription className="sr-only">
            View order details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Customer Details
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Name:</span>{' '}
                  {order.user.name}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Email:</span>{' '}
                  {order.user.email}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Order Summary
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Order Date:</span>{' '}
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Payment Method:</span>{' '}
                  {order.payment_type === 'cash' ? 'Cash' : 'Salary Deduction'}
                </p>
              </div>
              <div className="mt-2 max-h-48 space-y-2 overflow-y-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead>
                    <tr className="border-b text-gray-700">
                      <th className="sr-only px-3 py-2">Product Image</th>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Variant</th>
                      <th className="px-3 py-2 text-right">Quantity</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">
                          <img
                            src={item.product.images[0].public_url}
                            alt={item.product.name}
                            className="size-12 object-contain p-2"
                          />
                        </td>
                        <td className="px-3 py-2">{item.product.name}</td>
                        <td className="text-nowrap px-3 py-2">
                          {item.variant.name}
                        </td>
                        <td className="text-nowrap px-3 py-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="text-nowrap px-3 py-2 text-right">
                          ₱ {item.variant.price.toLocaleString()}
                        </td>
                        <td className="text-nowrap px-3 py-2 text-right">
                          ₱{' '}
                          {(
                            item.variant.price * item.quantity
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold">
                      <td className="py-2 pr-4">Total</td>
                      <td colSpan={4} className="py-2 pr-4"></td>
                      <td className="text-nowrap py-2 pr-4 text-right">
                        {order.total_amount === 0
                          ? 'Refunded'
                          : `₱ ${order.total_amount}`}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <form onSubmit={submit} id={formId}>
              <InputLabel htmlFor="status">Order Status</InputLabel>

              <div className="mt-2">
                <Select
                  id="status"
                  name="status"
                  defaultValue={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  className="mt-1 block w-full"
                  disabled={
                    order.status === 'cancelled' || order.status === 'completed'
                  }
                >
                  <option value="created" disabled>
                    Created
                  </option>
                  {['processing', 'ready-for-payment', 'completed'].map(
                    (status, index) => (
                      <option
                        key={status}
                        value={status}
                        disabled={
                          index <
                          [
                            'processing',
                            'ready-for-payment',
                            'completed',
                          ].indexOf(order.status)
                        }
                      >
                        {ucFirst(status)}
                      </option>
                    ),
                  )}
                </Select>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-between">
            {order.payment_type === 'salary_deduction' && (
              <a
                target="_blank"
                href={route('salary_deductions.show', order.id)}
                className="text-sm font-medium text-cobalt-800 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
                rel="noreferrer"
              >
                View Salary Deduction Form
              </a>
            )}

            <div className="flex items-center justify-end space-x-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                form={formId}
                type="submit"
                disabled={
                  order.status === 'cancelled' || order.status === 'completed'
                }
              >
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
