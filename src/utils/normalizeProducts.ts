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

export function normalizeProducts(data: unknown): unknown {
  function normalize(p: Product): UnifiedProduct {
    // Identify source
    let source: string = 'unknown';
    if (p.priceRange || p.title || (p.images && Array.isArray(p.images.edges))) {
      source = 'shopify';
    } else if (p.name && p.sku) {
      source = 'salesforce';
    }

    // Unify price fields
    let price: number | undefined = undefined;
    let originalPrice: number | undefined = undefined;
    if (source === 'shopify') {
      price = Number(p.priceRange?.minVariantPrice?.amount ?? p.priceRange?.maxVariantPrice?.amount ?? p.price ?? 0) || undefined;
      // If you have compareAtPrice, set originalPrice; else use price
      originalPrice = price;
    } else {
      price = typeof p.price === 'string' ? Number(p.price) : p.price;
      originalPrice = typeof p.originalPrice === 'string' ? Number(p.originalPrice) : p.originalPrice;
    }

    // Unify image
    const image =
      (p.images && Array.isArray(p.images.edges) && p.images.edges.length > 0 && p.images.edges[0]?.node?.url)
        ? p.images.edges[0].node.url
      : (p.imageGroups && Array.isArray(p.imageGroups) && p.imageGroups.length > 0 && p.imageGroups[0].images && Array.isArray(p.imageGroups[0].images) && p.imageGroups[0].images.length > 0 && p.imageGroups[0].images[0]?.link)
        ? p.imageGroups[0].images[0].link
      : typeof p.image === 'string' ? p.image : undefined;

    // Unify alt
    const alt =
      (p.images && Array.isArray(p.images.edges) && p.images.edges.length > 0 && p.images.edges[0]?.node?.altText)
        ? p.images.edges[0].node.altText
      : p.name || p.title || 'Product image';

    // Normalize Shopify GID format (gid://shopify/Product/20) to just the numeric ID
    let normalizedId = String(p.id ?? '');
    if (source === 'shopify' && normalizedId.startsWith('gid://')) {
      const match = normalizedId.match(/\/(\d+)$/);
      if (match) {
        normalizedId = match[1];
      }
    }

    return {
      id: normalizedId,
      sku: p.sku ?? (source === 'shopify' ? p.handle : undefined),
      name: p.name ?? p.title ?? '',
      price,
      originalPrice,
      image,
      description: typeof p.description === 'string' ? p.description : undefined,
      alt,
      source,
    };
  }
  if (
    typeof data === 'object' &&
    data !== null &&
    'products' in data &&
    Array.isArray((data as { products: unknown }).products)
  ) {
    return { ...data, products: ((data as { products: unknown }).products as Product[]).map(normalize) };
  } else if (Array.isArray(data)) {
    return (data as Product[]).map(normalize);
  }
  return data;
}
