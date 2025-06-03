import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [Searchparms, setsearchparms] = useSearchParams();
  const lat = Searchparms.get("lat");
  const lng = Searchparms.get("lng");
  return { lat, lng };
}
