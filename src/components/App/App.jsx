import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchImages from '../../services/images-api';
import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Button from '../Button';
import Loader from '../Loader';
import Modal from '../Modal';

function App() {
  const [queryParams, setQueryParams] = useState({query:'', prevPage:1, prevImages:[]});
  // const [page, setPage] = useState(1);
  const [imagesOnPage, setImagesOnPage] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  // const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [currentImageDescription, setCurrentImageDescription] = useState(false);

  // useEffect(() => {

  // }, [query, page]);

  const getSearchRequest = () => {
    setIsLoading(true);

       fetchImages(queryParams.query, queryParams.prevPage)
      .then(({ hits, totalHits }) => {
        const imagesArray = hits.map(hit => ({
          id: hit.id,
          description: hit.tags,
          smallImage: hit.webformatURL,
          largeImage: hit.largeImageURL,
        }));

        setImages([...images, ...imagesArray])
        setImagesOnPage(imagesOnPage + imagesArray.length)
        setTotalImages(totalHits)
        setIsLoading(false)
        setQueryParams({...queryParams, prevPage: queryParams.prevPage + 1});

      })
      .catch(error => toast.error(error))
      .finally(() => setIsLoading(false));
  };

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  const openModal = e => {
    const currentImageUrl = e.target.dataset.large;
    const currentImageDescription = e.target.alt;

    setShowModal(!showModal);
    setCurrentImageUrl(currentImageUrl);
    setCurrentImageDescription(currentImageDescription)
  };
  return (
    <>
      <Searchbar onSubmit={getSearchRequest} queryParams={queryParams} setQueryParams={setQueryParams}/>

      {images && <ImageGallery images={images} openModal={openModal} />}

      {isLoading && <Loader />}

      {imagesOnPage >= 12 && imagesOnPage < totalImages && (
        <Button onNextFetch={getSearchRequest} />
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
