// Takes raw CSV text and returns an array of objects
export function sheetParser(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));

  const restaurants = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const obj = {};
    headers.forEach((key, index) => {
      obj[key] = values[index] ? values[index].trim() : "";
    });
    obj.latitude = parseFloat(obj.latitude) || 0;
    obj.longitude = parseFloat(obj.longitude) || 0;
    obj.id = i;
    restaurants.push(obj);
  }

  return restaurants;
}