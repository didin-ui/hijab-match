/**
 * Client-side color matching — mirrors the backend logic.
 * Uses Euclidean RGB distance (Phase 1 MVP).
 */

function euclideanDistance(c1, c2) {
  return Math.sqrt(
    (c1.r - c2.r) ** 2 +
    (c1.g - c2.g) ** 2 +
    (c1.b - c2.b) ** 2
  );
}

function complementaryBonus(outfitRgb, hijabRgb) {
  const hueDiff = Math.abs(
    (outfitRgb.r + outfitRgb.b) / 2 - hijabRgb.g
  );
  return Math.min(hueDiff / 4, 60);
}

/**
 * Find top N hijabs matching the given outfit colors.
 *
 * @param {Array<{r,g,b}>} outfitColors
 * @param {Array} catalog
 * @param {number} topN
 * @returns {Array}
 */
export function findMatchingHijabs(outfitColors, catalog, topN = 4) {
  const scored = catalog
    .filter((item) => item.stock)
    .map((hijab) => {
      const minDist = Math.min(
        ...outfitColors.map((oc) => euclideanDistance(oc, hijab.rgb))
      );
      const compBonus = complementaryBonus(outfitColors[0], hijab.rgb);
      const blendedScore = minDist * 0.7 - compBonus * 0.3;
      return { ...hijab, match_score: Math.round(blendedScore * 10) / 10 };
    });

  scored.sort((a, b) => a.match_score - b.match_score);

  // Diversity: max 2 per color_label
  const labelCount = {};
  const diverse = [];
  for (const item of scored) {
    const count = labelCount[item.color_label] || 0;
    if (count < 2) {
      diverse.push(item);
      labelCount[item.color_label] = count + 1;
    }
    if (diverse.length >= topN) break;
  }

  // Pad if needed
  if (diverse.length < topN) {
    for (const item of scored) {
      if (!diverse.find((d) => d.product_id === item.product_id)) {
        diverse.push(item);
      }
      if (diverse.length >= topN) break;
    }
  }

  return diverse.slice(0, topN);
}

/**
 * Parse HEX string to {r,g,b}.
 */
export function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16),
  };
}
