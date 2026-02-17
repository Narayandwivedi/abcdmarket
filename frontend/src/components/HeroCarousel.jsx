import React from 'react'

const HeroCarousel = () => {
  return (
    <section className="w-full md:w-1/2 md:mx-auto">
      <picture>
        <source media="(max-width: 767px)" srcSet="/onionmobile.webp" />
        <img
          src="/oniondesktop.webp"
          alt="ABCD Market Hero Banner"
          className="w-full h-auto block"
        />
      </picture>
    </section>
  )
}

export default HeroCarousel
