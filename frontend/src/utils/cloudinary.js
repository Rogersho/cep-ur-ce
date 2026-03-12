/**
 * Injects Cloudinary optimization parameters into a URL.
 * Params:
 * - url: The original Cloudinary URL
 * - options: { width, height, quality, format, crop }
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const {
    width = 'auto',
    height = 'auto',
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Transformations string
  let transformations = `f_${format},q_${quality}`;
  if (width !== 'auto') transformations += `,w_${width}`;
  if (height !== 'auto') transformations += `,h_${height}`;
  if (crop && (width !== 'auto' || height !== 'auto')) transformations += `,c_${crop}`;

  // Insert before /v[timestamp] or /upload/
  // URL pattern: https://res.cloudinary.com/[cloud]/image/upload/v12345/public_id
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  return url;
};

export const getThumbnailUrl = (url) => optimizeCloudinaryUrl(url, { width: 400, height: 400, crop: 'fill' });
export const getPreviewUrl = (url) => optimizeCloudinaryUrl(url, { width: 800, height: 600, crop: 'limit' });
