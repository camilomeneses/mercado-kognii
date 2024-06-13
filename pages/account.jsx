import { ReCaptcha } from 'next-recaptcha-v3';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useSettingsContext } from '@/components/SettingsContext';
import Button from '@/components/Button';
import Center from '@/components/Center';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ProductBox from '@/components/ProductBox';
import Spinner from '@/components/Spinner';
import { WishlistContext } from '@/components/WishlistContext';
import InputDisabled from '@/components/InputDisabled';
import Images from '@/components/Images';
import LockImage from '@/assets/padlock.webp';
import Footer from '@/components/Footer';
import { mongooseConnect } from '@/lib/mongoose';
import { Setting } from '@/models/Setting';

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 1fr);

  ${({ noSession }) =>
    !!noSession &&
    `
      div:nth-child(1) {
        order: 2;
      } 
    `}
  @media screen and (min-width: 830px) {
    grid-template-columns: 1.2fr 0.8fr;

    ${({ noSession }) =>
      !!noSession &&
      `
        div:nth-child(1) {
        order: 0;
      }
    `}

    img {
      max-width: 100%;
    }
  }
  gap: 40px;
  margin: 40px 0;
`;

const CityHolder = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: 1fr;
  @media screen and (min-width: 350px) {
    display: grid;
    gap: 10px;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
  }
`;

const WhiteBoxAccount = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 24px;

  h2 {
    margin: 0;
    padding: 20px 0 10px;
  }
