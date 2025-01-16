import { Button } from '@/Components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/Components/ui/carousel';
import { Input } from '@/Components/ui/input';
import AppLayout from '@/Layouts/AppLayout';
import { CartItem, Product, Review, Variant } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CornerUpLeft, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProductDetails({
  product,
  cartItems,
}: {
  product: Product;
  cartItems: CartItem[];
}) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.variants[0],
  );

  const [quantity, setQuantity] = useState(0);

  function handleVariantSelect(variant: Variant) {
    setSelectedVariant(variant);

    if (quantity > variant.quantity) {
      setQuantity(variant.quantity);
    }
  }

  function handleQuantityChange(type: 'increase' | 'decrease') {
    if (!selectedVariant) return;

    if (type === 'increase' && quantity < selectedVariant.quantity) {
      setQuantity((prev) => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }

  async function handleAddToCartClick() {
    router.post(
      route('cart.store'),
      {
        product_id: product.id,
        variant_id: selectedVariant?.id,
        quantity: quantity,
      },
      {
        onSuccess: () => toast('Item added to cart'),
        onError: (error) => toast(error.quantity),
        preserveScroll: true,
      },
    );
  }

  return (
    <AppLayout>
      <Head title={product.name} />

      <div className="mx-auto px-4">
        <Button asChild variant="outline">
          <Link
            href={route('categories.products.index', product.category.slug)}
          >
            <CornerUpLeft className="size-4 shrink-0" />
            Back
          </Link>
        </Button>

        <div className="mt-1 flex flex-col gap-8 md:flex-row">
          <div className="mx-8 flex-1 basis-1/3">
            <Carousel>
              <CarouselContent>
                {product.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.public_url}
                    alt={product.name}
                    className="h-96 w-full border-gray-200 object-contain p-4 shadow"
                  />
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="mt-4 flex-1 basis-2/3">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            <p className="text-gray-600">
              <span className="font-medium">Location</span>: {product.campus}{' '}
              Campus
            </p>

            <p className="text-gray-600">
              {product.details || 'No details available.'}
            </p>

            {selectedVariant && (
              <div className="mt-6">
                <p className="text-4xl font-bold text-blue-600">
                  ₱ {selectedVariant.price.toLocaleString()}
                </p>

                <p className="mt-2 text-gray-600">
                  Available Stock:{' '}
                  <span className="font-medium text-gray-800">
                    {selectedVariant.quantity > 0
                      ? selectedVariant.quantity
                      : 'Out of stock'}{' '}
                    (
                    {cartItems.reduce((inCart, item) => {
                      return inCart + item.quantity;
                    }, 0)}{' '}
                    in cart)
                  </span>
                </p>

                <div className="flex items-center gap-x-2">
                  <div className="mt-1 font-medium text-gray-800">
                    <RatingStar rating={product.rating} />
                  </div>

                  <span className="font-semibold text-gray-500">|</span>

                  <p className="mt-1 font-medium text-gray-800">
                    {selectedVariant.total_sold} sold
                  </p>
                </div>
              </div>
            )}

            <div className="mt-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Select Variant
              </h2>

              <div className="mt-2 flex flex-wrap gap-4">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={
                      selectedVariant?.id === variant.id ? 'default' : 'outline'
                    }
                    onClick={() => handleVariantSelect(variant)}
                    className={`px-4 py-2 ${
                      selectedVariant?.id === variant.id &&
                      'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100'
                    }`}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            {selectedVariant && selectedVariant.quantity > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Quantity
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>

                  <Input
                    type="number"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max={selectedVariant.quantity}
                    className="w-24 text-center"
                    key={crypto.randomUUID()}
                  />

                  <Button
                    variant="outline"
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= selectedVariant.quantity}
                  >
                    +
                  </Button>

                  <Button
                    onClick={handleAddToCartClick}
                    disabled={
                      !selectedVariant || selectedVariant.quantity === 0
                    }
                    className="ms-2"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-md">
            <ProductReviews reviews={product.reviews} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ProductReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="rounded-md bg-white p-6">
      <h3 className="text-lg font-semibold">Customer Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="mt-4 border-b pb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {review.user.name} -{' '}
                {new Date(review.created_at).toLocaleDateString()}
              </p>

              <RatingStar rating={review.rating} />
            </div>
            <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No reviews yet.</p>
      )}
    </div>
  );
}

function RatingStar({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          fill={i < rating ? 'yellow' : 'white'}
          key={i}
          size={16}
          className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}
