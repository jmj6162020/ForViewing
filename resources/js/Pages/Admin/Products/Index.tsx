import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import AdminLayout from '@/Layouts/AdminLayout';
import { Product } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Products({
  products,
  archived,
}: {
  products: Product[];
  archived: number;
}) {
  const [isOpen, setOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<number | null>(null);

  const { user } = usePage().props.auth;

  function handleArchiveClick(productId: number) {
    setDeletingProduct(productId);
    setOpen(true);
  }

  function handleConfirmArchiveProduct() {
    setOpen(false);
    router.delete(route('admin.products.destroy', String(deletingProduct)));
  }

  return (
    <AdminLayout>
      <Head title="Products" />

      <h2 className="text-2xl font-semibold leading-tight text-gray-800">
        Product List
      </h2>

      <div className="mt-4 flex items-end justify-between">
        <form className="flex flex-1 items-center">
          <TextInput
            name="query"
            placeholder="Search using SKU or Product Name"
            className="w-full max-w-[264px] flex-1 text-sm"
          />

          <Link
            href={route('admin.products.index')}
            className="ms-2 text-sm text-gray-700 hover:underline hover:underline-offset-4"
          >
            Reset
          </Link>
        </form>

        <div>
          <Select
            key={crypto.randomUUID()}
            className="me-2 text-sm"
            onChange={(e) => {
              router.get(
                route('admin.products.index', { archived: e.target.value }),
              );
            }}
            defaultValue={String(archived)}
          >
            <option value="0">Active Products</option>
            <option value="1">Archived Products</option>
          </Select>

          <Button asChild>
            <Link href={route('admin.products.create')}>Add Product</Link>
          </Button>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-md bg-white shadow">
        <Dialog open={isOpen} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                By archiving this product, it will be removed from the catalog.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleConfirmArchiveProduct} className="ms-2">
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left font-bold">
                {user.campus === 'Super Admin' && (
                  <th className="px-4 py-2 text-sm text-gray-700">Campus</th>
                )}
                <th className="px-4 py-2 text-sm text-gray-700">SKU</th>
                <th className="px-4 py-2 text-center text-sm text-gray-700">
                  Product Image
                </th>
                <th className="px-4 py-2 text-sm text-gray-700">
                  Product Name
                </th>
                <th className="px-4 py-2 text-right text-sm text-gray-700">
                  Variations
                </th>
                <th className="px-4 py-2 text-right text-sm text-gray-700">
                  Price
                </th>
                <th className="px-4 py-2 text-right text-sm text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product.id} className="border-t border-gray-300">
                    {user.campus === 'Super Admin' && (
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {product.campus} Campus
                      </td>
                    )}
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {product.sku}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <img
                        src={product.images[0].public_url}
                        alt=""
                        className="mx-auto h-14 w-14 rounded-full object-scale-down"
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {product.name}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-gray-700">
                      {product.variants.length}
                    </td>
                    <td className="px-4 py-2 text-right text-sm text-gray-700">
                      ₱ {product.price_range}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={route('admin.products.edit', product.id)}
                        className="text-sm text-[#ff7b00] transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
                      >
                        Edit
                      </Link>

                      {!archived ? (
                        <button
                          type="button"
                          onClick={() => handleArchiveClick(product.id!)}
                          className="ms-2 text-sm text-cobalt-800 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
                        >
                          Archive
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            router.post(route('products.restore', product.id))
                          }
                          className="ms-2 text-sm text-cobalt-800 transition duration-150 ease-in-out hover:underline hover:underline-offset-4"
                        >
                          Unarchive
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr className="border-t border-gray-300">
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-sm font-medium text-gray-700"
                  >
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
