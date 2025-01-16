import { Button } from './ui/button';

export interface BestSellingProduct {
  product_name: string;
  total_sales: number;
}

interface BestSellingProductsTableProps {
  bestSellingProducts: BestSellingProduct[];
}

export default function BestSellingProductsTable({
  bestSellingProducts,
}: BestSellingProductsTableProps) {
  return (
    <div className="w-full rounded border bg-white p-4 shadow">
      <div className="flex items-start justify-between">
        <div className="">
          <h3 className="text-xl font-semibold text-gray-800">
            Best Selling Products
          </h3>
          <p className="text-gray-500">(This Month)</p>
        </div>

        <Button size="sm" asChild>
          <a
            href={route('reports.monthly-best-selling')}
            target="_blank"
            rel="noreferrer"
          >
            Export to CSV
          </a>
        </Button>
      </div>

      <table className="mt-4 min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Product Name
            </th>
            <th className="text-nowrap px-4 py-2 text-right text-sm font-semibold text-gray-600">
              Total Sales (₱)
            </th>
          </tr>
        </thead>

        <tbody>
          {bestSellingProducts.map((product) => (
            <tr key={product.product_name} className="border-b">
              <td className="px-4 py-2 text-sm text-gray-700">
                {product.product_name}
              </td>
              <td className="text-nowrap px-4 py-2 text-right text-sm text-gray-700">
                ₱ {product.total_sales.toLocaleString()}
              </td>
            </tr>
          ))}
          {bestSellingProducts.length === 0 && (
            <tr className="border-b">
              <td
                colSpan={2}
                className="px-4 py-2 text-center text-sm text-gray-700"
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
