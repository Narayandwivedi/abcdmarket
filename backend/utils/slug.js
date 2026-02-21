const escapeRegex = (value = '') =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toSlug = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const generateUniqueSlug = async ({
  Model,
  source,
  excludeId,
  baseSlug,
  extraFilter = {}
}) => {
  const normalizedBase = toSlug(baseSlug || source);
  if (!normalizedBase) return '';

  let slug = normalizedBase;
  let attempt = 1;

  // Try base slug first, then suffix with -2, -3 ...
  while (true) {
    const query = {
      ...extraFilter,
      slug
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const exists = await Model.exists(query);
    if (!exists) return slug;

    attempt += 1;
    slug = `${normalizedBase}-${attempt}`;
  }
};

module.exports = {
  escapeRegex,
  toSlug,
  generateUniqueSlug
};
