import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../Context/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { CurrentCity, DeleteCity } = useCities();
  const { emoji, cityName, date, id, position } = city;
  async function handledelete(e) {
    e.preventDefault();
    await DeleteCity(id);
  }
  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${
          id === CurrentCity.id ? styles[`cityItem--active`] : ""
        }`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handledelete}>
          x
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
