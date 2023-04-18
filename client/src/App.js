import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import 'bootstrap/dist/css/bootstrap.css';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import AnimeWatchlistPage from "./pages/AnimeWatchlistPage";
import AnimeRankingsPage from "./pages/AnimeRankingsPage";

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/watchlist" element={<AnimeWatchlistPage />} />
          <Route path="/rankings" element={<AnimeRankingsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}