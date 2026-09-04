import {
  Box,
  HStack,
  Image,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useCurrentUser } from "@/shared/hooks/useAuth";
import TokenService from "@/shared/service/service-token";

const handleLogout = () => {
  TokenService.clearToken();
  window.location.href = "/auth/login";
};

interface SidebarProfileProps {
  isCollapsed?: boolean;
}

export const SidebarProfile = ({ isCollapsed = false }: SidebarProfileProps) => {
  const user = useCurrentUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Reset the image fallback whenever the profile photo changes, and close
  // the dropdown on navigation so it never lingers after a route change.
  useEffect(() => {
    setImageFailed(false);
  }, [user?.profilePhotoUrl]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (!user) {
    return null;
  }

  const username = user.username ?? user.email ?? "User";
  const profilePhotoUrl = user.profilePhotoUrl || null;
  const roleValue = user.role;
  const roleName =
    (typeof roleValue === "string" && roleValue
      ? roleValue
      : roleValue?.name || roleValue?.code || user.userType) || "";
  const initial = (username || "U").charAt(0).toUpperCase();
  const showPhoto = Boolean(profilePhotoUrl) && !imageFailed;

  return (
    <Box
      flexShrink="0"
      width="full"
      borderTop="1px"
      borderTopColor="gray.200"
    >
      <MenuRoot
        open={isMenuOpen}
        onOpenChange={(details) => setIsMenuOpen(details.open)}
        positioning={{ placement: "top-start", gutter: 6 }}
      >
        <MenuTrigger asChild>
          <HStack
            as="button"
            aria-label={`Open user menu for ${username}`}
            width="full"
            minH="48px"
            gap="2.5"
            px={isCollapsed ? "0" : "2.5"}
            py="2"
            borderRadius="10px"
            cursor="pointer"
            background={isMenuOpen ? "gray.100" : "transparent"}
            _hover={{ background: "gray.100" }}
            _active={{ background: "gray.200" }}
            transition="background 0.15s"
            justifyContent={isCollapsed ? "center" : "flex-start"}
          >
            {/* Avatar / profile photo */}
            <Box
              position="relative"
              flexShrink="0"
              boxSize="26px"
              borderRadius="full"
              overflow="hidden"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={showPhoto ? "transparent" : "primary.500"}
              color="white"
            >
              {showPhoto ? (
                <Image
                  src={profilePhotoUrl as string}
                  alt={`${username} profile photo`}
                  boxSize="full"
                  objectFit="cover"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <Text fontSize="14px" fontWeight="600" lineHeight="1">
                  {initial}
                </Text>
              )}
            </Box>

            {!isCollapsed && (
              <>
                <Box minW="0" flex="1" textAlign="left" lineHeight="1.25">
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.800"
                    lineClamp={1}
                  >
                    {username}
                  </Text>
                  {roleName && (
                    <Text fontSize="10px" color="gray.500" lineClamp={1}>
                      {roleName}
                    </Text>
                  )}
                </Box>
                <Box
                  flexShrink="0"
                  color="gray.400"
                  transform={isMenuOpen ? "rotate(180deg)" : undefined}
                  transition="transform 0.2s ease"
                >
                  <ChevronDown size={15} />
                </Box>
              </>
            )}
          </HStack>
        </MenuTrigger>

        <Portal>
          <MenuPositioner zIndex="1400">
            <MenuContent
              minWidth="0"
              width="240px"
              maxWidth="calc(100vw - 16px)"
              borderRadius="12px"
              borderColor="gray.200"
              boxShadow="0 4px 16px rgba(0, 0, 0, 0.08)"
              py="1"
            >
              <Box
                px="3"
                py="2"
                textAlign="left"
                lineHeight="1.25"
                borderBottom="1px"
                borderBottomColor="gray.100"
              >
                <Text fontSize="sm" fontWeight="600" color="gray.800" lineClamp={1}>
                  {username}
                </Text>
                {roleName && (
                  <Text fontSize="xs" color="gray.500" lineClamp={1}>
                    {roleName}
                  </Text>
                )}
              </Box>
              <MenuItem
                value="logout"
                cursor="pointer"
                borderRadius="8px"
                mx="1"
                onClick={handleLogout}
              >
                <HStack gap="2.5" width="full">
                  <LogOut size={15} />
                  <Text fontSize="sm">Log Out</Text>
                </HStack>
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    </Box>
  );
};
