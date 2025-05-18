// Open Meteo Marine Weather API service
// Based on https://marine-api.open-meteo.com/

export interface MarineWeather {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    wave_height: string;
    sea_surface_temperature: string;
  };
  current: {
    time: string;
    interval: number;
    wave_height: number;
    sea_surface_temperature: number;
  };
}

export async function getMarineWeather(
  latitude: number,
  longitude: number
): Promise<MarineWeather | null> {
  try {
    const response = await fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&current=wave_height,sea_surface_temperature`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as MarineWeather;
  } catch (error) {
    console.error("Failed to fetch marine weather:", error);
    return null;
  }
}
