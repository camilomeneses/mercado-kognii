import Link from 'next/link';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import Center from './Center';
import FacebookAnimation from '@/assets/facebook.json';
import InstagramAnimation from '@/assets/instagram.json';
import LinkedinAnimation from '@/assets/linkedin.json';
import TwitterAnimation from '@/assets/twitter.json';
import { useSettingsContext } from './SettingsContext';

const StyledFooter = styled.div`
  /* background-color: ${({ transparent }) =>
    !!transparent ? `transparent` : `#222`}; */
  background-image: url('/_footer_.webp');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  color: #fff;
  padding: 30px 0 60px 0;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

const GridElement = styled.div`
  min-width: 250px;
  padding: 10px;
  border-radius: 10px;
`;

const FooterSubTitle = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
  margin: 0;
  padding: 0 0 3px 10px;
  border-bottom: 1px solid #86868678;
`;

const IconsGroup = styled.div`
  display: flex;
  gap: 5px;
  justify-content: space-evenly;
`;

const IconItem = styled.button`
  width: 70px;
  border-radius: 50%;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
`;

const ContactElement = styled.div`
  min-width: 100px;
  font-size: 0.8rem;
  text-align: left;
  padding-left: 15px;
`;

const SubTitleContactGrid = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  padding-left: 15px;
  padding-top: 10px;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
`;

const LinksElement = styled(Link)`
  font-size: 0.9rem;
  padding: 0 0 0 15px;
  text-decoration: none;
  color: #fff;
  min-height: 48px;
  display: flex;
  align-items: center;

  @media screen and (min-width: 768px) {
    min-height: 35px;
  }
`;

export default function Footer({ transparent }) {
  const { telephones, addresses, socialLinks, emails } = useSettingsContext();

  const getSocialLinkData = (socialLinkName) => {
    return socialLinks[socialLinkName];
  };

  return (
    <StyledFooter transparent={transparent}>
      <Center>
        <FooterGrid>
          <div>
            <GridElement>
              <FooterSubTitle>Links</FooterSubTitle>
              <LinksContainer>
                <LinksElement href={'/'}>Nuestra Empresa</LinksElement>
                <LinksElement href={'/categories'}>Categorías</LinksElement>
                <LinksElement href={'/products'}>Productos</LinksElement>
                <LinksElement href={'/account'}>Cuenta</LinksElement>
                <LinksElement href={'/cart'}>Cotizador</LinksElement>
                <LinksElement href={'/privacy-policy'}>
                  Política de Privacidad
                </LinksElement>
                <LinksElement href={'/'}>
                  Reglamento General de Protección de Datos (RGPD)
                </LinksElement>
              </LinksContainer>
            </GridElement>
          </div>

          <div>
            <GridElement>
              <FooterSubTitle>Contacto</FooterSubTitle>
              {telephones?.length > 0 && (
                <>
                  <SubTitleContactGrid>
                    {' '}
                    {telephones?.length === 1 ? 'Teléfono' : 'Teléfonos'}
                  </SubTitleContactGrid>
                  <ContactGrid>
                    {telephones?.map((telephone) => (
                      <ContactElement key={telephone}>
                        {telephone}
                      </ContactElement>
                    ))}
                  </ContactGrid>
                </>
              )}
              {addresses?.length > 0 && (
                <>
                  <SubTitleContactGrid>
                    {' '}
                    {addresses?.length === 1 ? 'Dirección' : 'Direcciónes'}
                  </SubTitleContactGrid>
                  <ContactGrid>
                    {addresses?.map((address) => (
                      <ContactElement key={address}>{address}</ContactElement>
                    ))}
                  </ContactGrid>
                </>
              )}
              {emails?.length > 0 && (
                <>
                  <SubTitleContactGrid>
                    {emails?.length === 1 ? 'Email' : 'Emails'}
                  </SubTitleContactGrid>
                  <ContactGrid>
                    {emails?.map((email) => (
                      <ContactElement key={email}>{email}</ContactElement>
                    ))}
                  </ContactGrid>
                </>
              )}
            </GridElement>
          </div>

          <div>
            <GridElement>
              <FooterSubTitle>Redes Sociales</FooterSubTitle>
              <IconsGroup>
                {getSocialLinkData('facebookSocialLink')?.authorized && (
                  <IconItem aria-label="go to facebook profile">
                    <Link
                      aria-label="link facebook profile"
                      href={`https://www.facebook.com/${
                        getSocialLinkData('facebookSocialLink')?.value
                      }`}
                      passHref>
                      <Lottie animationData={FacebookAnimation} loop={true} />
                    </Link>
                  </IconItem>
                )}
                {getSocialLinkData('instagramSocialLink')?.authorized && (
                  <IconItem aria-label="go to instagram profile">
                    <Link
                      aria-label="link instagram profile"
                      href={`https://www.instagram.com/${
                        getSocialLinkData('instagramSocialLink')?.value
                      }`}
                      passHref>
                      <Lottie animationData={InstagramAnimation} loop={true} />
                    </Link>
                  </IconItem>
                )}
                {getSocialLinkData('linkedinSocialLink')?.authorized && (
                  <IconItem aria-label="go to linkedin profile">
                    <Link
                      aria-label="link linkedin profile"
                      href={`https://www.linkedin.com/in/${
                        getSocialLinkData('linkedinSocialLink')?.value
                      }`}
                      passHref>
                      <Lottie animationData={LinkedinAnimation} loop={true} />
                    </Link>
                  </IconItem>
                )}
                {getSocialLinkData('twitterSocialLink')?.authorized && (
                  <IconItem aria-label="go to twitter profile">
                    <Link
                      aria-label="link twitter profile"
                      href={`https://twitter.com/${
                        getSocialLinkData('twitterSocialLink')?.value
                      }`}
                      passHref>
                      <Lottie animationData={TwitterAnimation} loop={true} />
                    </Link>
                  </IconItem>
                )}
              </IconsGroup>
            </GridElement>
          </div>
        </FooterGrid>
      </Center>
    </StyledFooter>
  );
}

