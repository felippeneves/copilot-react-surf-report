import { LocationSearch } from "@/components/location-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-secondary/50">
      <main className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-center">
        <Card className="w-full border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-300 to-primary bg-clip-text text-transparent">
              Surf Report
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Search for a location to get the latest surf and weather
              conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <LocationSearch />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground/80">
          <p>Powered by Felippe Neve • Uses the Open-Meteo API</p>
        </div>
      </main>
    </div>
  );
}
