import { Badge, Box, Button, Portal } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";

import { useUnreadCountQuery } from "@/api/notifications";
import { useCurrentUser } from "@/shared/hooks/useAuth";
import { NotificationPanel } from "./NotificationPanel";
import { formatNotificationCount } from "./utils";

export const NotificationBell = () => {
  const user = useCurrentUser();
  const isAuthenticated = Boolean(user);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadCountQuery({
    enabled: isAuthenticated,
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close panel on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (!isAuthenticated) return null;

  return (
    <Box position="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="sm"
        p="2"
        borderRadius="lg"
        position="relative"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: "gray.100" }}
      >
        <Bell
          size={20}
          color={
            unreadCount > 0
              ? "var(--chakra-colors-blue-600)"
              : "var(--chakra-colors-gray-500)"
          }
        />
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="2"
            right="2"
            bg="red.500"
            color="white"
            fontSize="10px"
            borderRadius="full"
            minW="18px"
            h="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="600"
            lineHeight="1"
            px="1"
          >
            {formatNotificationCount(unreadCount)}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Portal>
          <NotificationPanel unreadCount={unreadCount} onClose={handleClose} />
        </Portal>
      )}
    </Box>
  );
};
