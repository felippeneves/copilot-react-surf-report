"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { searchLocations, Location } from "@/lib/location-service";
import { MarineWeatherDisplay } from "@/components/marine-weather-display";
import { getMarineWeather } from "@/lib/marine-weather-service";

export function LocationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Marine weather state
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [waveHeight, setWaveHeight] = useState<number | undefined>(undefined);
  const [seaTemperature, setSeaTemperature] = useState<number | undefined>(undefined);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | undefined>(undefined);

  // Handle clicks outside of the search results
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  async function handleSearch(value: string) {
    setQuery(value);
    setIsOpen(true);
    
    if (value.length >= 2) {
      setIsLoading(true);
      const results = await searchLocations(value);
      setLocations(results);
      setIsLoading(false);
    } else {
      setLocations([]);
    }
  }
  async function handleSelectLocation(location: Location) {
    setIsOpen(false);
    setSelectedLocation(location);
    setIsLoadingWeather(true);
    setWeatherError(undefined);
    setWaveHeight(undefined); // Reset previous values
    setSeaTemperature(undefined); // Reset previous values
    
    try {
      const weatherData = await getMarineWeather(location.latitude, location.longitude);
      if (weatherData) {
        // Check if the data actually contains the values we need
        // Some inland locations or locations with limited data may return null or undefined
        const hasWaveHeight = typeof weatherData.current.wave_height === 'number';
        const hasSeaTemperature = typeof weatherData.current.sea_surface_temperature === 'number';
        
        // Only set the values if they exist in the response
        if (hasWaveHeight) setWaveHeight(weatherData.current.wave_height);
        if (hasSeaTemperature) setSeaTemperature(weatherData.current.sea_surface_temperature);
        
        // No error message if we have data, even if some fields are missing
      } else {
        setWeatherError("Unable to fetch marine weather data");
      }
    } catch (error) {
      console.error("Error fetching marine weather:", error);
      setWeatherError("Failed to load marine weather data");
    } finally {
      setIsLoadingWeather(false);
    }
  }
  return (
    <div className="flex flex-col w-full" ref={searchRef}>
      <div className="relative w-full max-w-lg mx-auto">
        <Input
          type="text"
          placeholder="Search for cities, beaches or surf spots..."
          className="w-full"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          {isOpen && (
          <Card className="mt-1 w-full z-10 absolute top-full left-0 right-0 border-secondary">
            <CardContent className="p-2">
              {isLoading ? (
                <div className="space-y-2 py-2">
                  <Skeleton className="h-5 w-full bg-secondary/70" />
                  <Skeleton className="h-5 w-3/4 bg-secondary/70" />
                  <Skeleton className="h-5 w-4/5 bg-secondary/70" /> 
                </div>
              ) : locations.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">
                  {query.length < 2 ? "Type to search locations" : "No locations found"}
                </p>
              ) : (
                <div className="space-y-1">
                  {locations.map((location) => (
                    <div 
                      key={location.id} 
                      className="flex items-center p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{location.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {location.admin1 ? `${location.admin1}, ` : ""}{location.country}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="w-full max-w-lg mx-auto">
        <MarineWeatherDisplay 
          isLoading={isLoadingWeather}
          locationName={selectedLocation?.name}
          waveHeight={waveHeight}
          seaTemperature={seaTemperature}
          error={weatherError}
        />
      </div>
    </div>
  );
}
