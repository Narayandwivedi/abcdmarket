import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';

const demoHeroes = [
  { _id: 'demo-1', imageUrl: '/banana.png', title: 'Banana Banner', linkUrl: '' },
  { _id: 'demo-2', imageUrl: '/apple.avif', title: 'Apple Banner', linkUrl: '' },
  { _id: 'demo-3', imageUrl: '/onion.png', title: 'Onion Banner', linkUrl: '' },
  { _id: 'demo-4', imageUrl: '/almond.avif', title: 'Almond Banner', linkUrl: '' }
];

const resolveHeroImageUrl = (backendUrl, imageUrl) => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    return `${backendUrl}${imageUrl}`;
  }
  return imageUrl;
};

const MOBILE_VISIBLE_CARDS = 2;
const MOBILE_CARD_WIDTH_PERCENT = 100 / MOBILE_VISIBLE_CARDS;

const HeroSection = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [heroes, setHeroes] = useState([]);
  const [mobileStartIndex, setMobileStartIndex] = useState(0);
  const [isMobileTransitionEnabled, setIsMobileTransitionEnabled] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/heroes?limit=4`);
        const heroList = Array.isArray(response.data?.data) ? response.data.data : [];

        if (isMounted) {
          setHeroes(heroList.slice(0, 4));
        }
      } catch (error) {
        if (isMounted) {
          setHeroes([]);
        }
      }
    };

    fetchHeroes();

    return () => {
      isMounted = false;
    };
  }, [BACKEND_URL]);

  const displayHeroes = useMemo(() => {
    if (heroes.length === 0) return demoHeroes;

    const normalizedHeroes = heroes.slice(0, 4);
    if (normalizedHeroes.length >= 4) return normalizedHeroes;

    const missingCount = 4 - normalizedHeroes.length;
    return [...normalizedHeroes, ...demoHeroes.slice(0, missingCount)];
  }, [heroes]);

  const mobileTrackHeroes = useMemo(() => {
    if (displayHeroes.length === 0) return [];
    if (displayHeroes.length === 1) return displayHeroes;

    const cloneCount = Math.min(MOBILE_VISIBLE_CARDS, displayHeroes.length);
    return [...displayHeroes, ...displayHeroes.slice(0, cloneCount)];
  }, [displayHeroes]);

  useEffect(() => {
    setMobileStartIndex(0);
    setIsMobileTransitionEnabled(true);
  }, [displayHeroes.length]);

  useEffect(() => {
    if (displayHeroes.length <= 1) return undefined;

    const startTimeoutId = setTimeout(() => {
      setIsMobileTransitionEnabled(true);
      setMobileStartIndex(1);
    }, 60);

    return () => {
      clearTimeout(startTimeoutId);
    };
  }, [displayHeroes.length]);

  const handleMobileTransitionEnd = () => {
    if (displayHeroes.length <= 1) return;

    if (mobileStartIndex >= displayHeroes.length) {
      setIsMobileTransitionEnabled(false);
      setMobileStartIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMobileTransitionEnabled(true);
          setMobileStartIndex(1);
        });
      });
      return;
    }

    setMobileStartIndex((prev) => prev + 1);
  };

  const renderHeroItem = (hero, index, keyPrefix = 'hero') => {
    const imageSrc = resolveHeroImageUrl(BACKEND_URL, hero.imageUrl);
    const altText = hero.title || `Hero banner ${index + 1}`;
    const hasLink = Boolean(hero.linkUrl);
    const isExternal = /^https?:\/\//i.test(hero.linkUrl || '');

    const imageNode = (
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-auto block rounded-md"
      />
    );

    if (!hasLink) {
      return (
        <div key={`${keyPrefix}-${hero._id || imageSrc}-${index}`}>
          {imageNode}
        </div>
      );
    }

    return (
      <a
        key={`${keyPrefix}-${hero._id || imageSrc}-${index}`}
        href={hero.linkUrl}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {imageNode}
      </a>
    );
  };

  return (
    <section className="w-full lg:w-[92%] mx-auto px-1 sm:px-4">
      <div className="relative overflow-hidden lg:hidden">
        <div
          className={`${isMobileTransitionEnabled ? 'transition-transform duration-[900ms] ease-linear' : 'transition-none'} flex`}
          style={{ transform: `translateX(-${mobileStartIndex * MOBILE_CARD_WIDTH_PERCENT}%)` }}
          onTransitionEnd={handleMobileTransitionEnd}
        >
          {mobileTrackHeroes.map((hero, index) => (
            <div
              key={`mobile-hero-${hero._id || index}-${index}`}
              className="shrink-0 px-0.5"
              style={{ width: `${MOBILE_CARD_WIDTH_PERCENT}%` }}
            >
              {renderHeroItem(hero, index, `mobile-${index}`)}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-2 md:gap-4 items-center">
        {displayHeroes.map((hero, index) => renderHeroItem(hero, index, 'desktop'))}
      </div>
    </section>
  );
};

export default HeroSection;
