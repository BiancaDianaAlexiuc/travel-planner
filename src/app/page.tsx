
import MapComponent from "./components/map/map";
import { MapProvider } from "./providers/map-provider";

export default function Home() {
  return (
    //  GOOGLE MAPS API KEY - AIzaSyAxy1JE6ItXAlrhGfrL_P6IDPzf5_9zIew
   
    <MapProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MapComponent/>
    </main>
      </MapProvider>
  

  );
}
