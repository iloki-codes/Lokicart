import React from 'react';
import { MdErrorOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import TicTacToe from '../components/error-page-game';

const NotFound = () => {
  return (
    <div className='notFound'>
      
      <MdErrorOutline />
      <h1>Uh-Oh! Unable to find the page.</h1>
      <p>Having trouble to load your content ? <Link to="/" style={{color:"blue"}}>Go to Home</Link></p>
      <span>or let's play a quick game !</span>
      <TicTacToe />
      
    </div>
  )
};

export default NotFound;