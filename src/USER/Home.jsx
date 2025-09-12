import React from "react";
import Navbar from "./Navbar";

function Home() {
  return (
    <>
      
      <div className="h-170 bg-[url('https://static.vecteezy.com/system/resources/previews/050/133/205/non_2x/cozy-corner-of-a-children-s-playroom-featuring-a-cheerful-yellow-teddy-bear-and-colorful-toys-free-photo.jpeg')] bg-cover bg-center">
        <div className="flex flex-col items-center justify-center text-center h-full px-4 bg-black/40">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-md">
            PLAYTOPIA
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-200 max-w-2xl">
            Welcome to  Playtopia
          </p>
        </div>
      </div>

     
      <div className="right-0  px-6 sm:px-12 lg:px-24 py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans text-center mb-8">
          About Playtopia
        </h1>
        <p className="text-base sm:text-lg lg:text-2xl leading-relaxed text-gray-700 text-justify">
          Welcome to Playtopia, your premium destination for toy vehicles that redefine the joy of play and collecting. 
          At Playtopia, we specialize exclusively in high-quality miniature vehicles designed for children, enthusiasts, 
          and collectors who appreciate detail, durability, and creativity. We believe vehicles are more than just toys – 
          they are symbols of adventure, imagination, and limitless journeys. 
          <br /><br />
          Every product in our collection is carefully handpicked to ensure exceptional craftsmanship, realistic design, 
          and safe play. From sleek die-cast sports cars and rugged construction trucks to stylish motorcycles and powerful airplanes, 
          Playtopia brings together a world of motion and excitement in one place. 
          <br /><br />
          Our goal is to provide not just toys, but premium experiences that inspire young racers, budding engineers, 
          and passionate collectors alike. With a strong commitment to quality, authenticity, and customer satisfaction, 
          Playtopia is more than just a shop – it’s a community for those who love the thrill of wheels, wings, and engines. 
          Step into Playtopia, where every vehicle tells a story, every collection becomes a treasure, and every child’s imagination 
          finds the road to endless adventures.
        </p>
      </div>
    </>
  );
}

export default Home;
