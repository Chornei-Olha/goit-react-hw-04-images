import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import css from './Searchbar.module.css';

function Searchbar ({onSubmit, queryParams, setQueryParams}) {

  const onChangeInput = e => {
    setQueryParams({...queryParams, query: e.currentTarget.value});
  };

  const onSubmitForm = e => {
    e.preventDefault();
    if (queryParams.query.trim() === '') {
      toast.error('Enter a search term.');
      return;
    }
    onSubmit(queryParams);
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
            value={queryParams.query}
            onChange={onChangeInput}
          />
        </form>
      </header>
    );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  queryParams: PropTypes.object.isRequired,
  setQueryParams: PropTypes.func.isRequired,
};

export default Searchbar;
