import AdminLayout from '@/Layouts/AdminLayout';
import { Review } from '@/types';
import { Head } from '@inertiajs/react';

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <AdminLayout>
      <Head title="Product Reviews" />

      <h2 className="text-2xl font-semibold leading-tight text-gray-800">
        Product Reviews
      </h2>

      <div className="mt-4 overflow-x-auto rounded-md bg-white shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-left font-bold">
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Customer Email
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">
                Review
              </th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => {
              return (
                <tr key={review.id} className="border-t border-gray-300">
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {review.user.name}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {review.user.email}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {review.item.product.name} - {review.item.variant.name}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {review.item.product.category.name}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {review.rating}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-gray-700">
                    {review.comment}
                  </td>
                </tr>
              );
            })}
            {reviews.length === 0 && (
              <tr className="border-t border-gray-300">
                <td
                  colSpan={7}
                  className="px-4 py-4 text-center text-sm font-medium text-gray-700"
                >
                  No reviews available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
