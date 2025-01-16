import Select from '@/Components/Select';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import AppLayout from '@/Layouts/AppLayout';
import { cn, ucFirst } from '@/lib/utils';
import { RefundRequest } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import html2canvas from 'html2canvas';
import { ChangeEvent } from 'react';

export default function Orders({
  refundRequests,
  campus,
}: {
  refundRequests: RefundRequest[];
  campus: string;
}) {
  function handleCampusChange(e: ChangeEvent<HTMLSelectElement>) {
    router.get(
      route('refund-requests.index', {
        'filter[campus]': e.target.value,
        campus: e.target.value,
      }),
    );
  }

  async function downloadRefundSlip() {
    const slipElement = document.getElementById('refund-slip');

    if (!slipElement) return;

    const canvas = await html2canvas(slipElement);

    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `RefundSlip.png`;
    link.click();
  }

  return (
    <AppLayout>
      <Head title="Refunded Requests" />

      <div className="mx-auto md:px-6 lg:px-8">
        <div className="mb-2 flex items-start justify-between">
          <h2 className="text-2xl font-semibold">Refunded Requests</h2>

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
              'ready-to-claim',
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

        <div className="overflow-x-auto rounded-md border border-gray-300 bg-white shadow-sm">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left font-bold">
                <th className="px-4 py-3 text-sm text-gray-700">Order ID</th>
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
              {refundRequests.map((refundRequest) => {
                const item = refundRequest.item;
                return (
                  <tr
                    key={refundRequest.id}
                    className="border-t border-gray-300"
                  >
                    <td className="max-w-[20ch] px-4 py-3 text-left">
                      <Dialog>
                        <DialogTrigger className="font-medium text-cobalt-800 hover:underline">
                          {item.order.tracking_number}
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Refund Slip</DialogTitle>
                            <DialogDescription>
                              Refund Slip Details
                            </DialogDescription>
                          </DialogHeader>

                          <RefundSlip refundRequest={refundRequest} />

                          <Button
                            id="trigger-download-slip"
                            onClick={downloadRefundSlip}
                            className="w-full"
                          >
                            Download Refund Slip
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

function RefundSlip({ refundRequest }: { refundRequest: RefundRequest }) {
  return (
    <div className="mx-auto bg-white p-2" id="refund-slip">
      <div className="mx-auto max-w-xl">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Urian Essentials
        </h1>
        <p className="mt-1 text-center font-medium">
          ({refundRequest.campus} Campus)
        </p>
      </div>

      <div className="mt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Customer Details
          </h2>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-y-2">
          <div>
            <span className="block text-sm text-gray-600">Name</span>
            <span className="font-medium text-gray-900">
              {refundRequest.user.name}
            </span>
          </div>
          <div>
            <span className="block text-sm text-gray-600">Email</span>
            <span className="font-medium text-gray-900">
              {refundRequest.user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Order #{refundRequest.item.order.tracking_number}
          </h2>
        </div>
        <div>
            <span className="block text-sm text-gray-600">Payment Method</span>
            <span className="font-medium text-gray-900">
              {refundRequest.item.order.payment_type === 'cash' ? 'Cash' : 'Salary Deduction'}
            </span>
          </div>

        <div className="max-h-[10rem] overflow-auto" id="table-refund-slip">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-700">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Variant</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Quantity</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                key={refundRequest.id}
                className="border-b text-sm text-gray-700"
              >
                <td className="px-4 py-2">{refundRequest.item.product.name}</td>
                <td className="px-4 py-2">{refundRequest.item.variant.name}</td>
                <td className="text-nowrap px-4 py-2 text-right">
                  ₱ {refundRequest.item.variant.price.toLocaleString()}
                </td>
                <td className="text-nowrap px-4 py-2 text-right">
                  {refundRequest.quantity}
                </td>
                <td className="text-nowrap px-4 py-2 text-right">
                  ₱ {refundRequest.total.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4">
        <div className="flex justify-between text-lg font-medium text-gray-800">
          <span>Total:</span>
          <span className="font-bold text-cobalt-800">
            ₱ {refundRequest.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
