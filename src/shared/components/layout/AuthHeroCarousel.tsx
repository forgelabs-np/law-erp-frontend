import { Box, Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { Logo } from "@/assets/images";
import { AUTH_HERO_BRAND, AUTH_HERO_SLIDES } from "@/shared/constants";

/** How long each slide stays on screen before the next one fades in. */
export const AUTH_HERO_SLIDE_INTERVAL_MS = 4500;

export type AuthHeroTone = "light" | "dark";

interface AuthHeroCarouselProps {
  /**
   * Only affects the caption colour. The panel background itself is owned by
   * the auth layout, which renders a light surface in both variants.
   */
  tone?: AuthHeroTone;
}

const FADE_IN = { duration: 0.35, ease: "easeOut" } as const;
const FADE_OUT = { duration: 0.18, ease: "easeIn" } as const;
/** Reduced motion: swap slides with no transition at all. */
const INSTANT = { duration: 0 } as const;

interface SlideCaptionProps {
  title: string;
  description: string;
  color?: string;
}

/** Heading + description unit for one slide. */
const SlideCaption = ({ title, description, color }: SlideCaptionProps) => (
  <Stack align="center" gap={2} textAlign="center" width="100%">
    <Text textStyle="heading_5" color={color}>
      {title}
    </Text>
    <Text
      textStyle="paragraph_regular"
      textAlign="center"
      opacity={0.64}
      color={color}
    >
      {description}
    </Text>
  </Stack>
);

/**
 * AuthHeroCarousel — the shared right-side hero used by every auth page.
 *
 * Owns a single active-slide index; the illustration and its caption always
 * come from the same entry in `AUTH_HERO_SLIDES`, so they can never drift.
 *
 * - The illustration is a large, unframed SVG that sits directly on the panel
 *   background. Its box is sized as a square share of the panel width, so the
 *   artwork reads at roughly 65–75% of the panel width while
 *   `object-fit: contain` keeps every aspect ratio intact.
 * - The box size is fixed for a given viewport and the caption block is sized
 *   by invisible copies of every slide, so changing slides never shifts layout.
 * - Slides cross-fade with `mode="wait"`, so a previous caption is never shown
 *   together with the next illustration.
 * - When the user prefers reduced motion the auto-rotation is switched off
 *   entirely and slides swap instantly; the dots still let the user step
 *   through every slide.
 */
export const AuthHeroCarousel = ({ tone = "light" }: AuthHeroCarouselProps) => {
  const slideCount = AUTH_HERO_SLIDES.length;
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || slideCount < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, AUTH_HERO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, slideCount]);

  const slide = AUTH_HERO_SLIDES[activeIndex];
  const captionColor = tone === "dark" ? "white" : undefined;
  const fadeIn = prefersReducedMotion ? INSTANT : FADE_IN;
  const fadeOut = prefersReducedMotion ? INSTANT : FADE_OUT;

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Stack gap={{ base: 4, lg: 5 }} align="center" width="100%">
        {/* Brand lockup + tagline — static, above the rotating illustration. */}
        <Stack align="center" gap={2} width="100%" data-probe="auth-hero-brand">
          <HStack gap={3} align="center" justify="center">
            <Image
              src={Logo}
              alt={AUTH_HERO_BRAND.name}
              height="40px"
              width="auto"
            />
            <Text
              fontSize={{ base: "2xl", lg: "3xl" }}
              fontWeight="700"
              color="gray.900"
              lineHeight="1.1"
            >
              {AUTH_HERO_BRAND.name}
            </Text>
          </HStack>

          <Text
            fontSize={{ base: "sm", lg: "md" }}
            color="gray.600"
            textAlign="center"
            lineHeight="1.6"
            maxW="440px"
            data-probe="auth-hero-tagline"
          >
            {AUTH_HERO_BRAND.tagline}
          </Text>
        </Stack>

        {/*
          Illustration — unframed, directly on the panel background (no card,
          no shadow, no border). The box is a fixed square share of the panel
          width so slides can never resize it, and `object-fit: contain`
          preserves each SVG's aspect ratio without cropping or distortion.
        */}
        <Box
          position="relative"
          width={{ base: "86%", md: "74%", lg: "74%" }}
          maxW="760px"
          aspectRatio="1 / 1"
          maxH={{ base: "52vh", md: "52vh", lg: "calc(100vh - 360px)" }}
          data-probe="auth-hero-illustration"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              draggable={false}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: fadeOut }}
              transition={fadeIn}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </AnimatePresence>
        </Box>

        {/* Caption — invisible copies size the block; the active one animates. */}
        <Box
          display="grid"
          width="100%"
          maxW="640px"
          mx="auto"
          data-probe="auth-hero-caption"
        >
          {AUTH_HERO_SLIDES.map((item) => (
            <Box key={item.id} gridArea="1 / 1" visibility="hidden">
              <SlideCaption
                title={item.title}
                description={item.description}
                color={captionColor}
              />
            </Box>
          ))}

          <Box gridArea="1 / 1" position="relative" width="100%">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: fadeOut }}
                transition={fadeIn}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SlideCaption
                  title={slide.title}
                  description={slide.description}
                  color={captionColor}
                />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>

        {/* Indicator — one dot per slide, active dot is wider and opaque. */}
        <HStack gap={2} justify="center">
          {AUTH_HERO_SLIDES.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <Button
                key={item.id}
                aria-label={`Show slide ${index + 1} of ${slideCount}: ${item.title}`}
                aria-current={isActive}
                onClick={() => goToSlide(index)}
                minW={0}
                h="5px"
                w={isActive ? "18px" : "5px"}
                p={0}
                borderRadius="full"
                bg="primary.500"
                opacity={isActive ? 1 : 0.28}
                transition="all 0.3s ease"
                _hover={{ opacity: 1 }}
              />
            );
          })}
        </HStack>
      </Stack>
    </MotionConfig>
  );
};

export default AuthHeroCarousel;
