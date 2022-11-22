import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import css from './Searchbar.module.css';
import { useState } from 'react'

function Searchbar({ onSubmit }) {
  const [queryParams, setQueryParams] = useState('');
  
  const onChangeInput = e => {
    setQueryParams(e.currentTarget.value);
  };

  const onSubmitForm = e => {
    e.preventDefault();
    if (queryParams.trim() === '') {
      return toast.error('Enter a search term.');
    }
    onSubmit(queryParams);
    setQueryParams('');
  };

  return (
    <header className={css.header}>
      <form className={css.form} onSubmit={onSubmitForm}>
        <button className={css.button} type="submit">
          <FaSearch size={12} />
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={queryParams}
          onChange={onChangeInput}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default Searchbar;
