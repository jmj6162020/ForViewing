import ProductCard from '@/Components/ProductCard';
import ProductSearch from '@/Components/ProductSearch';
import AppLayout from '@/Layouts/AppLayout';
import { Category, Product } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Index({
  products,
  category,
  campus,
  name,
}: {
  products: Product[];
  category: Category;
  campus: string;
  name: string;
}) {
  return (
    <AppLayout>
      <Head title={`${category.name}`} />

      <div className="max-w-xl">
        <ProductSearch category={category.slug} campus={campus} name={name} />
      </div>

      <div className="mt-4 flex items-start gap-4">
        <nav className="w-1/6 shrink-0 rounded-lg border border-gray-200 bg-white p-4 shadow">
          <ul className="list-inside list-disc space-y-2">
            <li>
              <Link
                href={
                  route('categories.products.index', 'school-supplies') +
                  '?filter[campus]=Main'
                }
                className="rounded-md py-2 text-gray-700 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
              >
                School Supplies
              </Link>
            </li>

            <li>
              <Link
                href={
                  route('categories.products.index', 'uniforms') +
                  '?filter[campus]=Main'
                }
                className="rounded-md py-2 text-gray-700 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
              >
                Uniforms
              </Link>
            </li>

            <li>
              <Link
                href={
                  route('categories.products.index', 'books') +
                  '?filter[campus]=Main'
                }
                className="rounded-md py-2 text-gray-700 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
              >
                Books
              </Link>
            </li>

            <li>
              <Link
                href={
                  route('categories.products.index', 'urian-merchandise') +
                  '?filter[campus]=Main'
                }
                className="rounded-md py-2 text-gray-700 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
              >
                Urian Merchandise
              </Link>
            </li>
          </ul>
        </nav>

        <div className="grid w-5/6 grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {products.length === 0 && (
            <div className="col-span-4 mt-6 text-center font-medium text-gray-600">
              No products available in this category.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
