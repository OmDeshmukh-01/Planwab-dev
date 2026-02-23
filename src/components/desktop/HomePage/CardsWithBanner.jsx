import React from 'react';
import SmartMedia from '../SmartMediaLoader';

const CardsWithBanner = ({ 
  heading, 
  backgroundImage, 
  contentSide = 'right', // Options: 'left' or 'right'
  cards = [] 
}) => {

  // Logic to determine alignment class
  const alignmentClass = contentSide === 'left' ? 'justify-start' : 'justify-end';

  return (
    <section 
      className={`relative w-full min-h-[480px] bg-cover bg-no-repeat bg-center flex items-center px-4 sm:px-8 lg:px-16 py-10 mb-16`}
      style={{ 
        backgroundImage: `url("${backgroundImage}")`,
        backgroundColor: 'rgb(234, 249, 249)' // Fallback color from source
      }}
    >
      {/* Alignment Container */}
      <div className={`w-full flex ${alignmentClass}`}>
        
        {/* Content Wrapper (Takes up about 55% of width on desktop, full on mobile) */}
        <div className="w-full md:w-3/4 lg:w-[58%]">
          
          {/* Optional Heading */}
          {heading && (
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-1">
              {heading}
            </h2>
          )}

          {/* Cards Grid - 4 Columns exactly like source */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cards.map((item, index) => (
              <a 
                key={index} 
                href={item.link || "#"}
                className="bg-white rounded-lg p-2.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center cursor-pointer h-full"
              >
                {/* Image Box */}
                <div className="w-full aspect-[4/3] rounded overflow-hidden mb-2.5 bg-gray-100">
                  <SmartMedia 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    useSkeleton={true}
                  />
                </div>

                {/* Text Box */}
                <p className="text-[13px] font-medium text-gray-900 leading-tight line-clamp-2">
                  {item.title}
                </p>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CardsWithBanner;