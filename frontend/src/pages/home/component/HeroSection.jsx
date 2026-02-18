import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';

const demoHeroes = [
  { _id: 'demo-1', imageUrl: '/banana.png', title: 'Banana Banner', linkUrl: '' },
  { _id: 'demo-2', imageUrl: '/apple.png', title: 'Apple Banner', linkUrl: '' },
  { _id: 'demo-3', imageUrl: '/onion.png', title: 'Onion Banner', linkUrl: '' },
  { _id: 'demo-4', imageUrl: '/almond.png', title: 'Almond Banner', linkUrl: '' }
];

const resolveHeroImageUrl = (backendUrl, imageUrl) => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    return `${backendUrl}${imageUrl}`;
  }
  return imageUrl;
};

const MOBILE_VISIBLE_CARDS = 2.4;
const MOBILE_CARD_WIDTH_PERCENT = 100 / MOBILE_VISIBLE_CARDS;

const HeroSection = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [heroes, setHeroes] = useState([]);
  const [mobileStartIndex, setMobileStartIndex] = useState(0);
  const [isMobileSliding, setIsMobileSliding] = useState(false);

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
    if (heroes.length > 0) return heroes;
    return demoHeroes;
  }, [heroes]);

  const mobileSlideHeroes = useMemo(() => {
    const total = displayHeroes.length;
    if (total === 0) return [];

    return [0, 1, 2].map((offset) => {
      const heroIndex = (mobileStartIndex + offset) % total;
      return {
        hero: displayHeroes[heroIndex],
        heroIndex,
        offset
      };
    });
  }, [displayHeroes, mobileStartIndex]);

  useEffect(() => {
    setMobileStartIndex(0);
    setIsMobileSliding(false);
  }, [displayHeroes.length]);

  useEffect(() => {
    if (displayHeroes.length <= 1) return undefined;

    const intervalMs = 1800;
    const slideDurationMs = 700;
    let slideTimeoutId;

    const intervalId = setInterval(() => {
      setIsMobileSliding(true);

      slideTimeoutId = setTimeout(() => {
        setMobileStartIndex((prev) => (prev + 1) % displayHeroes.length);
        setIsMobileSliding(false);
      }, slideDurationMs);
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
      clearTimeout(slideTimeoutId);
    };
  }, [displayHeroes.length]);

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
    <section className="w-full lg:w-[92%] mx-auto px-2 sm:px-4">
      <div className="relative overflow-hidden lg:hidden">
        <div
          className={`${isMobileSliding ? 'transition-transform duration-700 ease-in-out' : 'transition-none'} flex`}
          style={{ transform: isMobileSliding ? `translateX(-${MOBILE_CARD_WIDTH_PERCENT}%)` : 'translateX(0%)' }}
        >
          {mobileSlideHeroes.map(({ hero, heroIndex, offset }) => (
            <div
              key={`mobile-hero-${hero._id || heroIndex}-${mobileStartIndex}-${offset}`}
              className="shrink-0 px-1"
              style={{ width: `${MOBILE_CARD_WIDTH_PERCENT}%` }}
            >
              {renderHeroItem(hero, heroIndex, `mobile-${offset}`)}
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
