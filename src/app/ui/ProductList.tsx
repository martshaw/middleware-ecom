import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const categories = [
  "Low Sneakers Women",
  "Low Sneakers Men",
  "Casual footwear",
  "Golf shoes",
  "Sports shoes",
];

const colorVariants = ["#F5E9DD", "#E9E1F5", "#DDF5F2", "#F5F2DD"];

interface ProductListProps {
  title: string;
  data: Array<{
    id: string;
    sku?: string;
    name: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    description?: string;
    alt?: string;
  }>;
  source?: string;
}

export default function ProductList({ data, source }: ProductListProps) {
  // Guess source if not provided
  const getSource = () => source || (data && data[0]?.id?.startsWith('prod') ? 'salesforce' : 'shopify');
  return (
    <div className="max-w-[1440px] mx-auto px-2 md:px-8 py-6 min-h-[80vh] flex flex-col md:flex-row gap-10">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 pt-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-bold mb-4">Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat} className="flex items-center gap-3 cursor-pointer hover:text-blue-700">
                <Image height="200" width="200" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" alt={cat} className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-base">{cat} <span className="text-gray-400">(43)</span></span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-2">
          Women {'>'} Shoes <span className="text-gray-900 font-semibold ml-2">Sneakers</span> <span className="ml-1">({data.length})</span>
        </div>
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden h-40 md:h-56 mb-8 flex items-center">
          <Image width="800" src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" alt="Sneakers Banner" className="absolute inset-0 w-full h-full object-cover" height="100" />
          <div className="relative z-10 p-6 md:p-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">SNEAKER HOT DROPS</h2>
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex gap-4">
            <select className="border rounded px-3 py-1 text-sm bg-white">
              <option>Size</option>
            </select>
            <select className="border rounded px-3 py-1 text-sm bg-white">
              <option>Brand</option>
            </select>
            <select className="border rounded px-3 py-1 text-sm bg-white">
              <option>Colour</option>
            </select>
            <select className="border rounded px-3 py-1 text-sm bg-white">
              <option>Price</option>
            </select>
            <button className="text-sm text-blue-700 font-medium ml-2">More Filters</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Display</span>
            <span className="inline-block w-6 h-6 bg-gray-200 rounded" />
            <select className="border rounded px-3 py-1 text-sm bg-white">
              <option>Sort by: Most Relevant</option>
            </select>
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.map((p) => {
            const img = p.image;
            // For Shopify, extract the numeric ID from gid://shopify/Product/20
            const getShopifyId = (id: string) => {
              const match = id.match(/Product\/(\d+)/);
              return match ? match[1] : id;
            };
            const detailHref =
              getSource() === "shopify"
                ? `/products/shopify/${getShopifyId(p.id)}`
                : `/products/${getSource()}/${p.sku || p.id}`;
            return (
              <Link href={detailHref} key={p.id} className="group">
                <Card className="flex flex-col h-full transition-all shadow hover:shadow-xl hover:scale-[1.025] bg-white border-0 group-hover:ring-2 group-hover:ring-blue-500">
                  <CardHeader className="p-0 relative">
                    <div className="aspect-4/3 w-full bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center">
                      {img ? (
                        <Image  height="100" width="100" src={img} alt={p.alt ?? 'Product image'} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge color="green">ECO</Badge>
                        <Badge color="orange">-42% OFF</Badge>
                      </div>
                      <button className="absolute top-2 right-2 bg-white rounded-full shadow p-1 group-hover:bg-blue-50 transition">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 group-hover:text-red-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 19.071A7 7 0 0112 21a7 7 0 016.879-1.929M12 3v12m0 0l-3-3m3 3l3-3" /></svg>
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between p-4">
                    <div>
                      <CardTitle className="text-lg font-semibold mb-2 line-clamp-1">{p.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600 text-xl font-bold">{p.price ? `\u00a3${Number(p.price).toFixed(2)}` : 'N/A'}</span>
                        <span className="text-gray-400 line-through">{p.originalPrice ? `\u00a3${Number(p.originalPrice).toFixed(2)}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {colorVariants.map((c, i) => (
                          <span key={i} className="w-4 h-4 rounded-full border-2 border-white" style={{ background: c }} />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">+5 MORE</span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{p.description}</p>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        {'★'.repeat(4)}{'☆'}
                        <span className="ml-2 text-gray-500">(45)</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                    <Button variant="outline" className="w-full rounded-full font-semibold shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition" disabled>
                      Add to Bag
                    </Button>
                    <Button variant="ghost" className="w-full rounded-full font-semibold text-gray-700 border border-gray-200">
                      Favorite
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
