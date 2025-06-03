import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialstate = { isauth: false, user: null };
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isauth: true };
    case "logout":
      return { ...state, user: null, isauth: false };
    default:
      throw new Error(`your type is wrong`);
  }
}

const FAKE_USER = {
  name: "reza",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ isauth, user }, dispatch] = useReducer(reducer, initialstate);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isauth }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("you used AuthContext outside of AuthProvider");
  return context;
}

export { useAuth, AuthProvider };
