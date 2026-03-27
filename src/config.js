/**
 * Central app config — reads from Vite env vars.
 * Set VITE_SHEETS_CSV_URL in frontend/.env to enable Google Sheets catalog.
 */
const config = {
  sheetsCsvUrl: import.meta.env.VITE_SHEETS_CSV_URL || '',
};

export default config;
