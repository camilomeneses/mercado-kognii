import { poppins } from '@/lib/font';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { getServerSession } from 'next-auth';
import { useEffect } from 'react';
import Feactured from '@/components/Feactured';
import Header from '@/components/Header';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { authOptions } from './api/auth/[...nextauth]';
import { WishedProduct } from '@/models/WishedProduct';
import { Setting } from '@/models/Setting';
import BannerPhrases from '@/components/BannerPhrases';
import { useSettingsContext } from '@/components/SettingsContext';

//* dynamic loading
const Footer = dynamic(() => import('@/components/Footer'));
const NewProducts = dynamic(() => import('@/components/NewProducts'));

export default function HomePage({
  feacturedProducts,
  newProducts,
  wishedNewProducts,
  userName,
  bannerPhrases,
  socialLinks,
  telephones,
  addresses,
  emails,
}) {
  const { updateSocialLinks, updateTelephones, updateAddresses, updateEmails } =
    useSettingsContext();

  useEffect(() => {
    updateSocialLinks(socialLinks);
    updateTelephones(telephones);
    updateAddresses(addresses);
    updateEmails(emails);
  }, [socialLinks, telephones, addresses, emails]);

  return (
    <>
      <Head>
        <title>Demo Ecommerce</title>
        <meta
          name="description"
          content="Demo Ecommerce es un modelo de tienda en línea dirigido para pequeños vendedores que quieren promocionar sus productos por internet a bajo costo"
          key="desc"
        />
      </Head>
      <Header />
      <Feactured feacturedProducts={feacturedProducts} userName={userName} />
      {bannerPhrases[0] !== '' && (
        <BannerPhrases bannerPhrases={bannerPhrases} />
      )}
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  //* parallel call to mongoDB
  try {
    await mongooseConnect();

    async function fetchFeaturedProducts() {
      const featuredProductSettingArray = await Setting.findOne({
        name: 'featuredProducts',
      });
      const featuredProductSetting = featuredProductSettingArray?.value;

      return Product.find({
        _id: { $in: featuredProductSetting },
      });
    }

    async function fetchBannerPhrases() {
      const bannerPhrasesSettingArray = await Setting.findOne({
        name: 'bannerPhrases',
      });
      const bannerPhrasesSetting =
        bannerPhrasesSettingArray?.value.length > 0
          ? bannerPhrasesSettingArray?.value
          : [''];

      return bannerPhrasesSetting;
    }

    async function fetchNewProducts() {
      return Product.find({}, null, {
        sort: { _id: -1 },
        limit: 8,
      });
    }

    async function fetchWishedNewProducts(session, newProducts) {
      if (session?.user) {
        return WishedProduct.find({
          userEmail: session.user.email,
          product: newProducts.map((product) => product._id.toString()),
        });
      } else {
        return [];
      }
    }

    async function fetchSocialLinks() {
      return Setting.find({
        name: {
          $in: [
            'facebookSocialLink',
            'instagramSocialLink',
            'twitterSocialLink',
            'linkedinSocialLink',
          ],
        },
      });
    }

    async function fetchTelephones() {
      return Setting.findOne({
        name: 'commercialTelephones',
      });
    }

    async function fetchAddresses() {
      return Setting.findOne({
        name: 'commercialAddresses',
      });
    }

    async function fetchEmails() {
      return Setting.findOne({
        name: 'commercialEmails',
      });
    }

    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    const newProducts = await fetchNewProducts();

    const [
      featuredProducts,
      bannerPhrases,
      wishedNewProducts,
      socialLinks,
      telephones,
      addresses,
      emails,
    ] = await Promise.all([
      fetchFeaturedProducts(),
      fetchBannerPhrases(),
      fetchWishedNewProducts(session, newProducts),
      fetchSocialLinks(),
      fetchTelephones(),
      fetchAddresses(),
      fetchEmails(),
    ]);

    const userName = session?.user?.name || '';

    return {
      props: {
        userName,
        feacturedProducts: JSON.parse(JSON.stringify(featuredProducts)),
        newProducts: JSON.parse(JSON.stringify(newProducts)),
        wishedNewProducts: wishedNewProducts.map((item) =>
          item.product.toString()
        ),
        bannerPhrases: JSON.parse(JSON.stringify(bannerPhrases)),
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
