"use client";

import React from "react";
import clsx from "clsx";
import SmartMedia from "./SmartMediaLoader";

export default function CarouselHeader({
  title = "Section title",
  description = "Section description goes here.",
  buttonText = "View more",
  buttonLink = "#",
  imageSrc,
  imageAlt = "banner image",
  contentSide = "left", // left | right
}) {
  const isRight = contentSide === "right";

  return (
    <section className="mx-auto w-full">
      <div className={`relative max-w-7xl mx-auto px-4 flex items-center ${contentSide === "right" ? "justify-start" : "justify-end"}`}>
        {/* Image */}
        <div className="w-[70%] h-[260px] md:h-[300px] rounded-2xl overflow-hidden">
          <SmartMedia 
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            useSkeleton={true}
          />
        </div>

        {/* Floating Card */}
        <div
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 h-[80%] w-[90%] md:w-[480px]",
            isRight ? "right-8" : "left-6"
          )}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 h-full flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {title}
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {description}
            </p>

            <a
              href={buttonLink}
              className="inline-block w-full text-center mt-5 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-3 rounded-lg transition"
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
