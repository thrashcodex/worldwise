import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialstate = { Cities: [], Loading: false, CurrentCity: {}, error: "" };
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, Loading: true };
    case "cities/loaded":
      return { ...state, Cities: action.payload, Loading: false };
    case "city/loaded":
      return { ...state, CurrentCity: action.payload, Loading: false };
    case "city/create":
      return {
        ...state,
        Cities: [...state.Cities, action.payload],
        Loading: false,
        CurrentCity: action.payload,
      };
    case "city/delete":
      return {
        ...state,
        Cities: state.Cities.filter((city) => city.id !== action.payload),
        Loading: false,
        CurrentCity:
          state.CurrentCity.id === action.payload ? {} : state.CurrentCity,
      };

    case "rejected":
      return { ...state, error: action.payload, Loading: false };

    default:
      throw new Error(`your type is wrong`);
  }
}

function CitiesProvider({ children }) {
  const [{ Cities, Loading, CurrentCity, error }, dispatch] = useReducer(
    reducer,
    initialstate
  );
  async function GetCity(id) {
    console.log(CurrentCity.id, id);
    if (CurrentCity?.id && Number(id) === Number(CurrentCity.id)) return;

    try {
      console.log(324324);
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:9000/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error for loading data",
      });
    }
  }

  async function CreateCity(newcity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:9000/cities`, {
        method: "POST",
        body: JSON.stringify(newcity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      dispatch({ type: "city/create", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "there was an error for create city",
      });
    }
  }

  async function DeleteCity(id) {
    console.log("Deleting city with id:", id);
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`http://localhost:9000/cities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      dispatch({ type: "city/delete", payload: id });
    } catch (error) {
      console.error("DeleteCity error:", error.message);
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city",
      });
    }
  }

  useEffect(function () {
    async function Getcities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`http://localhost:9000/cities`);
        const data = await res.json();

        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "there was an error for loading data",
        });
      }
    }
    Getcities();
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        Cities,
        Loading,
        CurrentCity,
        GetCity,
        CreateCity,
        DeleteCity,
        error,
      }}
    >
      {" "}
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const Context = useContext(CitiesContext);
  if (Context === undefined)
    throw new Error("you try give context in wrong place");
  return Context;
}

export { useCities, CitiesProvider };
