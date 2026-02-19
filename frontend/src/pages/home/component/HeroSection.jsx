import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
const MOBILE_CLONE_COUNT = MOBILE_VISIBLE_CARDS;
const MOBILE_CARD_WIDTH_PERCENT = 100 / MOBILE_VISIBLE_CARDS;
const MOBILE_SWIPE_THRESHOLD_PX = 22;
const DEFAULT_HERO_TARGET_URL = '/';

const HeroSection = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [heroes, setHeroes] = useState([]);
  const [mobileTrackIndex, setMobileTrackIndex] = useState(MOBILE_CLONE_COUNT);
  const [isMobileTransitionEnabled, setIsMobileTransitionEnabled] = useState(true);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchCurrentXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchCurrentYRef = useRef(0);
  const didSwipeRef = useRef(false);
  const resumeAutoAfterSwipeRef = useRef(false);

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

  const mobileCloneCount = useMemo(
    () => Math.min(MOBILE_CLONE_COUNT, displayHeroes.length || 1),
    [displayHeroes.length],
  );

  const mobileTrackHeroes = useMemo(() => {
    if (displayHeroes.length === 0) return [];
    if (displayHeroes.length === 1) return displayHeroes;

    const leadingClones = displayHeroes.slice(-mobileCloneCount);
    const trailingClones = displayHeroes.slice(0, mobileCloneCount);
    return [...leadingClones, ...displayHeroes, ...trailingClones];
  }, [displayHeroes, mobileCloneCount]);

  useEffect(() => {
    setMobileTrackIndex(displayHeroes.length > 1 ? mobileCloneCount : 0);
    setIsMobileTransitionEnabled(true);
    setIsAutoPlayPaused(false);
  }, [displayHeroes.length, mobileCloneCount]);

  useEffect(() => {
    if (displayHeroes.length <= 1 || isAutoPlayPaused) return undefined;

    const startTimeoutId = setTimeout(() => {
      setIsMobileTransitionEnabled(true);
      setMobileTrackIndex((prev) => prev + 1);
    }, 60);

    return () => {
      clearTimeout(startTimeoutId);
    };
  }, [displayHeroes.length, isAutoPlayPaused]);

  const handleMobileTransitionEnd = () => {
    if (displayHeroes.length <= 1) return;

    const maxTrackStartIndex = mobileCloneCount + displayHeroes.length;
    const shouldResumeAfterSwipe = resumeAutoAfterSwipeRef.current;

    if (mobileTrackIndex >= maxTrackStartIndex) {
      setIsMobileTransitionEnabled(false);
      setMobileTrackIndex((prev) => prev - displayHeroes.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMobileTransitionEnabled(true);
          if (shouldResumeAfterSwipe) {
            resumeAutoAfterSwipeRef.current = false;
            setIsAutoPlayPaused(false);
            return;
          }
          if (!isAutoPlayPaused) {
            setMobileTrackIndex((prev) => prev + 1);
          }
        });
      });
      return;
    }

    if (mobileTrackIndex < mobileCloneCount) {
      setIsMobileTransitionEnabled(false);
      setMobileTrackIndex((prev) => prev + displayHeroes.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMobileTransitionEnabled(true);
          if (shouldResumeAfterSwipe) {
            resumeAutoAfterSwipeRef.current = false;
            setIsAutoPlayPaused(false);
            return;
          }
          if (!isAutoPlayPaused) {
            setMobileTrackIndex((prev) => prev + 1);
          }
        });
      });
      return;
    }

    if (shouldResumeAfterSwipe) {
      resumeAutoAfterSwipeRef.current = false;
      setIsAutoPlayPaused(false);
      return;
    }

    if (!isAutoPlayPaused) {
      setMobileTrackIndex((prev) => prev + 1);
    }
  };

  const handleMobileTouchStart = (event) => {
    if (displayHeroes.length <= 1) return;

    const touchX = event.touches[0]?.clientX ?? 0;
    const touchY = event.touches[0]?.clientY ?? 0;
    touchStartXRef.current = touchX;
    touchCurrentXRef.current = touchX;
    touchStartYRef.current = touchY;
    touchCurrentYRef.current = touchY;
    didSwipeRef.current = false;
    resumeAutoAfterSwipeRef.current = false;
    setIsAutoPlayPaused(true);
  };

  const handleMobileTouchMove = (event) => {
    if (displayHeroes.length <= 1) return;
    touchCurrentXRef.current = event.touches[0]?.clientX ?? touchCurrentXRef.current;
    touchCurrentYRef.current = event.touches[0]?.clientY ?? touchCurrentYRef.current;

    const deltaX = Math.abs(touchCurrentXRef.current - touchStartXRef.current);
    const deltaY = Math.abs(touchCurrentYRef.current - touchStartYRef.current);
    if (deltaX > deltaY && deltaX > 6) {
      event.preventDefault();
    }
  };

  const handleMobileTouchEnd = () => {
    if (displayHeroes.length <= 1) return;

    const deltaX = touchStartXRef.current - touchCurrentXRef.current;
    const deltaY = touchStartYRef.current - touchCurrentYRef.current;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalSwipe && Math.abs(deltaX) >= MOBILE_SWIPE_THRESHOLD_PX) {
      didSwipeRef.current = true;
      resumeAutoAfterSwipeRef.current = true;
      setIsMobileTransitionEnabled(true);
      setMobileTrackIndex((prev) => (deltaX > 0 ? prev + 1 : prev - 1));
    } else {
      setIsAutoPlayPaused(false);
    }

    touchStartXRef.current = 0;
    touchCurrentXRef.current = 0;
    touchStartYRef.current = 0;
    touchCurrentYRef.current = 0;
    setTimeout(() => {
      didSwipeRef.current = false;
    }, 300);
  };

  const handleMobileTouchCancel = () => {
    setIsAutoPlayPaused(false);
    resumeAutoAfterSwipeRef.current = false;
    touchStartXRef.current = 0;
    touchCurrentXRef.current = 0;
    touchStartYRef.current = 0;
    touchCurrentYRef.current = 0;
  };

  const renderHeroItem = (hero, index, keyPrefix = 'hero') => {
    const imageSrc = resolveHeroImageUrl(BACKEND_URL, hero.imageUrl);
    const altText = hero.title || `Hero banner ${index + 1}`;
    const destinationUrl = String(hero.linkUrl || '').trim() || DEFAULT_HERO_TARGET_URL;
    const isExternal = /^https?:\/\//i.test(destinationUrl);

    const imageNode = (
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-auto block rounded-md"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        onContextMenu={(event) => event.preventDefault()}
        style={{
          userSelect: 'none',
          WebkitUserDrag: 'none',
          WebkitTouchCallout: 'none',
        }}
      />
    );

    return (
      <a
        key={`${keyPrefix}-${hero._id || imageSrc}-${index}`}
        href={destinationUrl}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={(event) => {
          if (didSwipeRef.current) {
            event.preventDefault();
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        style={{
          userSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {imageNode}
      </a>
    );
  };

  return (
    <section className="w-full lg:w-[92%] mx-auto px-1 sm:px-4">
      <div className="relative overflow-hidden lg:hidden">
        <div
          className={`${isMobileTransitionEnabled ? 'transition-transform duration-[900ms] ease-linear' : 'transition-none'} flex select-none`}
          style={{
            transform: `translateX(-${mobileTrackIndex * MOBILE_CARD_WIDTH_PERCENT}%)`,
            touchAction: 'pan-y',
          }}
          onTransitionEnd={handleMobileTransitionEnd}
          onTouchStart={handleMobileTouchStart}
          onTouchMove={handleMobileTouchMove}
          onTouchEnd={handleMobileTouchEnd}
          onTouchCancel={handleMobileTouchCancel}
          onContextMenu={(event) => event.preventDefault()}
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
