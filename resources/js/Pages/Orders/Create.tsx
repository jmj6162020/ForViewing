import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { CartItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useId, useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutPage({ cartItems }: { cartItems: CartItem[] }) {
  const {
    auth: { user },
  } = usePage().props;

  const { data, setData, post } = useForm({
    payment_method: 'cash',
  });
  const [isOpen, setOpen] = useState(false);

  const total = cartItems
    .filter((item) => item.selected)
    .reduce((total, item) => {
      return total + item.variant.price * item.quantity;
    }, 0);

  function handlePlaceOrderClick() {
    post(route('orders.store'));
  }

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <AppLayout>
      <Head title="Checkout" />

      <div className="mx-auto md:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold">Checkout</h2>

        <div className="flex items-start gap-8">
          <div className="flex-1 basis-2/3 overflow-x-auto rounded-md border bg-white shadow">
            <table className="w-full">
              <thead>
                <tr className="text-bold">
                  <th className="px-4 py-2 text-left text-gray-700">
                    Product Image
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700">
                    Product Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700">Variant</th>
                  <th className="px-4 py-2 text-right text-gray-700">Price</th>
                  <th className="px-4 py-2 text-right text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-right text-gray-700">Total</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.length === 0 && (
                  <tr className="border-t border-gray-300">
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center font-medium text-gray-700"
                    >
                      You have no items in your cart. Keep shopping!
                    </td>
                  </tr>
                )}

                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-300">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <img
                        src={item.product.images[0].public_url}
                        alt={item.product.name}
                        className="ms-4 h-16 w-16 object-contain py-2"
                      />
                    </td>

                    <td className="max-w-[20ch] text-wrap px-4 py-2 text-left text-gray-700">
                      {item.product.name}
                    </td>

                    <td className="max-w-[20ch] text-wrap px-4 py-2 text-left text-gray-700">
                      {item.variant.name}
                    </td>

                    <td className="px-4 py-2 text-right text-gray-700">
                      ₱ {item.variant.price.toLocaleString()}
                    </td>

                    <td className="px-4 py-2 text-right text-gray-700">
                      {item.quantity.toLocaleString()}
                    </td>

                    <td className="px-4 py-2 text-right text-gray-700">
                      ₱ {(item.variant.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex basis-1/3 flex-col">
            <div className="rounded-md bg-white p-4 shadow">
              <h3 className="mb-4 text-lg font-semibold">Payment Options</h3>

              {user.designation !== 'student' && user.designation !== 'outsider' && (
                <div className="flex items-center gap-x-3">
                  <input
                    type="radio"
                    id="salary_deduction"
                    name="payment_type"
                    className="rounded-full border border-gray-300 text-sm text-cobalt-800 shadow-sm"
                    onClick={() => {
                      setOpen(true);
                      setData('payment_method', 'salary_deduction');
                    }}
                    checked={data.payment_method === 'salary_deduction'}
                  />
                  <label
                    htmlFor="salary_deduction"
                    className="text-nowrap font-medium text-gray-900"
                  >
                    Salary Deduction (For Employees Only)
                  </label>

                  <SalaryDeductionDialog
                    isOpen={isOpen}
                    closeModal={closeModal}
                  />
                </div>
              )}

              <div className="mt-4 flex items-center gap-x-3">
                <input
                  type="radio"
                  id="cash"
                  name="payment_type"
                  className="rounded-full border border-gray-300 text-cobalt-800 shadow-sm"
                  checked={data.payment_method === 'cash'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setData('payment_method', 'cash');
                    }
                  }}
                />
                <label htmlFor="cash" className="font-medium text-gray-900">
                  Cash
                </label>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-white p-4 shadow">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

              <div className="mb-2 flex items-center justify-between border-b border-gray-300">
                <span className="text-gray-700">Subtotal: </span>
                <span className="text-xl font-medium text-gray-900">
                  ₱ {total.toLocaleString()}
                </span>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-cobalt-800">Total: </span>
                <span className="text-2xl font-bold text-cobalt-900">
                  ₱ {total.toLocaleString()}
                </span>
              </div>

              <Button onClick={handlePlaceOrderClick} className="w-full">
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SalaryDeductionDialog({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const formId = useId();

  const { data, setData, post, errors } = useForm({
    student_1: '',
    student_2: '',
    student_3: '',
    student_4: '',
    student_1_yrlvl: '',
    student_2_yrlvl: '',
    student_3_yrlvl: '',
    student_4_yrlvl: '',
    starting_date: '',
    ending_date: '',
    amount: '',
  });

  console.log(errors);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('salary_deductions.store'), {
      onSuccess: () => {
        toast(
          'Your salary deduction form is complete, please resume your cart checkout.',
        );
        closeModal();
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Please Download The Salary Deduction Form Below
          </AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>

        <form id={formId} onSubmit={submit}>
          <div className="grid grid-cols-2 items-center gap-2">
            <span className="block text-sm font-medium text-gray-900">
              Name of Students
            </span>

            <span className="block text-sm font-medium text-gray-900">
              Year Level
            </span>
          </div>

          <div className="mt-1 grid grid-cols-2 items-center gap-2">
            <TextInput
              className="w-full"
              value={data.student_1}
              onChange={(e) => setData('student_1', e.target.value)}
              required
            />
            <TextInput
              className="w-full"
              value={data.student_1_yrlvl}
              onChange={(e) => setData('student_1_yrlvl', e.target.value)}
              required
            />

            <TextInput
              className="w-full"
              value={data.student_2}
              onChange={(e) => setData('student_2', e.target.value)}
            />

            <TextInput
              className="w-full"
              value={data.student_2_yrlvl}
              onChange={(e) => setData('student_2_yrlvl', e.target.value)}
            />

            <TextInput
              className="w-full"
              value={data.student_3}
              onChange={(e) => setData('student_3', e.target.value)}
            />

            <TextInput
              className="w-full"
              value={data.student_3_yrlvl}
              onChange={(e) => setData('student_3_yrlvl', e.target.value)}
            />

            <TextInput
              className="w-full"
              value={data.student_4}
              onChange={(e) => setData('student_4', e.target.value)}
            />

            <TextInput
              className="w-full"
              value={data.student_4_yrlvl}
              onChange={(e) => setData('student_4_yrlvl', e.target.value)}
            />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="col-span-2 flex items-center gap-x-3">
              <InputLabel
                htmlFor="starting_date"
                value="Start date of deduction"
                className="shrink-0"
              />

              <TextInput
                id="starting_date"
                type="date"
                placeholder="Start date of deduction"
                className="w-full"
                required
                value={data.starting_date}
                onChange={(e) => setData('starting_date', e.target.value)}
              />
            </div>

            <div className="col-span-2 flex items-center gap-x-3">
              <InputLabel
                htmlFor="ending_date"
                value="End date of deduction"
                className="shrink-0"
              />

              <TextInput
                id="ending_date"
                type="date"
                placeholder="End date of deduction"
                className="w-full"
                required
                value={data.ending_date}
                onChange={(e) => setData('ending_date', e.target.value)}
              />
            </div>

            <div className="col-span-2 flex items-center gap-x-3">
              <InputLabel
                htmlFor="amount"
                value="Amount per deduction"
                className="shrink-0"
              />

              <TextInput
                id="amount"
                className="w-full"
                required
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
              />
            </div>
          </div>
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button type="submit" form={formId}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
