import MapComponent from "./components/map/map";
import { MapProvider } from "./providers/map-provider";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-blue-100">
      <MapProvider>
        <MapComponent />
      </MapProvider>
    </main>
  );
}
