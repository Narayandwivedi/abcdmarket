import React from 'react'

const HeroCarousel = () => {
  return (
    <section className="w-full md:w-[55%] lg:w-[90%] md:mx-auto">
      <picture>
        <source media="(max-width: 767px)" srcSet="/onion3.png" />
        <img
          src="/onion3.png"
          alt="ABCD Market Hero Banner"
          className="w-full h-auto block"
        />
      </picture>
    </section>
  )
}

export default HeroCarousel
