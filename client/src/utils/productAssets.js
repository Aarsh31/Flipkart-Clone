const assetModules = import.meta.glob('../assets/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const folderAliasBySlug = {
  'realme-narzo-budget-smartphone': 'narzo',
  'nothing-phone-2a': 'nothing phone',
  'women-festive-saree': 'women festive sare',
  'hp-victus-gaming-laptop': 'hp victus gaming laptop',
};

const sortByFilename = (left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });

const assetsByFolder = Object.entries(assetModules).reduce((accumulator, [filePath, assetUrl]) => {
  const segments = filePath.split('/');
  const folderName = segments[segments.length - 2];
  const key = normalize(folderName);

  if (!accumulator[key]) {
    accumulator[key] = [];
  }

  accumulator[key].push({
    id: `${key}-${accumulator[key].length + 1}`,
    url: assetUrl,
    alt: folderName,
  });

  return accumulator;
}, {});

Object.values(assetsByFolder).forEach((images) => images.sort((left, right) => sortByFilename(left.url, right.url)));

const getLocalImages = (product) => {
  const keys = [
    product.slug ? normalize(folderAliasBySlug[product.slug] || product.slug) : '',
    product.name ? normalize(product.name) : '',
    product.productName ? normalize(product.productName) : '',
  ].filter(Boolean);

  for (const key of keys) {
    if (assetsByFolder[key]?.length) {
      return assetsByFolder[key];
    }
  }

  return null;
};

export const localizeProduct = (product) => {
  const localImages = getLocalImages(product);

  if (!localImages) {
    return product;
  }

  return {
    ...product,
    thumbnail: localImages[0].url,
    images: localImages,
  };
};

export const localizeCart = (cart) => ({
  ...cart,
  items: cart.items.map((item) => ({
    ...item,
    product: localizeProduct(item.product),
  })),
});

export const localizeOrder = (order) => ({
  ...order,
  items: order.items.map((item) => {
    const localized = localizeProduct(item);
    return {
      ...item,
      image: localized.thumbnail || item.image,
    };
  }),
});
