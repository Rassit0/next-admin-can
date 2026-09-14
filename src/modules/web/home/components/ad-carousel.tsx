"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicBanner } from "@/modules/web/banners/actions/banners.action";
import { Magnetic } from "@/modules/web/shared/components/magnetic";

interface AdCarouselProps {
  banners?: PublicBanner[];
  autoPlayInterval?: number;
  onSlideChange?: (slide: PublicBanner) => void;
}

export function AdCarousel({ 
  banners = [],
  autoPlayInterval = 8000,
  onSlideChange 
}: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  const slideCount = banners.length;
  const current = banners[currentIndex];

  // Manage progress bar and auto-advance
  useEffect(() => {
    if (slideCount === 0) return;
    if (isHovering) {
      // Pause on hover
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      return;
    }

    // Progress bar animation (5 seconds per slide)
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (5000 / 50); // 5 sec interval
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [isHovering, slideCount]);

  const handleNext = () => {
    if (slideCount === 0) return;
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % slideCount);
    setProgress(0);
    onSlideChange?.(banners[(currentIndex + 1) % slideCount]);
  };

  const handlePrev = () => {
    if (slideCount === 0) return;
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
    setProgress(0);
    onSlideChange?.(banners[(currentIndex - 1 + slideCount) % slideCount]);
  };

  const handleDotClick = (index: number) => {
    if (slideCount === 0) return;
    if (index > currentIndex) setDirection("right");
    if (index < currentIndex) setDirection("left");
    setCurrentIndex(index);
    setProgress(0);
    onSlideChange?.(banners[index]);
  };

  if (!banners || slideCount === 0 || !current) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-oxford aspect-3/4 sm:aspect-square lg:aspect-video landscape:aspect-video max-h-[85vh]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background slides with parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          initial={{
            opacity: 0,
            scale: direction === "right" ? 1.1 : 0.9,
            x: direction === "right" ? 100 : -100,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            scale: direction === "right" ? 0.9 : 1.1,
            x: direction === "right" ? -100 : 100,
          }}
          transition={{
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1], // elastic acceleration
          }}
          className="absolute inset-0"
        >
          {/* Mobile Image 3:4 */}
          <Image
            src={current.image3x4 || current.image16x9}
            alt={current.title}
            fill
            priority
            className="object-cover block sm:hidden landscape:hidden"
          />
          {/* Tablet Image 1:1 */}
          <Image
            src={current.image1x1 || current.image16x9}
            alt={current.title}
            fill
            priority
            className="hidden object-cover sm:block lg:hidden landscape:hidden"
          />
          {/* Desktop / Landscape Image 16:9 */}
          <Image
            src={current.image16x9}
            alt={current.title}
            fill
            priority
            className="hidden object-cover lg:block landscape:block"
          />
          <div className="absolute inset-0 bg-linear-to-t from-oxford/90 via-oxford/50 to-transparent lg:hidden landscape:hidden" />
          <div className="absolute inset-0 hidden lg:block landscape:block bg-linear-to-l from-oxford/90 via-oxford/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay with staggered parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex h-full w-full flex-col px-6 sm:px-10 lg:px-20 landscape:px-16 pb-24 sm:pb-28 lg:pb-0 landscape:pb-0 justify-end lg:justify-center landscape:justify-center items-center lg:items-end landscape:items-end"
        >
          <div className="flex flex-col items-center text-center max-w-lg lg:max-w-2xl landscape:max-w-lg">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-2 sm:mb-4 lg:mb-6"
            >
              <Image
                src="/logo.png"
                alt="CAN"
                width={100}
                height={100}
                className="h-auto w-16 sm:w-20 lg:w-24 landscape:w-14 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              />
            </motion.div>

            {/* Category badge / Ribbon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-2 sm:mb-4 inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-sm bg-neon px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-900 uppercase tracking-widest text-oxford shadow-lg landscape:mb-2"
            >
              {current.category}
            </motion.div>

            {/* Title - parallax entrance */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-heading text-3xl font-900 uppercase leading-[1.05] tracking-tighter text-white text-balance sm:text-5xl lg:text-6xl landscape:text-2xl landscape:sm:text-4xl [text-shadow:0_4px_30px_rgb(0_0_0/80%)]"
            >
              {current.title}
            </motion.h2>

            {/* CTA Button - magnetic effect on hover */}
            {current.redirectTo && current.ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-4 sm:mt-8 landscape:mt-3"
              >
                <Link href={current.redirectTo} className="w-fit inline-block">
                  <Magnetic as="div" className="w-fit">
                    <button className="neon-perimeter flex items-center gap-2 sm:gap-3 rounded-full bg-neon px-6 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-600 uppercase tracking-wide text-oxford transition-all hover:shadow-neon">
                      {current.ctaText}
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </Magnetic>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows - slide on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-y-0 left-4 flex items-center sm:left-6"
      >
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-y-0 right-4 flex items-center sm:right-6"
      >
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Dynamic Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-neon/30"
        initial={{ width: "0%" }}
      >
        <motion.div
          className="h-full bg-linear-to-r from-neon via-neon to-neon/80 shadow-neon"
          animate={{ width: `${progress}%` }}
          transition={{ type: "tween", duration: 0.05 }}
        />
      </motion.div>

      {/* Dot Navigation - pulse on current */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:gap-2.5">
        {banners.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              idx === currentIndex
                ? "w-8 bg-neon shadow-neon"
                : "w-2.5 bg-white/30 hover:bg-white/50"
            }`}
            animate={
              idx === currentIndex
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(255, 0, 150, 0.4)",
                      "0 0 0 8px rgba(255, 0, 150, 0)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}
