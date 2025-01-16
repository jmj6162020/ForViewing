import { useProductForm } from '@/Pages/Admin/Products/Partials/store';
import { Image } from '@/types';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, Ref, useState } from 'react';
import { toast } from 'sonner';

export default forwardRef(function ProductImageControl(
  {
    images,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & { images?: Image[] },
  ref: Ref<HTMLInputElement>,
) {
  ``;
  const { data, addImages, removeImage } = useProductForm();
  const [productImages, setProductImages] = useState(images);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      addImages(Array.from(files));
    }
  };

  async function removeImageFromServer(imageId: number) {
    await axios
      .delete(route('images.destroy', imageId))
      .then((response) => {
        if (response.status === 204) {
          toast('Image removed');

          setProductImages((prev) => {
            return prev?.filter((image) => image.id !== imageId);
          });
        }
      })
      .then(() => {
        toast('Removed image');
      });
  }

  return (
    <div className="flex flex-wrap gap-4">
      {productImages?.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image?.public_url}
            alt={`Product ${index}`}
            className="h-24 w-24 rounded-full border border-gray-300 object-scale-down shadow-sm"
          />
          <button
            type="button"
            onClick={() => removeImageFromServer(+image.id!)}
            className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md hover:bg-red-600"
            aria-label={`Remove image ${index + 1}`}
          >
            &times;
          </button>
        </div>
      ))}

      {data.images.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={URL.createObjectURL(image)}
            alt={`Product ${index}`}
            className="h-24 w-24 rounded-full border border-gray-300 object-contain shadow-sm"
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md hover:bg-red-600"
            aria-label={`Remove image ${index + 1}`}
          >
            &times;
          </button>
        </div>
      ))}

      <label
        className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-500 transition duration-150 ease-in-out hover:bg-gray-300"
        aria-label="Upload images"
      >
        <Plus size={28} />
        <input
          ref={ref}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          {...props}
        />
      </label>
    </div>
  );
});
