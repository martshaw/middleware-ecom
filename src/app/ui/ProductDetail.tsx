import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Accordion } from "../../components/ui/accordion";
import Link from "next/link";
import Image from "next/image";

const sizes = ["35.5", "36", "36.5", "37", "37.5", "38", "38.5", "39", "39.5", "40", "41", "41.5", "42", "42.5", "43"];
const recommendations = [
  { name: "Nike Santa Sneaker", price: 74.95, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
  { name: "Travis Retro Sneaker", price: 74.95, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
  { name: "Paris Tennis Sneaker", price: 74.95, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
];

interface Product {
  name: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  alt?: string;
}

export default function ProductDetail({ product, source }: { product: Product | null; source: string }) {
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href={`/${source}/products`}>
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  // Placeholder for gallery thumbnails
  const gallery = [product.image, "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-lg shadow-lg">
      {/* Gallery */}
      <div className="flex flex-col items-center">
        <div className="aspect-4/3 w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4 relative">
          {product.image ? (
            <Image src={product.image} alt={product.alt ?? 'Product image'} className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {gallery.filter((img): img is string => !!img).map((img, i) => (
              <Image key={i} src={img} alt="thumb" className="w-12 h-12 rounded-md border-2 border-white object-cover shadow cursor-pointer" />
            ))}
            <span className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-200 text-gray-500 font-semibold text-xs">+7</span>
          </div>
        </div>
      </div>
      {/* Info Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-green-500 text-white">ECO</Badge>
          <Badge className="bg-orange-500 text-white">-42% OFF</Badge>
        </div>
        <h1 className="text-3xl font-extrabold mb-1">{product.name}</h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600 text-2xl font-bold">{product.price ? `\u00a3${Number(product.price).toFixed(2)}` : 'N/A'}</span>
          <span className="text-gray-400 line-through">{product.originalPrice ? `\u00a3${Number(product.originalPrice).toFixed(2)}` : ''}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {sizes.map((size) => (
            <button key={size} className="px-3 py-1 border rounded text-sm font-medium bg-white hover:bg-blue-50 focus:bg-blue-100 transition">
              {size}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <Button className="flex-1 rounded-full font-semibold shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition" disabled>Add to Bag</Button>
          <Button variant="ghost" className="flex-1 rounded-full font-semibold text-gray-700 border border-gray-200">Favorite</Button>
        </div>
        <Accordion
          items={[
            { title: "Description", content: product.description || "" },
            { title: "Materials", content: "Standard Fit\nPremium\nSynthetic upper\nRubber outsole" },
            { title: "Shipping and Returns", content: "Free shipping on orders over £50. 30-day return policy." },
            { title: "Reviews (45) 4.1★", content: "\n- 5★ 61%\n- 4★ 17%\n- 3★ 11%\n- 2★ 6%\n- 1★ 5%\nAwesome shoes! (sample review)" },
          ]}
          className="mt-4"
        />
        {/* Recommendations */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">You May Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <Card key={i} className="p-2">
                <div className="aspect-4/3 bg-gray-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                  <Image src={rec.image} alt={rec.name} className="object-cover w-full h-full" />
                </div>
                <div className="font-semibold text-sm mb-1">{rec.name}</div>
                <div className="text-blue-600 font-bold text-base">£{rec.price.toFixed(2)}</div>
              </Card>
            ))}
          </div>
        </div>
        <Link href={`/${source}/products`} className="mt-6 block">
          <Button variant="outline" className="w-full">Back to Products</Button>
        </Link>
      </div>
    </div>
  );
}
