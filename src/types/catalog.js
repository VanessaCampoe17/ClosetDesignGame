/**
 * Eras spaced ~20–30 years apart across major distinct historical silhouettes:
 * - 1890s: Victorian / Belle Époque / Late Qing Dynasty
 * - 1920s: Roaring Twenties Flapper / Art Deco / Taisho Roman
 * - 1950s: Mid-Century Post-War "New Look" / Rockabilly / Vintage Retro
 * - 1970s: Disco / Bohemian Hippie / Punk Counter-Culture
 * - 1990s: Grunge / Minimalist Streetwear / Early Harajuku
 * - 2010s: Modern Athleisure / Hipster Indie / Y2K-Post Streetwear
 *
 * @typedef {'1890s' | '1920s' | '1950s' | '1970s' | '1990s' | '2010s'} Era
 * @typedef {'North America' | 'Europe' | 'East Asia' | 'Global'} Region
 * @typedef {'tops' | 'bottoms' | 'dresses' | 'shoes' | 'accessories' | 'headwear'} GarmentCategory
 * @typedef {'feminine' | 'masculine' | 'neutral'} BodyFrame
 *
 * @typedef {Object} AnchorCoords
 * @property {number} x
 * @property {number} y
 *
 * @typedef {Object} GarmentItem
 * @property {string} id
 * @property {string} name
 * @property {Era} era
 * @property {Region} region
 * @property {GarmentCategory} category
 * @property {BodyFrame} targetFrame
 * @property {string} svgPath
 * @property {number} defaultZIndex
 * @property {AnchorCoords} anchorCoords
 *
 * @typedef {Object} CatalogSchema
 * @property {string} version
 * @property {GarmentItem[]} items
 */

export {};