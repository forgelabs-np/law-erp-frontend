// DotMap.tsx
import { Box, GridItem, Icon, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { ArrowRightIcon } from "@/assets/svgs";

const routes = [
  {
    start: { x: 100, y: 150, delay: 0 },
    end: { x: 200, y: 80, delay: 2 },
    color: "#3b82f6",
  },
  {
    start: { x: 200, y: 80, delay: 2 },
    end: { x: 260, y: 120, delay: 4 },
    color: "#3b82f6",
  },
  {
    start: { x: 50, y: 50, delay: 1 },
    end: { x: 150, y: 180, delay: 3 },
    color: "#3b82f6",
  },
  {
    start: { x: 280, y: 60, delay: 0.5 },
    end: { x: 180, y: 180, delay: 2.5 },
    color: "#3b82f6",
  },
];

export const DotMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      setDimensions({ width, height });

      canvas.width = width;
      canvas.height = height;
    });

    resizeObserver.observe(canvas.parentElement);

    return () => resizeObserver.disconnect();
  }, []);

  // Animation
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gap = 12;
    const dots: { x: number; y: number; opacity: number }[] = [];

    for (let x = 0; x < dimensions.width; x += gap) {
      for (let y = 0; y < dimensions.height; y += gap) {
        const w = dimensions.width;
        const h = dimensions.height;

        const inMap =
          (x < w * 0.25 && x > w * 0.05 && y < h * 0.4 && y > h * 0.1) ||
          (x < w * 0.25 && x > w * 0.15 && y < h * 0.8 && y > h * 0.4) ||
          (x < w * 0.45 && x > w * 0.3 && y < h * 0.35 && y > h * 0.15) ||
          (x < w * 0.5 && x > w * 0.35 && y < h * 0.65 && y > h * 0.35) ||
          (x < w * 0.7 && x > w * 0.45 && y < h * 0.5 && y > h * 0.1) ||
          (x < w * 0.8 && x > w * 0.65 && y < h * 0.8 && y > h * 0.6);

        if (inMap && Math.random() > 0.3) {
          dots.push({
            x,
            y,
            opacity: Math.random() * 0.5 + 0.1,
          });
        }
      }
    }

    let animationFrameId: number;
    let startTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw dots
      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${dot.opacity})`;
        ctx.fill();
      });

      const currentTime = (Date.now() - startTime) / 1000;

      // Draw routes
      routes.forEach((route) => {
        const elapsed = currentTime - route.start.delay;
        if (elapsed <= 0) return;

        const progress = Math.min(elapsed / 3, 1);

        const x = route.start.x + (route.end.x - route.start.x) * progress;
        const y = route.start.y + (route.end.y - route.start.y) * progress;

        // Line
        ctx.beginPath();
        ctx.moveTo(route.start.x, route.start.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Start point
        ctx.beginPath();
        ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = route.color;
        ctx.fill();

        // Moving point
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#60a5fa";
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.3)";
        ctx.fill();

        // End point
        if (progress === 1) {
          ctx.beginPath();
          ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = route.color;
          ctx.fill();
        }
      });

      if (currentTime > 15) {
        startTime = Date.now();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <Box position="relative" w="full" h="full" overflow="hidden">
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
};

export const TravelConnectSidePanel = () => {
  return (
    <GridItem position="relative" overflow="hidden" minH="500px">
      {/* Background */}
      <Box position="absolute" inset={0}>
        <DotMap />
      </Box>

      {/* Overlay Content */}
      <Stack
        position="absolute"
        inset={0}
        align="center"
        justify="center"
        p={8}
        gap={4}
        zIndex={1}
      >
        <Box
          h="48px"
          w="48px"
          borderRadius="full"
          bg="linear-gradient(135deg, #3b82f6, #6366f1)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon color="white" boxSize={6}>
            <ArrowRightIcon />
          </Icon>
        </Box>

        <Text
          fontSize="2xl"
          fontWeight={700}
          textAlign="center"
          bgGradient="linear(to-r, blue.300, indigo.400)"
          bgClip="text"
        >
          CRM
        </Text>

        <Text fontSize="sm" textAlign="center" color="gray.500" maxW="xs">
          Sign in to access your global travel dashboard and connect with nomads
          worldwide
        </Text>
      </Stack>
    </GridItem>
  );
};
