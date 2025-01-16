import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import OrderStatus from '@/Components/OrderStatus';
import TextArea from '@/Components/TextArea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
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
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import { Order, OrderItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import html2canvas from 'html2canvas';
import { Plus, Star } from 'lucide-react';
import { ChangeEvent, FormEvent, useId, useState } from 'react';
import { toast } from 'sonner';

export default function OrderDetails({ order }: { order: Order }) {
  const [cancellingOrder, setCancellingOrder] = useState(false);

  function cancelOrder() {
    router.patch(
      route('orders.status.update', order.id),
      {
        status: 'cancelled',
      },
      { onSuccess: () => setCancellingOrder(false) },
    );
  }

  async function downloadOrderSlip() {
    const slipElement = document.getElementById('order-slip');
    const orderSlipTable = document.getElementById('table-order-slip');

    if (!slipElement || !orderSlipTable) return;

    orderSlipTable.style.maxHeight = '';
    orderSlipTable.style.overflow = 'visible';
    orderSlipTable.style.marginBottom = '64px';

    const canvas = await html2canvas(slipElement);

    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `OrderSlip_${order.tracking_number}.png`;
    link.click();

    orderSlipTable.style.maxHeight = '128px';
    orderSlipTable.style.overflow = 'auto';
    orderSlipTable.style.marginBottom = '0px';
  }

  return (
    <AppLayout>
      <Head title={`Order Details - ${order.tracking_number}`} />

      <div className="mx-auto md:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-x-4">
          <Button variant="outline" asChild>
            <Link href={route('orders.index')}>Back</Link>
          </Button>

          <h2 className="text-2xl font-semibold">Order Details</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-md bg-white p-4 shadow lg:col-span-2">
            <div className="flex items-start justify-between">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Order Information
              </h3>

              <div className="flex">
                {order.status === 'created' && (
                  <AlertDialog
                    open={cancellingOrder}
                    onOpenChange={setCancellingOrder}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Cancel Order
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button onClick={cancelOrder} variant="destructive">
                          Continue
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="ms-2"
                      disabled={order.status === 'cancelled'}
                    >
                      View Receipt
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-h-screen max-w-3xl">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Order Slip</DialogTitle>
                      <DialogDescription>View Receipt</DialogDescription>
                    </DialogHeader>

                    <OrderSlip order={order} />

                    <Button
                      id="trigger-download-slip"
                      onClick={downloadOrderSlip}
                      className="w-full"
                    >
                      Download Order Slip
                    </Button>
                  </DialogContent>
                </Dialog>

                {order.payment_type === 'salary_deduction' && (
                  <Button size="sm" className="ms-2" variant="outline" asChild>
                    <a href={route('salary_deductions.show', order.id)} target="_blank">
                      View Salary Deduction Form
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2">
              <span className="text-gray-700">Order ID:</span>
              <span className="font-medium text-gray-900">
                {order.tracking_number}
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2">
              <span className="text-gray-700">Payment Method:</span>
              <span className="font-medium text-gray-900">
                {order.payment_type === 'cash' ? 'Cash' : 'Salary Deduction'}
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2">
              <span className="text-gray-700">Campus:</span>
              <span className="font-medium text-gray-900">
                {order.campus} Campus
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-700">Order Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-700">Status:</span>
              <OrderStatus status={order.status} />
            </div>
          </div>

          <div className="self-start rounded-md bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Order Summary
            </h3>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium text-gray-900">
                ₱ {order.total_amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-300 pt-2">
              <span className="font-semibold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-cobalt-800">
                ₱ {order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="rounded-md bg-white p-4 shadow lg:col-span-2">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              {order.status === 'completed'
                ? 'Completed Ordered Items'
                : 'Order Items'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-700">
                    <th className="sr-only px-4 py-2">Product Image</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Variant</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    {order.status === 'completed' && (
                      <th className="px-4 py-2 text-right">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b text-sm text-gray-700"
                    >
                      <td className="px-4 py-2">
                        <img
                          src={item.product.images[0].public_url}
                          alt={item.product.name}
                          className="size-12 rounded-md object-contain"
                        />
                      </td>

                      <td className="max-w-[20ch] px-4 py-2">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-2">{item.variant.name}</td>

                      <td className="px-4 py-2 text-right">
                        ₱{item.variant.price.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-right">
                        {item.quantity === 0
                          ? 'Refunded'
                          : item.quantity.toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-right">
                        ₱{' '}
                        {(item.variant.price * item.quantity).toLocaleString()}
                      </td>

                      {order.status === 'completed' && (
                        <td className="text-nowrap text-right align-middle">
                          <div className="flex flex-col items-end gap-1">
                            <ItemReviewDialog item={item} />

                            <RefundDialog item={item} />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function OrderSlip({ order }: { order: Order }) {
  return (
    <div className="mx-auto bg-white p-2" id="order-slip">
      <div className="mx-auto max-w-xl">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Urian Essentials
        </h1>
        <p className="mt-1 text-center font-medium">({order.campus} Campus)</p>

        <p className="mt-1 rounded-md px-4 text-center text-sm font-medium leading-6 text-blue-800">
          Please present this slip to the bookstore to claim your order. Make
          sure to pay within 3 days once your order is ready to claim.
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
            <span className="font-medium text-gray-900">{order.user.name}</span>
          </div>
          <div>
            <span className="block text-sm text-gray-600">Email</span>
            <span className="font-medium text-gray-900">
              {order.user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Order #{order.tracking_number}
        </h2>
        <div>
          <span className="block text-sm text-gray-600">Payment Method:</span>
          <span className="font-medium text-gray-900">
            {order.payment_type === 'cash' ? 'Cash' : 'Salary Deduction'}
          </span>
        </div>

        <div className="max-h-[10rem] overflow-auto" id="table-order-slip">
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
              {order.items.map((item) => (
                <tr key={item.id} className="border-b text-sm text-gray-700">
                  <td className="px-4 py-2">{item.product.name}</td>
                  <td className="px-4 py-2">{item.variant.name}</td>
                  <td className="text-nowrap px-4 py-2 text-right">
                    ₱ {item.variant.price.toLocaleString()}
                  </td>
                  <td className="text-nowrap px-4 py-2 text-right">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="text-nowrap px-4 py-2 text-right">
                    ₱ {(item.variant.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4">
        <div className="flex justify-between text-lg font-medium text-gray-800">
          <span>Total:</span>
          <span className="font-bold text-cobalt-800">
            ₱ {order.total_amount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function ItemReviewDialog({ item }: { item: OrderItem }) {
  const { data, setData, post } = useForm({
    rating: item.review?.rating ?? 0,
    comment: item.review?.comment ?? '',
  });

  const [open, setOpen] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    post(route('order-items.reviews.store', item.id), {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          'text-sm font-medium text-cobalt-800 transition duration-150 ease-in-out hover:underline focus:outline-none',
          item.quantity === 0 && 'opacity-50',
        )}
      >
        Leave Review
      </DialogTrigger>

      <DialogContent
        id="product-review-modal"
        className="rounded-md bg-white p-6 shadow-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Leave a Review
          </DialogTitle>
          <DialogDescription className="sr-only">
            Provide your feedback for the product
          </DialogDescription>
        </DialogHeader>

        <h2 className="font-medium text-gray-800">{item.product.name}</h2>
        <div className="flex items-start gap-x-3">
          <img
            src={item.product.images[0].public_url}
            alt={item.product.name}
            className="size-24 object-contain"
          />

          <p className="line-clamp-5 text-sm text-gray-700">
            {item.product.details || 'No product details.'}
          </p>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <InputLabel
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating
            </InputLabel>

            <div className="mt-2 flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition duration-200 ease-in-out ${
                    data.rating >= star ? 'bg-yellow-400' : 'bg-gray-200'
                  }`}
                  onClick={() => setData('rating', star)}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      data.rating >= star ? 'text-yellow-600' : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <InputLabel
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Your Review
            </InputLabel>
            <TextArea
              id="message"
              rows={4}
              value={data.comment}
              onChange={(e) => setData('comment', e.target.value)}
              placeholder="Write your review here..."
              className="w-full resize-none"
            ></TextArea>
          </div>

          <div className="text-right">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" className="ms-2">
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RefundDialog({ item }: { item: OrderItem }) {
  const { data, setData, post, errors, reset } = useForm<{
    category: string;
    reason: string;
    images: File[];
  }>({
    category: 'Wrong Size/Fit',
    reason: '',
    images: [],
  });

  const formId = useId();

  function submit(e: FormEvent) {
    e.preventDefault();

    post(route('order-items.refund-requests.store', item.id), {
      onSuccess: () => {
        toast('Your request has been submitted');
        reset();
      },
    });
  }

  function handleCategoryChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setData('category', e.target.value);
    }
  }

  if (item.refund_request) {
    return (
      <AlertDialog>
        <AlertDialogTrigger
          className={cn(
            'text-sm font-medium text-red-600 transition duration-150 ease-in-out hover:underline focus:outline-none',
            item.quantity === 0 && 'opacity-50',
          )}
        >
          Request Refund
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund Request</AlertDialogTitle>

            <AlertDialogDescription>
              Hello! You have already submitted a refund request for this
              particular product, please check your orders page to track its
              current progress.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="text-sm font-medium text-red-600 transition duration-150 ease-in-out hover:underline focus:outline-none">
        Request Refund
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Refund</DialogTitle>
          <DialogDescription>
            Request All refund requests are subject to review and approval by
            the FSUU Online Bookstore, based on our refund policy. Discrepancies
            or disputes must be reported within 7 days of purchase.
          </DialogDescription>
        </DialogHeader>

        <h2 className="text-lg font-semibold text-gray-800">
          {item.product.name}
        </h2>

        <div className="flex items-start gap-3">
          <img
            src={item.product.images[0].public_url}
            alt={item.product.name}
            className="size-12 object-contain"
          />

          <div>
            <p className="text-sm text-gray-800">
              Ordered {item.quantity} item(s)
            </p>

            <p className="mt-1 text-gray-800">
              Refundable Amount:{' '}
              <span className="font-medium">
                ₱ {(item.quantity * item.variant.price).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <form id={formId} onSubmit={submit}>
          <div>
            <InputLabel htmlFor="category">Category</InputLabel>
            <div className="mt-1 flex items-center gap-x-6">
              <label
                htmlFor="wrong-size"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={handleCategoryChange}
                  checked={'Wrong Size/Fit' === data.category}
                  type="radio"
                  id="wrong-size"
                  name="category"
                  value="Wrong Size/Fit"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                  required
                />
                Wrong Size/Fit
              </label>

              <label
                htmlFor="defective-product"
                className="text-sm font-medium text-gray-700"
              >
                <input
                  onChange={handleCategoryChange}
                  checked={'Defective/Damaged Product' === data.category}
                  type="radio"
                  id="defective-product"
                  name="category"
                  value="Defective/Damaged Product"
                  className="me-2 rounded-full text-sm text-cobalt-800"
                />
                Defective/Damaged Product
              </label>
            </div>

            <InputError message={errors.category} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="reason">
              Additional Information<span className="text-red-600">*</span>
            </InputLabel>

            <TextArea
              id="reason"
              name="reason"
              value={data.reason}
              onChange={(e) => setData('reason', e.target.value)}
              className="mt-1 block w-full resize-none"
              required
            />
            <InputError message={errors.reason} className="mt-2" />
          </div>

          <div className="mt-4 flex gap-3" role="group">
            <div className="flex items-center justify-between">
              <InputLabel htmlFor="images">Proof</InputLabel>
              <InputError message={errors.images} />
            </div>

            {data.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Product ${index}`}
                  className="h-24 w-24 rounded-full border border-gray-300 object-scale-down shadow-sm"
                />
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() =>
                    setData(
                      'images',
                      data.images.filter((_, i) => i !== index),
                    )
                  }
                  className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}

            <label
              className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-500 transition duration-150 ease-in-out hover:bg-gray-300"
              aria-label="Upload images"
            >
              <Plus size={28} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setData(
                    'images',
                    e.target.files
                      ? Array.from(e.target.files).concat(data.images)
                      : data.images,
                  );
                }}
              />
            </label>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button type="submit" form={formId}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
