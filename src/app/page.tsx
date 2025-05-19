import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="bg-linear-to-br from-blue-50 to-green-50 min-h-[80vh] flex flex-col items-center justify-center py-24 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">Discover Modern E-commerce</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">Seamlessly browse and compare products from Salesforce and Shopify in a beautiful, unified storefront experience.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products/salesforce">
            <Button className="rounded-full px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg">Browse Salesforce</Button>
          </Link>
          <Link href="/products/shopify">
            <Button className="rounded-full px-8 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg">Browse Shopify</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

