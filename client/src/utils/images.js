export const handleImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = '/product-placeholder.svg';
};
