import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import { useCities } from "../Context/CitiesContext.jsx";

function CountryList() {
  const { Loading, Cities } = useCities();
  if (Loading) return <Spinner />;
  if (!Cities.length)
    return (
      <Message>Add your first city by clicking on a city on the map</Message>
    );
  const country = Cities.reduce(
    (Arr, cur) =>
      !Arr.map((el) => el.country).includes(cur.country)
        ? [...Arr, { country: cur.country, emoji: cur.emoji }]
        : Arr,
    []
  );
  console.log(country);
  return (
    <ul className={styles.countryList}>
      {country.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
