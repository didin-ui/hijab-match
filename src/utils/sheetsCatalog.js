/**
 * Fetch & parse Google Sheets CSV into hijab catalog format.
 *
 * Expected sheet columns (row 1 = header):
 *   product_id | name | color_label | hex_color | shop_url | price | category | stock | image_url | tags
 *
 * Notes:
 *  - hex_color must be a valid 6-digit HEX, e.g. #B2C4B0
 *  - stock: TRUE / FALSE (case-insensitive)
 *  - price: number only, e.g. 89000
 *  - tags: separated by semicolons, e.g. soft;green;neutral
 */

/**
 * Minimal CSV parser — handles quoted fields (commas inside quotes).
 */
function parseCsvRow(row) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      // Escaped quote inside quoted field
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Convert a HEX color string to {r, g, b}.
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return { r: 128, g: 128, b: 128 };
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/**
 * Parse full CSV text into catalog array.
 * Skips rows with missing product_id or invalid hex_color.
 */
function parseCatalogCsv(csvText) {
  const lines = csvText
    .split('\n')
    .map((l) => l.replace(/\r$/, ''))
    .filter((l) => l.trim() !== '');

  if (lines.length < 2) return [];

  // Build column index map from header row
  const headers = parseCsvRow(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  const idx = (name) => headers.indexOf(name);

  const catalog = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvRow(lines[i]);
    const get = (name) => (cols[idx(name)] ?? '').trim();

    const product_id = get('product_id');
    const hex_color = get('hex_color').startsWith('#')
      ? get('hex_color')
      : '#' + get('hex_color');

    // Skip incomplete rows
    if (!product_id || !/^#[0-9A-Fa-f]{6}$/.test(hex_color)) continue;

    const price = parseInt(get('price').replace(/[^0-9]/g, ''), 10) || 0;
    const stock = !['false', '0', 'tidak', 'no'].includes(get('stock').toLowerCase());
    const tags = get('tags')
      ? get('tags').split(';').map((t) => t.trim()).filter(Boolean)
      : [];

    catalog.push({
      product_id,
      name: get('name') || product_id,
      color_label: get('color_label') || 'Custom',
      hex_color,
      rgb: hexToRgb(hex_color),
      shop_url: get('shop_url') || '#',
      image_url: get('image_url') || '',
      price,
      category: get('category') || 'Hijab',
      stock,
      tags,
    });
  }

  return catalog;
}

/**
 * Fetch catalog from Google Sheets published CSV URL.
 * Returns parsed catalog array, or throws on network/parse error.
 *
 * @param {string} csvUrl - Published Google Sheets CSV URL
 * @returns {Promise<Array>}
 */
export async function fetchSheetsCatalog(csvUrl) {
  const res = await fetch(csvUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Gagal fetch Google Sheets (HTTP ${res.status})`);
  const text = await res.text();
  const catalog = parseCatalogCsv(text);
  if (catalog.length === 0) throw new Error('Sheet kosong atau format kolom tidak sesuai.');
  return catalog;
}
