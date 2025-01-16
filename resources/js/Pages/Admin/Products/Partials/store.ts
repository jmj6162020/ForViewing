import { ProductForm, Variant } from '@/types';
import { atom, useAtom } from 'jotai';
import { toast } from 'sonner';

const initialFormState: ProductForm = {
  category_id: '',
  campus: '',
  name: '',
  sku: '',
  details: '',
  images: [],
  variants: [],
};

export const productFormAtom = atom<ProductForm>(initialFormState);

export function useProductForm() {
  const [data, setAtomData] = useAtom(productFormAtom);

  function setData<Key extends keyof ProductForm>(
    key: Key,
    value: ProductForm[Key],
  ) {
    setAtomData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function addImages(newImages: File[]) {
    setAtomData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  }

  function removeImage(index: number) {
    setAtomData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function addVariant(variant: Omit<Variant, 'id'>) {
    const exists = data.variants.some((v) => v.name === variant.name);
    if (exists) {
      toast('Product variant name already exists');
      return;
    }

    const newVariant = {
      id: Date.now(),
      ...variant,
    };

    setAtomData({
      ...data,
      variants: [...data.variants, newVariant],
    });
  }

  function updateVariant(id: number, updatedFields: Partial<Variant>) {
    setAtomData({
      ...data,
      variants: data.variants.map((variant) =>
        variant.id === id ? { ...variant, ...updatedFields } : variant,
      ),
    });
  }

  function removeVariant(id: number) {
    setAtomData({
      ...data,
      variants: data.variants.filter((variant) => variant.id !== id),
    });
  }

  function reset() {
    setAtomData(initialFormState);
  }

  return {
    data,
    setData,
    addImages,
    removeImage,
    addVariant,
    updateVariant,
    removeVariant,
    reset,
  };
}
