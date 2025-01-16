import { Button } from '@/Components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';
import { CartItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { ChangeEvent } from 'react';

export default function CartPage({ cartItems }: { cartItems: CartItem[] }) {
  const total = cartItems.reduce((total, item) => {
    if (!item.selected) return total;
    return total + item.variant.price * item.quantity;
  }, 0);

  const selectedCount = cartItems.reduce((count, item) => {
    return item.selected ? count + 1 : count;
  }, 0);

  function handleToggleAllChange(e: ChangeEvent<HTMLInputElement>) {
    router.patch(
      route('cart-items.selected.update', {
        selected: e.target.checked,
      }),
    );
  }

  function handleCartItemChange(checked: boolean, itemId: number) {
    router.patch(route('cart-items.update', itemId), {
      selected: checked,
    });
  }

  function handleRemoveCartItemClick(itemId: number) {
    router.delete(route('cart-items.destroy', itemId));
  }

  function handleCheckoutClick() {
    router.get(route('orders.create'));
  }

  function handleItemQuantityChange(quantity: number, itemId: number) {
    router.patch(route('cart-items.quantity.update', itemId), {
      quantity,
    });
  }

  return (
    <AppLayout>
      <Head title="My Cart" />

      <div className="mx-auto md:px-6 lg:px-8">
        <div className="flex space-x-2">
          <Link
            href={route('cart.index', { campus: 'Main' })}
            className={cn(
              'px-4 py-2 text-sm transition duration-150 ease-in-out',
              route().queryParams.campus === 'Main' ||
                !route().queryParams.campus
                ? 'font-semibold text-gray-900'
                : 'text-gray-500 hover:text-gray-900',
            )}
          >
            Main Campus
          </Link>

          <Link
            href={route('cart.index', { campus: 'Morelos' })}
            className={cn(
              'px-4 py-2 text-sm transition duration-150 ease-in-out',
              route().queryParams.campus === 'Morelos'
                ? 'font-semibold text-gray-900'
                : 'text-gray-500 hover:text-gray-900',
            )}
          >
            Morelos Campus
          </Link>
        </div>

        <div className="flex items-start">
          <div className="flex-1 basis-3/4 overflow-x-auto rounded-md bg-white shadow">
            <table className="w-full">
              <thead>
                <tr className="text-bold">
                  <th className="px-4 pb-2 pt-3 text-center text-gray-700">
                    <input
                      key={crypto.randomUUID()}
                      type="checkbox"
                      onChange={handleToggleAllChange}
                      defaultChecked={
                        cartItems.length > 0
                          ? selectedCount === cartItems.length
                          : false
                      }
                      className="rounded-full border border-gray-300 shadow-sm"
                    />
                  </th>
                  <th className="text-nowrap px-4 pb-2 pt-3 text-center text-gray-700">
                    Product Image
                  </th>
                  <th className="px-4 pb-2 pt-3 text-left text-gray-700">
                    Product Name
                  </th>
                  <th className="px-4 pb-2 pt-3 text-left text-gray-700">
                    Variant
                  </th>
                  <th className="px-4 pb-2 pt-3 text-right text-gray-700">
                    Price
                  </th>
                  <th className="px-4 pb-2 pt-3 text-center text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 pb-2 pt-3 text-right text-gray-700">
                    Total
                  </th>
                  <th className="px-4 pb-2 pt-3 text-right text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {cartItems.filter((item) => item.product.campus === 'Main')
                  .length === 0 && (
                  <tr className="border-t border-gray-300">
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-700"
                    >
                      You have no items in your cart. Keep shopping!
                    </td>
                  </tr>
                )}

                {cartItems
                  .filter((item) => item.product.campus === 'Main')
                  .map((item) => (
                    <tr key={item.id} className="border-t border-gray-300">
                      <td className="px-4 py-2 text-center text-sm text-gray-700">
                        <input
                          key={crypto.randomUUID()}
                          type="checkbox"
                          onChange={(e) => {
                            handleCartItemChange(e.target.checked, +item.id);
                          }}
                          defaultChecked={item.selected}
                          className="rounded-full border border-gray-300 shadow-sm"
                        />
                      </td>

                      <td className="px-4 py-2 text-sm text-gray-700">
                        <img
                          src={item.product.images[0].public_url}
                          alt={item.product.name}
                          className="mx-auto h-20 w-20 object-contain py-2"
                        />
                      </td>

                      <td className="max-w-[20ch] text-wrap px-4 py-2 text-left text-gray-700 transition duration-150 ease-in-out hover:underline">
                        <Link href={route('products.show', item.product.id)}>
                          {item.product.name}
                        </Link>
                      </td>

                      <td className="text-nowrap px-4 py-2 text-left text-gray-700">
                        {item.variant.name}
                      </td>

                      <td className="text-nowrap px-4 py-2 text-right text-gray-700">
                        ₱ {item.variant.price}
                      </td>

                      <td className="text-nowrap px-4 py-2 text-right text-gray-700">
                        <CartItemQuantityControl
                          item={item}
                          onQuantityChange={handleItemQuantityChange}
                        />
                      </td>

                      <td className="text-nowrap px-4 py-2 text-right text-gray-700">
                        ₱{' '}
                        {(item.variant.price * item.quantity).toLocaleString()}
                      </td>

                      <td className="px-4 py-2 text-right text-gray-700">
                        <Button
                          onClick={() => handleRemoveCartItemClick(+item.id)}
                          variant="ghost"
                        >
                          <X />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="ml-4 w-64 basis-1/4 rounded-lg bg-white p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Order Summary
            </h2>

            <div className="mb-2 flex items-center justify-between border-b border-gray-300">
              <span className="text-gray-700">Subtotal: </span>
              <span className="text-xl font-medium text-gray-900">
                ₱ {total.toLocaleString()}
              </span>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-cobalt-800">Total: </span>
              <span className="text-2xl font-semibold text-cobalt-900">
                ₱ {total.toLocaleString()}
              </span>
            </div>

            <Button
              onClick={handleCheckoutClick}
              disabled={selectedCount === 0}
              className="w-full"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function CartItemQuantityControl({
  item,
  onQuantityChange: handleItemQuantityChange,
}: {
  item: CartItem;
  onQuantityChange: (arg0: number, arg1: number) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-x-2">
      <button
        onClick={() => handleItemQuantityChange(item.quantity - 1, item.id)}
        className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        key={crypto.randomUUID()}
        type="number"
        className="w-16 rounded-md border border-gray-300 bg-white py-1 text-center text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue={item.quantity}
        min="1"
        readOnly
      />
      <button
        onClick={() => handleItemQuantityChange(item.quantity + 1, item.id)}
        className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
