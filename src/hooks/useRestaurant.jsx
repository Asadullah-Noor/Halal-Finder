import { useState, useEffect } from "react";
import { sheetParser } from "../utils/sheetParser";

// Published CSV URL from the Google Sheet
const CSV_URL = import.meta.env.VITE_CSV_URL;
export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const data = sheetParser(text);
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load restaurants.");
        setLoading(false);
      });
  }, []);

  return { restaurants, loading, error };
}