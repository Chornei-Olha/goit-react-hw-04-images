import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageFetch from '../../services/images-api';
import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Button from '../Button';
import Loader from '../Loader';
import Modal from '../Modal';
import { useEffect } from 'react';

function App() {
  const [queryParams, setQueryParams] = useState('');
  const [images, setImages] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [imagesOnPage, setImagesOnPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [currentImageDescription, setCurrentImageDescription] = useState(false);

  useEffect(() => {
    if (!queryParams) {
      return;
    }
    setIsLoading(true);

    const renderImages = () => {
      imageFetch(queryParams, page)
        .then(({ hits, totalHits }) => {
          const imagesArray = hits.map(hit => ({
            id: hit.id,
            description: hit.tags,
            smallImage: hit.webformatURL,
            largeImage: hit.largeImageURL,
          }));
          setImages(images => [...images, ...imagesArray]);
          setImagesOnPage(imagesArray.length);
          setTotalImages(totalHits);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false)
        })
    };
    renderImages();
  }, [queryParams, page]);

  const getSearchRequest = queryParams => {
    setQueryParams(queryParams);
    setPage(1);
    setImages([]);
  };

  const onNextFetch = () => {
    setPage(page => page + 1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openModal = e => {
    const currentImageUrl = e.target.dataset.large;
    const currentImageDescription = e.target.alt;

    setShowModal(!showModal);
    setCurrentImageUrl(currentImageUrl);
    setCurrentImageDescription(currentImageDescription);
  };

  return (
    <>
      <Searchbar onSubmit={getSearchRequest} />

      {images && <ImageGallery images={images} openModal={openModal} />}

      {isLoading && <Loader />}

      {imagesOnPage >= 20 && imagesOnPage < totalImages && (
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

export default App;
