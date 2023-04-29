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
  const [zipcode, setZipcode] = useState("");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/watchlist" element={<LoginContext.Provider value={
            {username, password, age, gender, occupation}
            }><AnimeWatchlistPage/></LoginContext.Provider>}/>
          <Route path="/rankings" element={<AnimeRankingsPage />} />
          <Route path="/login" element={<LoginContext.Provider value={
            {username, setUsername, password, setPassword, setAge, setGender, setOccupation}
            }><Login/></LoginContext.Provider>}/>
          <Route path="/profile" element={<LoginContext.Provider value={
            {username, setUsername, password, setPassword, age, setAge, gender, setGender, occupation, setOccupation}
            }><ProfilePage/></LoginContext.Provider>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}