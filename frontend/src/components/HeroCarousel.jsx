import React from 'react'

const HeroCarousel = () => {
  return (
    <section className="w-full md:w-[70%] lg:w-[43%] mx-auto px-4 md:px-0">
      <div className="grid grid-cols-2 gap-3 md:gap-5 items-center">
        <img
          src="/banana.png"
          alt="Banana Hero Banner"
          className="w-full lg:w-[80%] h-auto block mx-auto"
        />
        <img
          src="/onion.png"
          alt="Onion Hero Banner"
          className="w-full lg:w-[80%] h-auto block mx-auto"
        />
      </div>
    </section>
  )
}

export default HeroCarousel
