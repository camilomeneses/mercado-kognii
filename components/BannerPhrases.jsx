import React, { useEffect, useState } from 'react';
import Marquee from './Marquee';

const BannerPhrases = ({ bannerPhrases }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % bannerPhrases.length
      );
    }, 25000);

    return () => {
      clearInterval(interval);
    };
  }, [bannerPhrases]);

  return (
    <Marquee numberPhrases={bannerPhrases.length}>
      <span>{bannerPhrases[currentPhraseIndex]}</span>
    </Marquee>
  );
};

export default BannerPhrases;


