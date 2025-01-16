import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ProductImageControl from '@/Components/ProductImageControl';
import Select from '@/Components/Select';
import TextArea from '@/Components/TextArea';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Category, Product } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { FormEvent, useId } from 'react';
import { toast } from 'sonner';
import { useProductForm } from './store';

export default function ProductDetailsForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const formId = useId();

  const { data, setData, reset } = useProductForm();
  const { errors } = usePage().props;

  const { user } = usePage().props.auth;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (data.variants.length === 0) {
      toast('Please add at least 1 variant');
      return;
    }

    if (!product) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.post(route('admin.products.store'), data as Record<string, any>, {
        onSuccess: () => reset(),
      });
    } else {
      router.post(
        route('admin.products.update', product.id!),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data as Record<string, any>,
        {
          onSuccess: () => reset(),
        },
      );
    }
  }

  return (
    <section role="form">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold leading-tight text-gray-800">
          New Product
        </h2>

        <div>
          <Button variant="outline" asChild>
            <Link href={route('admin.products.index')}>Cancel</Link>
          </Button>

          <Button form={formId} type="submit" className="ms-2">
            Save Product
          </Button>
        </div>
      </div>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="mt-4 flex gap-8 rounded-md bg-white p-8 shadow"
      >
        <div className="flex-1 shrink-0 space-y-6">
          <div>
            <InputLabel
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              Product Category<span className="text-red-600">*</span>
            </InputLabel>

            <Select
              id="category_id"
              name="category_id"
              value={data.category_id}
              onChange={(e) => setData('category_id', e.target.value)}
              autoComplete="off"
              className="mt-1 block w-full text-sm"
            >
              <option value="">Select an option</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>

            <InputError message={errors.category_id} className="mt-2" />
          </div>

          {user.campus === 'Super Admin' && (
            <div>
              <InputLabel
                htmlFor="campus"
                className="block text-sm font-medium text-gray-700"
              >
                Campus<span className="text-red-600">*</span>
              </InputLabel>

              <Select
                id="campus"
                name="campus"
                value={data.campus}
                onChange={(e) => setData('campus', e.target.value)}
                autoComplete="off"
                className="mt-1 block w-full text-sm"
              >
                <option value="">Select an option</option>
                <option value="Main">Main Campus</option>
                <option value="Morelos">Morelos Campus</option>
              </Select>

              <InputError message={errors.campus} className="mt-2" />
            </div>
          )}

          <div>
            <InputLabel
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name<span className="text-red-600">*</span>
            </InputLabel>

            <TextInput
              id="name"
              name="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              autoComplete="off"
              className="mt-1 block w-full text-sm"
            />

            <InputError message={errors.name} className="mt-2" />
          </div>

          <div>
            <InputLabel
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700"
            >
              Product SKU<span className="text-red-600">*</span>
            </InputLabel>

            <TextInput
              id="sku"
              name="sku"
              value={data.sku}
              onChange={(e) => setData('sku', e.target.value)}
              className="mt-1 block w-full text-sm"
            />
          </div>

          <InputError message={errors.sku} className="mt-2" />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <InputLabel
              htmlFor="details"
              className="block text-sm font-medium text-gray-700"
            >
              Product Details
            </InputLabel>

            <TextArea
              id="details"
              name="details"
              rows={3}
              value={data.details}
              onChange={(e) => setData('details', e.target.value)}
              className="mt-1 block w-full resize-none text-sm"
            ></TextArea>

            <InputError message={errors.details} className="mt-2" />
          </div>

          <div>
            <div className="flex items-start justify-between">
              <InputLabel htmlFor="images" className="mb-2">
                Product Images<span className="text-red-600">*</span>
              </InputLabel>

              <InputError message={errors.images} className="mb-2" />
            </div>

            <ProductImageControl images={product?.images} id="images" />
          </div>
        </div>
      </form>
    </section>
  );
}
