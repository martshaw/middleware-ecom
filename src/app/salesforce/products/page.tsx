import ProductList from '../../ui/ProductList';

export default async function SalesforceProductsPage() {
  const res = await fetch('http://localhost:3000/api/salesforce', { cache: 'no-store' });
  const data = await res.json();
  return <ProductList title="Salesforce Products" data={data.products || []} source="salesforce" />;
}
