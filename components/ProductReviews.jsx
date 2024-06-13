import { ReCaptcha } from 'next-recaptcha-v3';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styled from 'styled-components';
import Input from './Input';
import StartsRating from './StarsRating';
import Textarea from './Textarea';
import Button from './Button';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Spinner from './Spinner';
import { InfoIcon, TrashIcon } from './icons';
import moment from 'moment';
import 'moment-timezone';
import CenterContent from './CenterContent';

const WhiteBoxReview = styled.div`
  background-color: #ffffffb0;
  border-radius: 10px;
  padding: 30px;
`;

const WhiteBoxAllReview = styled.div`
  background-color: #ffffffb0;
  border-radius: 10px;
  padding: 30px;
  height: minmax(380px, fit-content);
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 5px;
`;

const SubTitle = styled.h3`
  font-size: 1.2rem;
  margin-top: 5px;
  margin-bottom: 10px;
  display: flex;
  font-weight: 500;
`;

const TitleAndStarsWrapper = styled.div`
  display: inline;
  @media screen and (min-width: 460px) {
    display: flex;
    align-items: last center;
    gap: 20px;
    justify-content: space-between;
  }
`;

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  padding-bottom: 40px;

  ${(props) =>
    props.session &&
    `
    @media screen and (min-width: 830px) {
      grid-template-columns: 0.8fr 1.2fr;
    }
  `}
`;

const ButtonWrapper = styled.div`
  padding-top: 5px;
  display: flex;
  justify-content: end;
`;

const IconWrapper = styled.div`
  width: 2rem;
  height: 2rem;
`;

const NoReviewsWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: last center;
`;

const ReviewWrapper = styled.div`
  border-top: 1px solid #ccc;
  padding: 20px 0;
`;

const FirsRowReviewWrapper = styled.div`
  display: inline;
  @media screen and (min-width: 460px) {
    display: flex;
    justify-content: space-between;
  }
`;

const DateReviewWrapper = styled.div`
  font-weight: 700;
  color: #999;
`;

const UsernameReviewWrapper = styled.div`
  font-size: 0.9rem;
`;

const TitleReviewWrapper = styled.div`
  padding: 5px 0;
  font-size: 1.4rem;
  font-weight: 700;
`;

const DescriptionReviewWrapper = styled.div``;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.noPagination
      ? `
      display:none;
    `
      : ``}
`;

const PaginationButton = styled(Button)`
  padding: 5px 10px;
  background-color: transparent;

  ${(props) =>
    props.active
      ? `
      border: 1px solid #aaa;
    `
      : ``}
`;

const SubTitleAndPaginationWrapper = styled.div`
  display: inline;
  @media screen and (min-width: 500px) {
    display: flex;
    justify-content: space-between;
  }
`;

const DateAndDeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: 460px) {
    display: flex;
    gap: 10px;
  }
`;

const DeleteButton = styled(Button)`
  padding: 1px;
  height: 20px;
  svg {
    margin: 0;
  }

  @media screen and (min-width: 460px) {
    padding: 2px 3px;
    height: auto;
    svg {
      margin: 0;
    }
  }
`;

