import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import { useCities } from "../Context/CitiesContext.jsx";

function CityList() {
  const { Loading, Cities } = useCities();

  if (Loading) return <Spinner />;
  if (!Cities.length)
    return (
      <Message>Add your first city by clicking on a city on the map</Message>
    );
  return (
    <ul className={styles.cityList}>
      {Cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