`;

const WishedProductGrid = styled.div`
  // principal grid direction column
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  @media screen and (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 700px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  // principal grid direction row
  @media screen and (min-width: 830px) {
    grid-template-columns: 1fr;
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Bg = styled.div`
  background-image: url('/bg_kognii.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 80vh;
  padding-top: 40px;
`;

const TipSpan = styled.p`
  font-size: 0.8rem;
  margin: 0;
  padding: 10px 0;
`;

const SaveButton = styled(Button)`
  margin-bottom: 15px;
`;

const LogoutButton = styled(Button)`
  margin-top: 15px;
`;

const ImagesWrapper = styled.div`
  border-radius: 20px;
  width: 250px;
  display: flex;
  margin: auto;
`;

const ImagesContainer = styled.div`
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: levitate 6s ease-in-out infinite alternate;

  @keyframes levitate {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(3deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }
`;

const Gradient = styled.div`
  --size: 200px;
  --speed: 5s;
  --easing: cubic-bezier(0.2, 0.2, 0.2, 0.2);
  --color1: hsla(310, 99%, 40%, 1);
  --color2: hsla(221, 64%, 38%, 1);
  --color3: hsla(189, 100%, 45%, 1);

  position: absolute;
  top: 0px;
  left: 30px;
  width: var(--size);
  height: var(--size);
  background-image: conic-gradient(var(--color1), var(--color2), var(--color3));
  animation: rotate var(--speed) var(--easing) infinite;
  border-radius: 50%;
  filter: blur(40px);

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function AccountPage({
  socialLinks,
  telephones,
  addresses,
  emails,
}) {
  const { data: session } = useSession();
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const name = session?.user?.name;
  const email = session?.user?.email;
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishlistLoaded, setWishlistLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const MySwal = withReactContent(Swal);
  const accountDetailsRef = useRef(null);
  const router = useRouter();
  const { asPath } = router;
  const toDetails = asPath.endsWith('#account-details');
  const { fetchWishedProducts } = useContext(WishlistContext);
  const [token, setToken] = useState(null);
  const { updateSocialLinks, updateTelephones, updateAddresses, updateEmails } =
    useSettingsContext();

  useEffect(() => {
    updateSocialLinks(socialLinks);
    updateTelephones(telephones);
    updateAddresses(addresses);
    updateEmails(emails);
  }, [socialLinks, telephones, addresses, emails]);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXTAUTH_URL,
    });
  }

  async function login() {
    await signIn({
      callbackUrl: process.env.NEXTAUTH_URL,
    });
    fetchWishedProducts();
  }

  async function saveAddress(e) {
    e.preventDefault();
    const data = {
      name,
      email,
      city,
      streetAddress,
      postalCode,
      country,
    };

    if (!token) {
      return;
    }

    try {
      await axios.put('/api/address', { data });
      MySwal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'Tu información se guardó correctamente.',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al guardar la información.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  // Función para habilitar/deshabilitar el botón Save
  useEffect(() => {
    const isAnyFieldEmpty =
      city.trim() === '' ||
      postalCode.trim() === '' ||
      streetAddress.trim() === '' ||
      country.trim() === '';

    setSaveButtonDisabled(isAnyFieldEmpty);
  }, [city, postalCode, streetAddress, country]);

  useEffect(() => {
    // Función para desplazarse al elemento "account-details"
    const scrollTo = () => {
      if (accountDetailsRef.current) {
        accountDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Desplazarse a "account-details" después de que los elementos asincrónicos se hayan cargado
    if (addressLoaded && wishlistLoaded && session && toDetails) {
      scrollTo();
    }
  }, [addressLoaded, wishlistLoaded, session]);

  // TODO traer data de address del user si existe con GET
  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishlistLoaded(false);

    // traer address del user desde el provider
    axios.get('/api/address').then((response) => {
      setCity(response.data?.city || '');
      setPostalCode(response.data?.postalCode || '');
      setStreetAddress(response.data?.streetAddress || '');
      setCountry(response.data?.country || '');
      setAddressLoaded(true);
    });
    //traer la wishlist de la api
    axios.get('/api/wishlist').then((response) => {
      setWishedProducts(
        response.data.map((wishedProduct) => wishedProduct?.product)
      );
      setWishlistLoaded(true);
    });
  }, [session]);

  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== idToRemove)];
    });
  }

  useEffect(() => {
    if (token !== null && token) {
      setToken(token);
    }
  }, [token]);

  return (
    <>
      <Header black={true} />
      <Bg>
        <Center>
          <ColsWrapper noSession={!session}>
            {session && (
              <div>
                <WhiteBoxAccount>
                  <h2 id="account-wishlist">Lista de Favoritos</h2>
                  {!wishlistLoaded && <Spinner fullWidth />}
                  {wishedProducts.length === 0 && wishlistLoaded && (
                    <>
                      {session && <p>Your Wishlist is empty!</p>}
                      {!session && (
                        <p>
                          Inicie sesión para agregar productos a los favoritos
                        </p>
                      )}
                    </>
                  )}
                  {wishlistLoaded && (
                    <WishedProductGrid>
                      {wishedProducts.length > 0 &&
                        wishedProducts.map((wp) =>
                          wp ? (
                            <ProductBox
                              key={wp._id}
                              {...wp}
                              wished={true}
                              onRemoveFromWishlist={productRemovedFromWishlist}
                            />
                          ) : null
                        )}
                    </WishedProductGrid>
                  )}
                </WhiteBoxAccount>
              </div>
            )}
            <div ref={accountDetailsRef}>
              <WhiteBoxAccount>
                {
                  <h2 id="account-details">
                    {session ? 'Detalles de Cuenta' : 'Ingresar'}
                  </h2>
                }
                {!addressLoaded && <Spinner fullWidth />}
                {addressLoaded && session && (
                  <>
                    <InputDisabled label={'Nombre'}>{name}</InputDisabled>
                    <InputDisabled label={'Email'}>{email}</InputDisabled>

                    <TipSpan>
                      Por razones de seguridad, su nombre y correo electrónico
                      no pueden ser modificado en esta aplicación.
                    </TipSpan>

                    <form onSubmit={saveAddress}>
                      {/* <CityHolder> */}
                      <Input
                        type="text"
                        label={'Ciudad'}
                        value={city}
                        name={city}
                        placeholder={'Su Ciudad'}
                        require={true}
                        onChange={(ev) => setCity(ev.target.value)}
                      />
                      <Input
                        type="text"
                        label={'Código Postal'}
                        value={postalCode}
                        name={postalCode}
                        placeholder={'Su Código Postal'}
                        require={true}
                        onChange={(ev) => setPostalCode(ev.target.value)}
                      />
                      {/* </CityHolder> */}
                      <Input
                        type="text"
                        value={streetAddress}
                        name={streetAddress}
                        label={'Dirección'}
                        placeholder={'Su Dirección'}
                        require={true}
                        onChange={(ev) => setStreetAddress(ev.target.value)}
                      />
                      <Input
                        type="text"
                        value={country}
                        name={country}
                        label={'País'}
                        placeholder={'Su País'}
                        require={true}
                        onChange={(ev) => setCountry(ev.target.value)}
                      />
                      <TipSpan>
                        Para ayudar a nuestro equipo de atención al cliente,
                        recuerde mantener la información de su ubicación
                        actualizada.
                      </TipSpan>
                      <div>
                        <ReCaptcha onValidate={setToken} action="form_submit" />
                        <SaveButton
                          black={1}
                          block={1}
                          type="submit"
                          disabled={saveButtonDisabled}>
                          Guardar
                        </SaveButton>
                      </div>
                    </form>
                    <hr></hr>
                    {session && (
                      <LogoutButton primary={1} onClick={logout} block={1}>
                        Salir
                      </LogoutButton>
                    )}
                  </>
                )}
                {!session && (
                  <>
                    <TipSpan>
                      Para acceder a su lista de deseos e iniciar el proceso de
                      cotización, Inicie Sesión.
                    </TipSpan>
                    <Button primary={1} onClick={login} block={1}>
                      Ingresar
                    </Button>
                  </>
                )}
              </WhiteBoxAccount>
            </div>
            {!session && (
              <div>
                <ImagesWrapper>
                  <ImagesContainer>
                    <Gradient></Gradient>
                    <ImageWrapper>
                      <Images
                        quality={90}
                        priority
                        src={LockImage}
                        alt={'lock'}
                      />
                    </ImageWrapper>
                  </ImagesContainer>
                </ImagesWrapper>
              </div>
            )}
          </ColsWrapper>
        </Center>
        <Footer transparent={true} />
      </Bg>
    </>
  );
}

export async function getServerSideProps(ctx) {
  try {
    await mongooseConnect();
    //TODO Obtener los enlaces sociales desde MongoDB
    let socialLinks = [];
    socialLinks = await Setting.find({
      name: {
        $in: [
          'facebookSocialLink',
          'instagramSocialLink',
          'twitterSocialLink',
          'linkedinSocialLink',
        ],
      },
    });

    //TODO Obtener los telefonos comerciales
    let telephones = [];
    telephones = await Setting.findOne({
      name: 'commercialTelephones',
    });

    //TODO Obtener las direcciones comerciales
    let addresses = [];
    addresses = await Setting.findOne({
      name: 'commercialAddresses',
    });

    //TODO Obtener las direcciones comerciales
    let emails = [];
    emails = await Setting.findOne({
      name: 'commercialEmails',
    });

    return {
      props: {
        socialLinks: JSON.parse(JSON.stringify(socialLinks)),
        telephones: JSON.parse(JSON.stringify(telephones)),
        addresses: JSON.parse(JSON.stringify(addresses)),
        emails: JSON.parse(JSON.stringify(emails)),
      },
    };
  } catch (error) {
    console.error('Error:', error);
  }
}

