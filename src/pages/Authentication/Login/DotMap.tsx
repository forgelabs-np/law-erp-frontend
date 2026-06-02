import { Box, GridItem, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { MdLockPerson } from "react-icons/md";
import { FaScaleUnbalancedFlip } from "react-icons/fa6";
import { SupremeCourtImage } from "@/assets/images";

// ── Rotating legal quotes ────────────────────────────────────────────────────
const QUOTES = [
  { text: "Justice is the constant and perpetual will to allot every man his due.", author: "Justinian I" },
  { text: "The law is reason, free from passion.", author: "Aristotle" },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
];

const RotatingQuote = () => {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const authorRef = useRef<HTMLSpanElement | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    const set = (i: number) => {
      const q = QUOTES[i];
      if (textRef.current) textRef.current.textContent = `"${q.text}"`;
      if (authorRef.current) authorRef.current.textContent = `— ${q.author}`;
    };
    set(0);
    const iv = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % QUOTES.length;
      [textRef, authorRef].forEach(r => {
        if (r.current) r.current.style.opacity = "0";
      });
      setTimeout(() => {
        set(idxRef.current);
        [textRef, authorRef].forEach(r => {
          if (r.current) r.current.style.opacity = "1";
        });
      }, 600);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <Stack gap="3" align="center" maxW="360px">
      {/* opening quote mark */}
      {/* <Text style={{
        fontFamily: "'Georgia', serif",
        fontSize: "48px",
        lineHeight: "0.5",
        color: "#ffffff",
        opacity: 0.6,
        alignSelf: "flex-start",
        marginLeft: "8px",
      }}>
        "
      </Text> */}
      <p ref={textRef} style={{
        color: "rgba(255,255,255,0.88)",
        fontSize: "18.5px",
        lineHeight: "1.75",
        textAlign: "center",
        fontStyle: "italic",
        fontFamily: "'Georgia', serif",
        transition: "opacity 0.6s ease",
        margin: "0 0 4px",
        minHeight: "50px",
      }} />
      <span ref={authorRef} style={{
        color: "#4ade80",
        fontSize: "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontFamily: "'Georgia', serif",
        transition: "opacity 0.6s ease",
      }} />
    </Stack>
  );
};

// ── Feature pills ────────────────────────────────────────────────────────────
const PILLARS = [
  { label: "Case Management", icon: <FaScaleUnbalancedFlip /> },
  { label: "Client Records",  icon: <FaFileInvoice /> },
  { label: "Secure & Private", icon: <MdLockPerson /> },
];

// ── Main export ──────────────────────────────────────────────────────────────
export const TravelConnectSidePanel = () => {
  return (
    <GridItem
      position="relative"
      overflow="hidden"
      minH="500px"
    >
      <Box position="absolute" inset={0}>
        <img
          src={SupremeCourtImage}
          alt="Supreme Court"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
      </Box>

      {/* ── Multi-layer overlay for depth ── */}
      {/* Base dark scrim */}
      <Box
        position="absolute"
        inset={0}
        style={{ background: "rgba(5, 20, 12, 0.72)" }}
      />
      {/* Green gradient from bottom */}
      <Box
        position="absolute"
        inset={0}
        
        style={{
          background: "linear-gradient(to top, rgba(13,105,68,0.55) 0%, transparent 55%)",
        }}
      />
      {/* Vignette edges */}
      <Box
        position="absolute"
        inset={0}
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {/* Top fade to near-black */}
      <Box
        position="absolute"
        inset={0}
        style={{
          background: "linear-gradient(to bottom, rgba(5,20,12,0.5) 0%, transparent 30%)",
        }}
      />

      {/* ── Content ── */}
      <Stack
        position="absolute"
        inset={0}
        align="center"
        justify="space-between"
        p="0"
        zIndex={1}
      >
        {/* Top: Wordmark bar */}
        <Box
          width="full"
          px="8"
          pt="8"
          pb="5"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Stack align="center" gap="2">
            <Text style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Georgia', serif",
            }}>
              Established Practice
            </Text>
            <Text style={{
              fontFamily: "'Georgia', serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.08em",
              lineHeight: 1.2,
            }}>
              Law Firm <span style={{ color: "#62f15d" }}>CRM</span>
            </Text>
          </Stack>
        </Box>

        {/* Middle: Quote */}
        <Box px="8" flex="1" display="flex" alignItems="center" justifyContent="center">
          <RotatingQuote />
        </Box>

        {/* Bottom: Feature pills */}
       {/* Bottom: Feature cards */}
<Box
  width="full"
  px="5"
  pt="5"
  pb="6"
  // style={{
  //   borderTop: "1px solid rgba(255,255,255,0.08)",
  //   background: "rgba(0,0,0,0.25)",
  //   backdropFilter: "blur(8px)",
  // }}
>
  <Stack direction="row" gap="3" justify="center">
    {PILLARS.map(({ label, icon }) => (
      <Box
        key={label}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          // padding: "16px 12px 14px",
          padding: "4px",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "8px",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(4px)",
          flex: 1,
          maxWidth: "180px",
        }}
      >
        {/* Icon circle */}
        <Box
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1.5px solid rgba(248, 248, 248, 0.5)",
            background: "rgba(13,105,68,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4ade80",
            fontSize: "15px",
          }}
        >
          {icon}
        </Box>

        {/* Label */}
        <Text style={{
          fontSize: "9px",
          color:"white",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.4,
        }}>
          {label}
        </Text>

        {/* Short description */}
        <Text style={{
          fontSize: "9.5px",
          color: "rgba(255,255,255,0.45)",
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          {
            label === "Case Management"
              ? "Track cases, deadlines and important updates"
              : label === "Client Records"
              ? "Centralize client information and communication"
              : "Your data is protected with enterprise-grade security"
          }
        </Text>

        {/* Bottom accent line */}
        {/* <Box style={{
          width: "24px",
          height: "2px",
          borderRadius: "1px",
          background: "#0D6944",
          marginTop: "2px",
        }} /> */}
      </Box>
    ))}
  </Stack>
</Box>
      </Stack>
    </GridItem>
  );
};