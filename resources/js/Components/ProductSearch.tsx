import { router } from '@inertiajs/react';
import Select from './Select';
import { Input } from './ui/input';

export default function ProductSearch({
  category,
  campus,
  name,
}: {
  category: string;
  campus: string;
  name: string;
}) {
  return (
    <form
      action={route('categories.products.index', category)}
      className="flex w-full items-center"
    >
      <Select
        onChange={(e) => {
          router.get(route('categories.products.index', category), {
            'filter[campus]': e.currentTarget.value,
          });
        }}
        className="w-full max-w-[202.667px]"
        defaultValue={campus}
      >
        <option value="Main">Main Campus</option>
        <option value="Morelos">Morelos Campus</option>
      </Select>

      <Input
        type="search"
        name="filter[name]"
        placeholder="Search ..."
        className="ms-3 block w-full"
        defaultValue={name}
      />
    </form>
  );
}
