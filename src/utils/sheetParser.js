// ─────────────────────────────────────────────────────────────────────────────
// sheetParser.js
//
// Your Google Sheet columns are:
//   name | address | city | lat | lng | cuisine | halal_status | phone | website | hours
//
// THE BIG FIX: your sheet uses "lat" and "lng" — NOT "latitude" / "longitude"
// Also addresses contain commas, so we use a proper CSV parser (not .split(","))
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses one CSV line correctly — handles commas inside quoted fields.
 *
 * Example:
 *   'Qazan,"Itäkatu 1-7, 00930 Helsinki",Helsinki,60.21,25.08,Syrian'
 *   → ["Qazan", "Itäkatu 1-7, 00930 Helsinki", "Helsinki", "60.21", "25.08", "Syrian"]
 */
function parseCsvLine(line) {
  const result = [];
  let current      = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;           // toggle quoted mode on/off
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());            // comma outside quotes = new field
      current = "";
    } else {
      current += char;                        // normal character, keep building
    }
  }

  result.push(current.trim());               // push the last field
  return result;
}

/**
 * sheetParser
 * Converts raw CSV text → array of restaurant objects.
 */
export function sheetParser(csvText) {
  const lines = csvText.trim().split("\n");

  // Row 0 = headers: name, address, city, lat, lng, cuisine, halal_status, phone, website, hours
  const headers = parseCsvLine(lines[0]).map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, "_")
  );

  const restaurants = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;           // skip blank lines

    const values = parseCsvLine(lines[i]);

    // Build an object pairing each header with its value
    const obj = {};
    headers.forEach((key, index) => {
      obj[key] = values[index] ? values[index].trim() : "";
    });

    // ── KEY FIX ──────────────────────────────────────────────────────────────
    // Your sheet columns are called "lat" and "lng"
    // Leaflet needs numbers, so we parse them and store as latitude/longitude
    obj.latitude  = parseFloat(obj.lat) || 0;
    obj.longitude = parseFloat(obj.lng) || 0;

    // Unique id for React list keys
    obj.id = i;

    // Only keep rows that have a name and valid map coordinates
    if (obj.name && obj.latitude && obj.longitude) {
      restaurants.push(obj);
    }
  }

  return restaurants;
}