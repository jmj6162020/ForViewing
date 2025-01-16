import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import AdminLayout from '@/Layouts/AdminLayout';
import { ucFirst } from '@/lib/utils';
import { RefundRequest } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RefundRequests({
  requests,
  query,
  status,
}: {
  requests: RefundRequest[];
  query: string;
  status: string;
}) {
  return (
    <AdminLayout>
      <Head title="Refund Requests" />

      <h2 className="text-2xl font-semibold leading-tight text-gray-800">
        Refund Requests
      </h2>

      <div className="mt-4 flex items-end justify-between">
        <form className="flex flex-1 items-center">
          <TextInput
            key={query}
            name="query"
            placeholder="Search using Order ID"
            defaultValue={query}
            className="w-full max-w-xs text-sm"
          />

          <Link
            href={route('admin.refund-requests.index')}
            className="ms-2 text-sm text-gray-700 hover:underline hover:underline-offset-4"
          >
            Reset
          </Link>
        </form>

        <Select
          key={status}
          onChange={(e) => {
            router.get('', {
              status: e.target.value,
            });
          }}
          className="text-sm"
          defaultValue={status}
        >
          <option value="processing">Processing</option>
          <option value="refunded">Refunded</option>
        </Select>
      </div>

      <div className="mt-4 rounded-md bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left font-bold">
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Customer Email
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Product Name
              </th>
              <th className="px-4 py-3 text-right text-sm text-gray-700">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-sm text-gray-700">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => {
              return (
                <tr key={request.id} className="border-t border-gray-300">
                  <td className="px-4 py-3 text-left text-sm">
                    <RefundDialog refundRequest={request} />
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {request.user.name}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {request.user.email}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {new Date(request.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {request.item.product.name} - {request.item.variant.name}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">
                    {request.quantity}
                  </td>
                  <td className="text-nowrap px-4 py-3 text-right text-sm text-gray-700">
                    ₱ {request.total}
                  </td>
                </tr>
              );
            })}

            {requests.length === 0 && (
              <tr className="border-t border-gray-300">
                <td
                  colSpan={7}
                  className="px-4 py-4 text-center text-sm font-medium text-gray-700"
                >
                  No requests available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function RefundDialog({ refundRequest }: { refundRequest: RefundRequest }) {
  const item = refundRequest.item;
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger className="font-medium text-cobalt-800 hover:underline">
        {refundRequest.item.order.tracking_number}
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Refund Request</DialogTitle>
          <DialogDescription className="sr-only">
            Refund Request Status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">Order ID</span>:{' '}
            {refundRequest.item.order.tracking_number} Campus
          </p>

          <p className="text-sm text-gray-900">
            <span className="font-semibold">Customer Email</span>:{' '}
            {refundRequest.user.email}
          </p>

          <p className="text-sm text-gray-900">
            <span className="font-semibold">Customer Name</span>:{' '}
            {refundRequest.user.name}
          </p>
        </div>

        <div className="mt-2">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left font-bold">
                <th className="px-4 py-3 text-sm text-gray-700">Item</th>
                <th className="px-4 py-3 text-sm text-gray-700">Category</th>
                <th className="px-4 py-3 text-sm text-gray-700">Date</th>
                <th className="px-4 py-3 text-sm text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm text-gray-700">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-gray-300">
                <td className="max-w-[20ch] px-4 py-3 text-left text-sm text-gray-700">
                  {item.product.name}
                </td>
                <td className="px-4 py-3 text-left text-sm text-gray-700">
                  {item.product.category.name}
                </td>
                <td className="px-4 py-3 text-left text-sm text-gray-700">
                  {new Date(refundRequest.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-left text-sm text-gray-700">
                  {ucFirst(refundRequest.status)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">
                  {refundRequest.quantity}
                </td>
                <td className="text-nowrap px-4 py-3 text-right text-sm text-gray-700">
                  ₱ {refundRequest.total}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-2">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Reason</span>:{' '}
              {refundRequest.reason}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              Images:{' '}
              {refundRequest.images.length === 0 && (
                <span className="text-sm font-normal text-gray-900">
                  No images provided
                </span>
              )}
            </p>
            {refundRequest.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image?.public_url}
                  alt={`Product ${index}`}
                  className="h-24 w-24 rounded-full border border-gray-300 object-scale-down shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          <Button
            onClick={() => {
              router.patch(
                route('admin.refund-requests.update', refundRequest.id),
                {
                  status: 'refunded',
                },
                {
                  onSuccess: () => {
                    toast('Refund request approved');
                    setOpen(false);
                  },
                },
              );
            }}
            className="ms-2"
            disabled={refundRequest.status == 'refunded'}
          >
            Approve Refund Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
