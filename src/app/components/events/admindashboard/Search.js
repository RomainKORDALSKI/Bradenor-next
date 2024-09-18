import { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className='search-container'>
      <input
        type="text"
        placeholder="Rechercher par ID, ville ou date"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;