export default function ProductReviews({ product }) {
  const MySwal = withReactContent(Swal);
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stars, setStars] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [sentButtonDisabled, setSentButtonDisabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;
  const [totalPages, setTotalPages] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(true);

  function submitReview(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      stars,
      product: product._id,
      username: session?.user?.name,
      email: session?.user?.email,
    };
    if (!token) {
      return;
    }
    try {
      setReviewSubmitted(false);
      axios.post('/api/reviews', data).then((res) => {
        MySwal.fire({
          icon: 'success',
          title: 'Review Sent',
          text: 'Your review has been sent successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
        setTitle('');
        setDescription('');
        setStars(0);
        setReviewSubmitted(true);
        setCurrentPage(1);
        loadReviews();
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while sending the review.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  function loadReviews() {
    setReviewsLoading(true);
    axios
      .get('/api/reviews', {
        params: {
          product: product._id,
          email: session?.user?.email || '',
          page: currentPage,
          limit: reviewsPerPage,
        },
      })
      .then((res) => {
        if (res.data && res.data.reviews.length) {
          setReviews(res.data.reviews);
          setReviewsLoading(false);
          const totalReviews = res.data.totalReviews;
          const totalPages = res.data.totalPages;
          setTotalPages(totalPages);
          return;
        }

        setReviews([]);
        setReviewsLoading(false);
      })
      .catch((error) => {
        console.error('Error while loading reviews:', error);
        setReviews([]);
        setReviewsLoading(false);
      });
  }

  function handleDeleteReview(reviewId, email) {
    MySwal.fire({
      title: 'Está Seguro?',
      icon: 'info',
      text: `Quieres eliminar este comentario?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, Eliminar!',
      confirmButtonColor: '#e75252',
      reverseButtons: true,
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/reviews`, {
              params: {
                _id: reviewId,
                email,
              },
            })
            .then((res) => {
              // Aquí puedes manejar la respuesta en caso de éxito
              console.log('Review deleted successfully');
              // Vuelve a cargar las reseñas actualizadas después de eliminar
              loadReviews();
            })
            .catch((error) => {
              // Aquí puedes manejar los errores
              console.error('Error deleting review:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function renderPageButtons() {
    const pageButtons = [];
    const maxVisibleButtons = 3;
    let startPage;
    let endPage;

    if (totalPages <= maxVisibleButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxVisibleBeforeCurrent = Math.floor((maxVisibleButtons - 1) / 2);
      const maxVisibleAfterCurrent = Math.ceil((maxVisibleButtons - 1) / 2);

      if (currentPage <= maxVisibleBeforeCurrent) {
        startPage = 1;
        endPage = maxVisibleButtons;
      } else if (currentPage + maxVisibleAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisibleButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxVisibleBeforeCurrent;
        endPage = currentPage + maxVisibleAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <PaginationButton
          key={i}
          onClick={() => setCurrentPage(i)}
          active={i === currentPage}>
          {i}
        </PaginationButton>
      );
    }

    return pageButtons;
  }

  // Función para habilitar/deshabilitar el botón Save
  useEffect(() => {
    const isAnyFieldEmpty =
      stars === 0 || title.trim() === '' || description.trim() === '';
    setSentButtonDisabled(isAnyFieldEmpty);
  }, [stars, title, description]);

  useEffect(() => {
    if (token !== null && token) {
      setToken(token);
    }
  }, [token]);

  useEffect(() => {
    setReviews([]);
    loadReviews();
  }, [currentPage]);

  useEffect(() => {
    // Función para actualizar el ancho del viewport
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Agregar el event listener para el evento 'resize'
    window.addEventListener('resize', handleResize);

    // Obtener el ancho inicial del viewport al cargar la página
    handleResize();

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <CenterContent>
      <Title>Comentarios</Title>
      <ColsWrapper session={session}>
        {session && (
          <form onSubmit={submitReview}>
            <WhiteBoxReview>
              {!reviewSubmitted && <Spinner fullWidth={true} />}
              {reviewSubmitted && (
                <>
                  <TitleAndStarsWrapper>
                    <SubTitle>Agregar Comentario</SubTitle>

                    <div>
                      <StartsRating
                        onChange={setStars}
                        defaultHowMany={stars}
                        value={stars}
                      />
                    </div>
                  </TitleAndStarsWrapper>
                  <Input
                    placeholder="Agregar Título"
                    label="Title"
                    name="title"
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}
                  />
                  <Textarea
                    placeholder="Qué le parece el producto?"
                    name="description"
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                  />
                  <ButtonWrapper>
                    <ReCaptcha onValidate={setToken} action="form_submit" />
                    <Button
                      primary={1}
                      type="submit"
                      disabled={sentButtonDisabled}>
                      Enviar Comentario
                    </Button>
                  </ButtonWrapper>
                </>
              )}
            </WhiteBoxReview>
          </form>
        )}
        <div>
          <WhiteBoxAllReview>
            <SubTitleAndPaginationWrapper>
              <SubTitle>Todos los Comentarios</SubTitle>
              {reviews.length > 0 && (
                <PaginationWrapper noPagination={totalPages <= 1}>
                  <PaginationButton
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}>
                    Anterior
                  </PaginationButton>
                  {windowWidth > 380 && renderPageButtons()}
                  <PaginationButton
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    Siguiente
                  </PaginationButton>
                </PaginationWrapper>
              )}
            </SubTitleAndPaginationWrapper>
            {reviewsLoading && <Spinner fullWidth={true} />}
            {!reviewsLoading && reviews.length === 0 && (
              <NoReviewsWrapper>
                <IconWrapper>
                  <InfoIcon />
                </IconWrapper>{' '}
                Sin Comentarios
              </NoReviewsWrapper>
            )}

            {reviews.length > 0 &&
              reviews.map((review) => (
                <ReviewWrapper key={review._id}>
                  <FirsRowReviewWrapper>
                    <StartsRating
                      size={'sm'}
                      disabled={true}
                      defaultHowMany={review.stars}
                    />
                    <DateAndDeleteButtonWrapper>
                      <DateReviewWrapper>
                        {review.createdAt &&
                          moment(review.createdAt)
                            .tz('America/Bogota')
                            .format('DD/MM/YYYY HH:mm')}
                      </DateReviewWrapper>
                      {review.canDelete && (
                        <DeleteButton
                          danger={true}
                          onClick={() =>
                            handleDeleteReview(review._id, session?.user?.email)
                          }>
                          <TrashIcon />
                        </DeleteButton>
                      )}
                    </DateAndDeleteButtonWrapper>
                  </FirsRowReviewWrapper>
                  <UsernameReviewWrapper>
                    {review.username}
                  </UsernameReviewWrapper>
                  <TitleReviewWrapper>{review.title}</TitleReviewWrapper>
                  <DescriptionReviewWrapper>
                    <i>{review.description}</i>
                  </DescriptionReviewWrapper>
                </ReviewWrapper>
              ))}
          </WhiteBoxAllReview>
        </div>
      </ColsWrapper>
    </CenterContent>
  );
}


