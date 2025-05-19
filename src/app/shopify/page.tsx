import ProductList from '../ui/ProductList';

export default async function ShopifyPage() {
  const res = await fetch('http://localhost:3000/api/shopify', { cache: 'no-store' });
  const data = await res.json();
  return <ProductList title="Shopify Products" data={data} source="shopify" />;
}
