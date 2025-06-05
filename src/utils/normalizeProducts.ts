// Utility to normalize product image and alt fields for API responses
export type Product = {
  id?: string;
  sku?: string;
  name?: string;
  title?: string;
  price?: number | string;
  originalPrice?: number | string;
  priceRange?: {
    minVariantPrice?: { amount?: string | number };
    maxVariantPrice?: { amount?: string | number };
  };
  images?: { edges?: { node?: { url?: string; altText?: string } }[] };
  imageGroups?: { images?: { link?: string }[] }[];
  image?: string;
  description?: string;
  alt?: string;
  handle?: string;
  source?: string;
  [key: string]: unknown;
};

export type UnifiedProduct = {
  id: string;
  sku?: string;
  name: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  alt?: string;
  source?: string;
};

export function normalizeProducts(data: Product[] | { products: Product[] }) {
  let products = data.products || data;

  // Flatten nested product objects (e.g., { data: { product: {...} } })
  products = products.map((entry: Product | { data?: { product?: Product } }) =>
    (entry as { data?: { product?: Product } }).data && (entry as { data: { product: Product } }).data.product
      ? (entry as { data: { product: Product } }).data.product
      : entry
  );

  products = products.map((product: Product) => {
    let id = product.id;
    // Shopify: convert gid://shopify/Product/20 to "20"
    if (typeof id === 'string') {
      const match = id.match(/Product\/(\d+)/);
      if (match) id = match[1];
    }
    // Normalize image property for all sources
    const image =
      product.images?.edges?.[0]?.node?.url ||
      product.imageGroups?.[0]?.images?.[0]?.link ||
      product.image ||
      product.imageUrl ||
      null;

    return {
      ...product,
      id,
      image,
    };
  });

  return { products };
}
