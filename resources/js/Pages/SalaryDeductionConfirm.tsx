import { Head } from '@inertiajs/react';

export default function SalaryDeductionConfirm() {
  return (
    <>
      <Head title="Salary Deduction" />

      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <p className="text-medium font-lg text-gray-800">
          Your salary deduction form is complete, please resume your cart
          checkout.
        </p>
      </div>
    </>
  );
}
