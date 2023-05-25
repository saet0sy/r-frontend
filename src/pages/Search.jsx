import Navbar from "../components/Navbar";
import React, { useState } from 'react';


const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);



  return (
    <div>
      <Navbar />
      <h1>Search</h1>
      <input type="text" placeholder="Search.."></input>
    </div>
  );
};



export default Search;
