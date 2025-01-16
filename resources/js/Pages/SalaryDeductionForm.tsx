import { Order } from '@/types';
import { useEffect } from 'react';

const SalaryDeductionForm = ({ order }: { order: Order }) => {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="flex flex-col px-24 py-8">
      <div className="text-center">
        <h1 className="uppercase">Father Saturnino Urios University</h1>
        <h1 className="font-bold uppercase">
          Auxiliary Resource and Services Office
        </h1>
        <h1 className="uppercase">Butuan City</h1>
        <h1 className="font-bold underline">Salary Deduction Form 1</h1>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-48 gap-y-2">
        <div className="flex gap-x-3">
          <label htmlFor="name">Name:</label>
          <p id="name">{order.user.name}</p>
        </div>

        <div className="flex gap-x-3">
          <label htmlFor="form_number">Form No.:</label>
          <p id="form_number">__________</p>
        </div>

        <div className="flex gap-x-3">
          <label htmlFor="form_number">Department:</label>
          <p id="form_number">__________</p>
        </div>

        <div className="flex gap-x-3">
          <label htmlFor="form_number">Date:</label>
          <p id="form_number">{new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div className="mt-7">
          <p>Salary Deduction Type:</p>
          <p>Books/Uniform (exclusive to FSUU employees children only)</p>

          <p className="mt-4">Name of Student(s):</p>
          <div className="grid grid-cols-2 gap-x-24">
            <p>{order.salary_deduction.student_1}</p>
            <p>{order.salary_deduction.student_1_yrlvl}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-24">
            <p>{order.salary_deduction.student_2}</p>
            <p>{order.salary_deduction.student_2_yrlvl}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-24">
            <p>{order.salary_deduction.student_3}</p>
            <p>{order.salary_deduction.student_3_yrlvl}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-24">
            <p>{order.salary_deduction.student_4}</p>
            <p>{order.salary_deduction.student_4_yrlvl}</p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex justify-start">
        <table className="min-w-[900px]">
          <thead>
            <tr>
              <th className="text-left">Particulars</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Quantity</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name } - {item.variant.name}</td>
                <td className="text-right">
                  ₱ {item.variant.price.toLocaleString()}
                </td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">
                  ₱ {(item.quantity * item.variant.price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <p>Note: All ARSO supplies are deducted within (6) months period.</p>

        <div className="mt-2">
          Start date of deduction:{' '}
          {new Date(order.salary_deduction.starting_date).toLocaleDateString()}
        </div>

        <div className="mt-2">
          End date of deduction:{' '}
          {new Date(order.salary_deduction.ending_date).toLocaleDateString()}
        </div>

        <div className="mt-2 flex justify-between items-center w-[900px]">
          <p>Amount per deduction: ₱ {order.salary_deduction.amount}</p>
          <div>
            ___________________________________________
            <p>Employee's signature over printed name</p>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center w-[900px]">
            <div className="">
              ___________________________________________
              <p>FSUU-ARSO Staff</p>
            </div>

            <div className="">
              ___________________________________________
              <p>Director, FSUU ARSO</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDeductionForm;
