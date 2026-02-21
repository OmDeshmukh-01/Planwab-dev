import React, { memo } from "react";
import SmartMedia from "../SmartMediaLoader";

// 1. Static Data Extraction
const BENEFITS = [
  {
    id: 1,
    title: "Exclusive Deals",
    description: "Best deals made only for you tailored to your preferences.",
    image: "https://www.theweddingcompany.com/images/HomePageRevamp/benefits/gift.webp",
    // Preserving the specific transforms from your original code
    transformStyle: { transform: "rotate(10deg)" },
  },
  {
    id: 2,
    title: "Expert Insights",
    description: "Our wedding experts know how to craft the best for you.",
    image: "https://www.theweddingcompany.com/images/HomePageRevamp/benefits/bulb.webp",
    transformStyle: { transform: "rotate(-10deg)" },
  },
  {
    id: 3,
    title: "Stress-free Experience",
    description: "From venue recce to last second of your wedding, we’ll be with you.",
    image: "https://www.theweddingcompany.com/images/HomePageRevamp/benefits/lady.webp",
    transformStyle: { transform: "translateY(-6px)" },
  },
];

// 2. Memoized Sub-Component for individual cards
const BenefitCard = memo(({ data }) => (
  <div className="flex items-center rounded-r-xl py-4 shadow-[0_15px_30px_0_#A1C8B733] md:max-w-[320px] md:flex-col md:rounded-b-xl md:rounded-tr-none md:px-4 md:bg-[linear-gradient(180deg,#F0F7F4_0%,#FFF_100%)] bg-[linear-gradient(90deg,#F0F7F4_11.36%,#FFFFFF_100%)]">
    {/* Image Wrapper with specific Transform */}
    <div style={data.transformStyle} className="shrink-0">
      <SmartMedia
        src={data.image}
        type="image"
        className="md:h-[145px] md:w-[145px] w-[90px] h-[90px] object-contain"
        loaderImage="/GlowLoadingGif.gif"
        width={145}
        height={145}
        alt={data.title}
        loading="lazy"
      />
    </div>

    <div className="flex flex-col px-4 md:items-center md:px-2">
      <p className="text-lg font-bold md:pb-1 md:text-2xl text-gray-900">{data.title}</p>
      <p className="pb-4 text-base text-gray-600 md:text-center md:text-lg leading-snug">{data.description}</p>
    </div>
  </div>
));

const WhyWeBetter = () => {
  return (
    <section className="w-full relative pb-4" id="why_are_we_better_section">
      {/* Top Curve SVG - Pure decorative, standard img is fine but added lazy */}
      <div className="w-full overflow-hidden leading-none">
        <img
          alt=""
          loading="lazy"
          width="360"
          height="30"
          className="w-full max-h-24 rotate-180 object-cover object-bottom"
          src="https://www.theweddingcompany.com/images/HomePage/new/green-curve.svg"
          aria-hidden="true"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-5 pb-4 md:px-0 md:pb-12">
        {/* Header Text */}
        <div className="text-center w-[100vw] bg-[#F0F7F4]">
          <h2 className="pb-2 font-serif text-3xl font-semibold text-[#121212] md:pb-4 lg:text-5xl">
            Why are we better?
          </h2>
          <p className="mb-4 mt-2 text-base text-gray-600 md:text-xl leading-relaxed">
            Because we bring our years of{" "}
            <span className="hidden lg:inline">
              <br />
            </span>
            experience in planning your wedding.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-y-4 py-4 md:grid-cols-2 bg-white md:gap-x-4 md:py-7 lg:grid-cols-3 lg:gap-x-10 2xl:gap-x-12 w-full max-w-7xl">
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.id} data={benefit} />
          ))}
        </div>
      </div>

      {/* Bottom Curve SVG */}
      <div className="absolute inset-x-0 bottom-15 z-50 translate-y-full pointer-events-none">
        <div className="relative w-full overflow-hidden leading-none">
          <img
            src="https://www.theweddingcompany.com/images/HomePage/new/green-curve.svg"
            alt=""
            loading="lazy"
            width={100}
            height={8}
            className="w-full max-h-24 object-cover object-bottom"
            style={{ color: "transparent" }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

// 4. Memoize the main component to prevent re-renders from parent state changes
export default memo(WhyWeBetter);
