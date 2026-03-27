/**
 * Client-side dominant color extraction using HTML5 Canvas.
 * No API key required — runs entirely in the browser.
 */

const BUCKET_SIZE = 24; // quantization bucket (smaller = more precise, slower)
const MIN_BRIGHTNESS = 25;  // skip near-black (shadows)
const MAX_BRIGHTNESS = 230; // skip near-white (background/overexposed)
const MIN_DIVERSITY_DIST = 55; // minimum Euclidean distance between selected colors

/**
 * Simple heuristic to name a color from its RGB values.
 */
function guessColorName(r, g, b) {
  const brightness = (r + g + b) / 3;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;

  if (saturation < 0.12) {
    if (brightness > 200) return 'Light Neutral';
    if (brightness > 120) return 'Gray';
    return 'Dark Neutral';
  }

  // Dominant channel heuristic
  if (r >= g && r >= b) {
    if (g > 140 && b < 100) return 'Yellow Warm';
    if (g < 100 && b < 100) return 'Deep Red';
    if (b > 120) return 'Mauve';
    return r > 200 ? 'Coral' : 'Dusty Rose';
  }
  if (g >= r && g >= b) {
    if (r > 150) return 'Olive';
    if (b > 150) return 'Teal';
    return g > 180 ? 'Mint' : 'Forest Green';
  }
  if (b >= r && b >= g) {
    if (r > 150) return 'Lavender';
    if (g > 150) return 'Sky Blue';
    return b > 180 ? 'Dusty Blue' : 'Navy';
  }

  return 'Neutral';
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0'))
    .join('');
}

function euclidean(c1, c2) {
  return Math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2);
}

/**
 * Load an image File/Blob into an HTMLImageElement.
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Gagal membaca gambar.')); };
    img.src = url;
  });
}

/**
 * Extract the top `numColors` dominant colors from an image File.
 *
 * @param {File} file - Image file (JPG/PNG/WEBP)
 * @param {number} numColors - How many dominant colors to return (default 3)
 * @returns {Promise<Array<{name:string, hex:string, rgb:{r,g,b}}>>}
 */
export async function extractDominantColors(file, numColors = 3) {
  const img = await loadImage(file);

  // Downscale to 100×100 for fast pixel sampling
  const SAMPLE_SIZE = 100;
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  // Quantize pixels into color buckets
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

    if (a < 128) continue; // skip transparent

    const brightness = (r + g + b) / 3;
    if (brightness < MIN_BRIGHTNESS || brightness > MAX_BRIGHTNESS) continue;

    // Quantize
    const qr = Math.round(r / BUCKET_SIZE) * BUCKET_SIZE;
    const qg = Math.round(g / BUCKET_SIZE) * BUCKET_SIZE;
    const qb = Math.round(b / BUCKET_SIZE) * BUCKET_SIZE;
    const key = `${qr},${qg},${qb}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  if (buckets.size === 0) {
    // All pixels were filtered out (e.g., very bright/dark image) — return gray fallback
    return [{ name: 'Neutral', hex: '#888888', rgb: { r: 136, g: 136, b: 136 } }];
  }

  // Sort by frequency descending
  const sorted = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.split(',').map(Number));

  // Pick diverse colors
  const selected = [];
  for (const [r, g, b] of sorted) {
    const tooClose = selected.some((s) => euclidean([r, g, b], s) < MIN_DIVERSITY_DIST);
    if (!tooClose) selected.push([r, g, b]);
    if (selected.length >= numColors) break;
  }

  return selected.map(([r, g, b]) => ({
    name: guessColorName(r, g, b),
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
  }));
}
