import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import AnimeWatchlistPage from "./pages/AnimeWatchlistPage";
import AnimeRankingsPage from "./pages/AnimeRankingsPage";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import {Navigate} from 'react-router-dom';
import {LoginContext} from './contexts/LoginContext';

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [login, setLogin] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <LoginContext.Provider value={{login,setLogin}}><NavBar/></LoginContext.Provider>
        <Routes>
          <Route path="/" element={<LoginContext.Provider value={
            {username, setUsername, password, setPassword, setAge, setGender, setOccupation}
            }><HomePage/></LoginContext.Provider>} />
          <Route path="/movies" element={<LoginContext.Provider value={
            {username, password, age, gender, occupation}
            }><MoviePage/></LoginContext.Provider>} />
          <Route path="/watchlist" element={<LoginContext.Provider value={
            {username, password, age, gender, occupation}
            }><AnimeWatchlistPage/></LoginContext.Provider>}/>
          <Route path="/rankings" element={<AnimeRankingsPage />} />
          <Route path="/login" element={<LoginContext.Provider value={
            {username, setUsername, password, setPassword, setAge, setGender, setOccupation, login, setLogin}
            }><Login/></LoginContext.Provider>}/>
          <Route path="/profile" element={<LoginContext.Provider value={
            {username, setUsername, password, setPassword, age, setAge, gender, setGender, occupation, setOccupation, login, setLogin}
            }><ProfilePage/></LoginContext.Provider>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}