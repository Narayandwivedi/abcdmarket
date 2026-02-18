import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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

const getNextHeroIndex = (currentIndex, lockedIndex, totalHeroes) => {
  if (totalHeroes <= 1) return 0;

  let nextIndex = (currentIndex + 1) % totalHeroes;
  if (totalHeroes === 2) return nextIndex;

  let guard = 0;
  while (nextIndex === lockedIndex && guard < totalHeroes) {
    nextIndex = (nextIndex + 1) % totalHeroes;
    guard += 1;
  }

  return nextIndex;
};

const HeroSection = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [heroes, setHeroes] = useState([]);
  const [mobileSlotIndices, setMobileSlotIndices] = useState([0, 1]);
  const [mobileDarkSlot, setMobileDarkSlot] = useState(null);
  const mobileSlotIndicesRef = useRef([0, 1]);
  const activeMobileSlotRef = useRef(1);

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

  useEffect(() => {
    const initialSlots = [0, displayHeroes.length > 1 ? 1 : 0];
    mobileSlotIndicesRef.current = initialSlots;
    activeMobileSlotRef.current = 1;
    setMobileSlotIndices(initialSlots);
    setMobileDarkSlot(null);
  }, [displayHeroes.length]);

  useEffect(() => {
    if (displayHeroes.length <= 1) return undefined;

    const intervalMs = 1800;
    const fadeToDarkDurationMs = 760;
    const darkHoldDurationMs = 110;
    const timeoutIds = new Set();
    let isCancelled = false;

    const schedule = (fn, delay) => {
      const timeoutId = setTimeout(() => {
        timeoutIds.delete(timeoutId);
        if (!isCancelled) {
          fn();
        }
      }, delay);
      timeoutIds.add(timeoutId);
    };

    const runCycle = () => {
      if (isCancelled) return;

      const slotToChange = activeMobileSlotRef.current;
      const lockedSlot = slotToChange === 0 ? 1 : 0;
      const currentSlots = mobileSlotIndicesRef.current;

      // Fade only the card that is about to change.
      setMobileDarkSlot(slotToChange);

      schedule(() => {
        const nextSlots = [...currentSlots];
        nextSlots[slotToChange] = getNextHeroIndex(
          currentSlots[slotToChange],
          currentSlots[lockedSlot],
          displayHeroes.length
        );
        mobileSlotIndicesRef.current = nextSlots;
        setMobileSlotIndices(nextSlots);
      }, fadeToDarkDurationMs);

      schedule(() => {
        setMobileDarkSlot(null);
        activeMobileSlotRef.current = lockedSlot;
      }, fadeToDarkDurationMs + darkHoldDurationMs);

      schedule(() => {
        runCycle();
      }, intervalMs);
    };

    schedule(() => {
      runCycle();
    }, intervalMs);

    return () => {
      isCancelled = true;
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.clear();
    };
  }, [displayHeroes.length]);

  const mobileHeroes = useMemo(() => {
    if (displayHeroes.length === 0) return [];
    const [leftIndex, rightIndex] = mobileSlotIndices;
    return [
      displayHeroes[leftIndex] || displayHeroes[0],
      displayHeroes[rightIndex] || displayHeroes[0]
    ];
  }, [displayHeroes, mobileSlotIndices]);

  const renderHeroItem = (hero, index, keyPrefix = 'hero', isDarkened = false) => {
    const imageSrc = resolveHeroImageUrl(BACKEND_URL, hero.imageUrl);
    const altText = hero.title || `Hero banner ${index + 1}`;
    const hasLink = Boolean(hero.linkUrl);
    const isExternal = /^https?:\/\//i.test(hero.linkUrl || '');

    const imageNode = (
      <>
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-auto block rounded-md"
        />
        <div
          className={`pointer-events-none absolute inset-0 rounded-md bg-black transition-opacity duration-[760ms] ease-in-out ${isDarkened ? 'opacity-[0.89]' : 'opacity-0'}`}
        />
      </>
    );

    if (!hasLink) {
      return (
        <div key={`${keyPrefix}-${hero._id || imageSrc}-${index}`} className="relative">
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
        className="relative block"
      >
        {imageNode}
      </a>
    );
  };

  return (
    <section className="w-full lg:w-[92%] mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-2 gap-2 md:gap-4 items-center lg:hidden">
        {mobileHeroes.map((hero, index) =>
          renderHeroItem(hero, mobileSlotIndices[index] || index, 'mobile', mobileDarkSlot === index)
        )}
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 gap-2 md:gap-4 items-center">
        {displayHeroes.map((hero, index) => renderHeroItem(hero, index, 'desktop'))}
      </div>
    </section>
  );
};

export default HeroSection;
