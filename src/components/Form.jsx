// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import Button from "./Button";
import styles from "./Form.module.css";
import BackBtn from "./BackButton";
import { useUrlPosition } from "../hooks/UseUrlPpsition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../Context/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat, lng } = useUrlPosition();
  const [isloading, setloaing] = useState(false);
  const [errorLocation, seterrorLocation] = useState("");
  const [country, setcountry] = useState();
  const [emoji, setemoji] = useState("");
  const { CreateCity, Loading } = useCities();
  const navigate = useNavigate();

  async function HandleAddNewCity(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const NewItem = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await CreateCity(NewItem);
    navigate(`/app/cities`);
  }

  useEffect(
    function () {
      if (!lat || !lng) return;
      async function GetLocData() {
        try {
          seterrorLocation("");
          setloaing(true);
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          console.log(res);
          const data = await res.json();
          if (!data.countryCode) {
            throw new Error("No city found. Please click another location");
          }
          console.log(data);
          setCityName(data.city || data.locality || "");
          setcountry(data.countryName);
          setemoji(convertToEmoji(data.countryCode));
        } catch (err) {
          seterrorLocation(err.message);
        } finally {
          setloaing(false);
        }
      }
      GetLocData();
    },
    [lat, lng]
  );
  if (isloading) return <Spinner />;
  if (errorLocation) return <Message>{errorLocation}</Message>;
  if (!lat || !lng) return <Message>{`Please click on location`}</Message>;

  return (
    <form
      className={`${styles.form} ${Loading ? styles.loading : styles.form}`}
      onSubmit={HandleAddNewCity}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat={"dd/mm/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackBtn />
      </div>
    </form>
  );
}

export default Form;
