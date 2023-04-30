import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { useRef, useState, useEffect, useContext} from 'react';
import {LoginContext} from "../contexts/LoginContext";

const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'sans-serif',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'pink',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}


export default function NavBar() {
  const {login} = useContext(LoginContext);

  return (
    <AppBar position='static' className='mb-4'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters variant='regular'>
          {!login && <NavText text='AniMate' isMain />}
          {!login && <NavText href='/login' text='Log into your account bro'/>}
          {login && <NavText href='/' text='AniMate' isMain />}
          {login && <NavText href='/movies' text='movies' />}
          {login && <NavText href='/watchlist' text='watchlist' />}
          {login && <NavText href='/rankings' text='rankings' /> }
          {login && <NavText href='/profile' text='profile'/>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}