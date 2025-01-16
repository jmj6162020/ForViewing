import { Input } from '@/Components/ui/input';
import AdminLayout from '@/Layouts/AdminLayout';
import { cn } from '@/lib/utils';
import { Customer } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Index({ customers }: { customers: Customer[] }) {
  return (
    <AdminLayout>
      <Head title="Contacts" />

      <h2 className="text-2xl font-semibold leading-tight text-gray-800">
        Customer List
      </h2>

      <form className="mt-4">
        <Input
          type="search"
          name="query"
          placeholder="Search using Customer Name or Email"
          className="block w-full max-w-xs text-sm"
        />
      </form>

      <div className="mt-2 overflow-x-auto rounded-md border border-gray-300 bg-white">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-left font-bold">
              <th className="px-4 py-3 text-sm text-gray-700">Customer Name</th>
              <th className="px-4 py-3 text-sm text-gray-700">
                Customer Email
              </th>
              <th className="px-4 py-3 text-sm text-gray-700">Date Created</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => {
              return (
                <tr
                  key={customer.id}
                  className={cn('border-t border-gray-300')}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={route('admin.customers.orders.show', customer.id)}
                      className="text-sm font-medium text-cobalt-800 hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}

            {customers.length === 0 && (
              <tr className="border-t border-gray-300">
                <td
                  colSpan={6}
                  className="px-4 py-4 text-center text-sm font-medium text-gray-700"
                >
                  No customers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
