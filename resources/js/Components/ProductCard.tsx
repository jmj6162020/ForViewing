import { Product } from '@/types';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={route('products.show', product.id!)}
      className="max-w-sm overflow-hidden rounded-md border border-gray-300 bg-white shadow duration-300"
    >
      <div className="relative h-48 w-full">
        <img
          src={product.images[0].public_url}
          alt={product.name}
          className="h-full w-full object-contain p-4"
        />
      </div>

      <div className="border-t border-gray-300 p-4">
        <h2 className="truncate text-lg font-semibold text-gray-800">
          {product.name}
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Location:{' '}
          <span className="font-bold text-gray-900">
            {product.campus} Campus
          </span>
        </p>

        <p className="mt-1 text-sm text-gray-600">
          Price:{' '}
          <span className="font-bold text-gray-900">
            ₱ {product.price_range}
          </span>
        </p>

        <div className="flex items-end justify-between">
          <p
            className={`mt-2 text-sm font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <p className="text-sm font-medium text-gray-900">
            {product.total_sold} sold
          </p>
        </div>
      </div>
    </Link>
  );
}
