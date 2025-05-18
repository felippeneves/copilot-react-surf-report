"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WavesIcon } from "lucide-react";
import { ThermometerIcon } from "lucide-react";

interface MarineWeatherDisplayProps {
  isLoading: boolean;
  locationName?: string;
  waveHeight?: number;
  seaTemperature?: number;
  error?: string;
}

export function MarineWeatherDisplay({
  isLoading,
  locationName,
  waveHeight,
  seaTemperature,
  error
}: MarineWeatherDisplayProps) {
  if (isLoading) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Marine Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }
  if (!locationName) {
    return null;
  }
  
  // Check if we have no data available
  const noWaveHeightData = waveHeight === undefined || waveHeight === null;
  const noTemperatureData = seaTemperature === undefined || seaTemperature === null;
  const noDataAvailable = noWaveHeightData && noTemperatureData;
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Marine Weather for {locationName}</CardTitle>
      </CardHeader>
      <CardContent>        {noDataAvailable ? (
          <div className="p-4 bg-secondary/50 rounded-lg text-center">
            <p className="text-muted-foreground">
              No marine weather data available for this location.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This may be because the location is inland or no current data exists for this area.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 rounded-lg bg-blue-950/40 border border-blue-800/30">
              <div className="bg-blue-900/60 p-2 rounded-full mr-3">
                <WavesIcon className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wave Height</p>
                {noWaveHeightData ? (
                  <p className="text-md font-medium text-muted-foreground">Not available</p>
                ) : (
                  <p className="text-xl font-semibold text-blue-300">{waveHeight} m</p>
                )}
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-orange-950/40 border border-orange-800/30">
              <div className="bg-orange-900/60 p-2 rounded-full mr-3">
                <ThermometerIcon className="h-6 w-6 text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sea Temperature</p>
                {noTemperatureData ? (
                  <p className="text-md font-medium text-muted-foreground">Not available</p>
                ) : (
                  <p className="text-xl font-semibold text-orange-300">{seaTemperature}°C</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
