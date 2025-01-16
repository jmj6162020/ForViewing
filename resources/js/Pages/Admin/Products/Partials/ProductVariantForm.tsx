import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Variant } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { atom, useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useProductForm } from './store';

const productVariantAtom = atom<Variant | null>(null);
const isOpenAtom = atom(false);

export default function ProductVariantForm() {
  const { data, removeVariant } = useProductForm();
  const [, setProductVariant] = useAtom(productVariantAtom);
  const [, setOpen] = useAtom(isOpenAtom);

  function handleRemoveClick(id: number) {
    removeVariant(id);
    toast('Removed product variant');
  }

  function handleEditClick(variant: Variant) {
    setOpen(true);

    setProductVariant({
      id: variant.id,
      name: variant.name,
      price: variant.price,
      quantity: variant.quantity,
    });
  }

  return (
    <section role="region">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold leading-tight text-gray-800">
          Product Variants
        </h2>

        <VariantForm />
      </div>

      <div className="mt-4 overflow-x-auto rounded-md bg-white shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-t text-left">
              <th className="px-6 py-3 text-sm text-gray-700">Variant Name</th>

              <th className="px-6 py-3 text-right text-sm text-gray-700">
                Price
              </th>

              <th className="px-6 py-3 text-right text-sm text-gray-700">
                Quantity (
                {data.variants.reduce(
                  (total, variant) => (total += variant.quantity),
                  0,
                )}{' '}
                Total)
              </th>

              <th className="px-6 py-3 text-right text-sm text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.variants.map((variant) => (
              <tr key={variant.id} className="border-t-300 border-t">
                <td className="px-6 py-3 text-sm text-gray-700">
                  {variant.name}
                </td>

                <td className="px-6 py-3 text-right text-sm text-gray-700">
                  ₱ {variant.price}
                </td>

                <td className="px-6 py-3 text-right text-sm text-gray-700">
                  {variant.quantity}
                </td>

                <td className="px-6 py-3 text-right text-sm text-gray-700">
                  <button
                    type="button"
                    onClick={() => handleEditClick(variant)}
                    className="transition-duration-150 font-medium text-cobalt-800 ease-in-out hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveClick(variant.id as number)}
                    className="transition-duration-150 ms-2 font-medium text-red-600 ease-in-out hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {data.variants.length === 0 && (
              <tr className="border-t">
                <td
                  colSpan={4}
                  className="px-6 py-3 text-center text-sm font-medium text-gray-700"
                >
                  No variants available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().nonnegative('Quantity must be 0 or greater'),
});

type VariantFormData = z.infer<typeof variantSchema>;

function VariantForm() {
  const [editingVariant, setEditingVariant] = useAtom(productVariantAtom);
  const [isOpen, setOpen] = useAtom(isOpenAtom);

  const { data, addVariant, updateVariant } = useProductForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: data.variants.length === 0 ? 'Default' : '',
      price: 0,
      quantity: 0,
    },
    values: editingVariant || undefined,
  });

  function submit(data: VariantFormData) {
    if (editingVariant != null) {
      updateVariant(+editingVariant.id!, data);
      toast('Product variant successfully updated.');
    } else {
      addVariant(data);
      toast('Product variant successfully added.');
    }

    reset();

    setOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger
        onClick={() => {
          setOpen(true);
          setEditingVariant(null);
        }}
        asChild
      >
        <Button>Add Product Variant</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product Variant</DialogTitle>
          <DialogDescription>Enter Product Variant Details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <InputLabel htmlFor="variant_name">Variant Name</InputLabel>
            <Input
              id="variant_name"
              {...register('name')}
              className="mt-1 block w-full"
            />

            <InputError message={errors.name?.message} className="mt-2" />
          </div>

          <div>
            <InputLabel htmlFor="variant_price">Price</InputLabel>
            <Input
              id="variant_price"
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full"
              required
            />

            <InputError message={errors.price?.message} className="mt-2" />
          </div>

          <div>
            <InputLabel htmlFor="variant_quantity">Variant Quantity</InputLabel>
            <Input
              id="variant_quantity"
              {...register('quantity', { valueAsNumber: true })}
              className="mt-1 block w-full"
              required
            />

            <InputError message={errors.quantity?.message} className="mt-2" />
          </div>

          <Button className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
