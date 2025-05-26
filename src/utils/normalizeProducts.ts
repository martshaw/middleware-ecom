// Utility to normalize product image and alt fields for API responses
export type Product = {
  images?: { edges?: { node?: { url?: string } }[] };
  imageGroups?: { images?: { link?: string }[] }[];
  image?: string;
  name?: string;
  title?: string;
  [key: string]: any;
};

export function normalizeProducts(data: any): any {
  const normalize = (p: Product) => ({
    ...p,
    image:
      (p.images && Array.isArray(p.images.edges) && p.images.edges.length > 0 && p.images.edges[0]?.node?.url)
        ? p.images.edges[0].node.url
      : (p.imageGroups && Array.isArray(p.imageGroups) && p.imageGroups.length > 0 && p.imageGroups[0].images && Array.isArray(p.imageGroups[0].images) && p.imageGroups[0].images.length > 0 && p.imageGroups[0].images[0]?.link)
        ? p.imageGroups[0].images[0].link
      : p.image || null,
    alt: p.name || p.title || 'Product image',
  });
  if (Array.isArray(data.products)) {
    return { ...data, products: data.products.map(normalize) };
  } else if (Array.isArray(data)) {
    return data.map(normalize);
  }
  return data;
}
