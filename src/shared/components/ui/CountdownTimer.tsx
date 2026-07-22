import { Text, TextProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useTemporaryAuthStore } from "@/store/temporaryAuthStore";

interface CountdownTimerProps extends TextProps {
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  onExpire,
  ...rest
}) => {
  const expiresAt = useTemporaryAuthStore((state) => state.expiresAt);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0 && onExpire) {
        onExpire();
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt || timeLeft <= 0) {
    return <Text color="red.500" fontWeight="bold" {...rest}>Expired</Text>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <Text color="orange.500" fontWeight="bold" {...rest}>
      {formattedTime}
    </Text>
  );
};
