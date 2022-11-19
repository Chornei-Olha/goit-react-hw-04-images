import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchImages from '../../services/images-api';
import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Button from '../Button';
import Loader from '../Loader';
import Modal from '../Modal';

class App extends Component {
  state = {
    query: '',
    page: 1,
    imagesOnPage: 0,
    totalImages: 0,
    isLoading: false,
    showModal: false,
    images: [],
    error: null,
    currentImageUrl: null,
    currentImageDescription: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.setState(({ isLoading }) => ({ isLoading: !isLoading }));

      fetchImages(query, this.state.page)
        .then(({ hits, totalHits }) => {
          const imagesArray = hits.map(hit => ({
            id: hit.id,
            description: hit.tags,
            smallImage: hit.webformatURL,
            largeImage: hit.largeImageURL,
          }));
          console.log(this.state.images);
console.log(hits)
          console.log(this.state.imagesArray);
          
          return this.setState(({ images, imagesOnPage }) => ({
            images: [...images, ...imagesArray],
            imagesOnPage: imagesOnPage + imagesArray.length,
            totalImages: totalHits,
            isLoading: false,
          }));
        })
        .catch(error => this.setState({ error }))
         .finally(() =>
          this.setState(({ isLoading }) => ({ isLoading: false }))
        );
    }
  }

  getSearchRequest = query => {
    this.setState({ query: query, page: 1, images: [] });
  };

  onNextFetch = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  openModal = e => {
    const currentImageUrl = e.target.dataset.large;
    const currentImageDescription = e.target.alt;

      this.setState(({ showModal }) => ({
        showModal: !showModal,
        currentImageUrl: currentImageUrl,
        currentImageDescription: currentImageDescription,
      }));
  };

  render() {
    const {
      images,
      imagesOnPage,
      totalImages,
      isLoading,
      showModal,
      currentImageUrl,
      currentImageDescription,
    } = this.state;

    const getSearchRequest = this.getSearchRequest;
    const onNextFetch = this.onNextFetch;
    const openModal = this.openModal;
    const toggleModal = this.toggleModal;

    return (
      <>
        <Searchbar onSubmit={getSearchRequest} />

        {images && <ImageGallery images={images} openModal={openModal} />}

        {isLoading && <Loader />}

        {imagesOnPage >= 12 && imagesOnPage < totalImages && (
          <Button onNextFetch={onNextFetch} />
        )}

        {showModal && (
          <Modal
            onClose={toggleModal}
            currentImageUrl={currentImageUrl}
            currentImageDescription={currentImageDescription}
          />
        )}

        <ToastContainer />
      </>
    );
  }
}

export default App;
