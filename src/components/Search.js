import React from 'react'
import { FiSearch } from 'react-icons/fi';
import { BiDotsVerticalRounded } from 'react-icons/bi';

const Search = () => {
  return (
    <div className='search'>
        <input placeholder='Search'/>
        <div className='searchicon'>
            <FiSearch/>
        </div>
        <div className='dotsicon'>
            <BiDotsVerticalRounded/>
        </div>
    </div>
  )
}

export default Search