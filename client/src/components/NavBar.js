import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

export default function NavBar() {
  return (
    <AppBar position='static' className='mb-4'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='AnimeRec' isMain />
          <NavText href='/movies' text='movies' />
          <NavText href='/watchlist' text='watchlist' />
          <NavText href='/rankings' text='rankings' />
          <NavText href='/profile' text='profile' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}