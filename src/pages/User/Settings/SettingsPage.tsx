import { Box, Grid, Stack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { useCurrentUserQuery } from "@/api/me";
import {
  useChangePasswordMutation,
  useUpdateFirmBrandThemeMutation,
  useUpdateLogoAllowedMutation,
  useUploadLogoMutation,
} from "@/api/settings";
import { performLogout } from "@/api/auth";

import { SettingsHeader } from "./components/SettingsHeader";
import { AccountSecuritySection } from "./components/AccountSecuritySection";
import { FirmBrandingSection } from "./components/FirmBrandingSection";
import { FirmLogoSection } from "./components/FirmLogoSection";

import { resolveRoleCode } from "@/shared/utils/role";

export const SettingsPage = () => {
  const { data: me } = useCurrentUserQuery();

  // API mutations
  const changePasswordMutation = useChangePasswordMutation();
  const updateBrandThemeMutation = useUpdateFirmBrandThemeMutation();
  const updateLogoAllowedMutation = useUpdateLogoAllowedMutation();
  const uploadLogoMutation = useUploadLogoMutation();

  // Change Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Branding state
  const [branding, setBranding] = useState({
    primaryColor: "",
    secondaryColor: "",
  });
  const [brandingErrors, setBrandingErrors] = useState<Record<string, string>>({});

  // Logo state
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoAllowed, setLogoAllowed] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (me?.firm) {
      setBranding({
        primaryColor: me.firm.brandPrimaryHex || "",
        secondaryColor: me.firm.brandSecondaryHex || "",
      });
      setLogoUrl(me.firm.logoUrl || null);
      setLogoAllowed(me.firm.logoAllowed || false);
    }
  }, [me]);

  // Validate hex color
  const isValidHexColor = (color: string): boolean => {
    const hexPattern = /^#?(?:[0-9a-fA-F]{6})$/;
    return hexPattern.test(color.trim());
  };

  const normalizeHexColor = (color: string): string => {
    const hex = color.trim().replace(/^#/, "");
    return `#${hex.toLowerCase()}`;
  };

  // Change Password handler
  const handleChangePassword = async () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (passwordForm.newPassword.length > 50) {
      errors.newPassword = "Password must be at most 50 characters";
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      errors.newPassword = "New password must differ from current password";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear auth state and redirect to login
      await performLogout();
    } catch (error: any) {
      const response = error.response?.data;
      if (response?.message) {
        if (response.message.includes("Current password is incorrect")) {
          setPasswordErrors({ currentPassword: response.message });
        } else if (response.message.includes("not used before")) {
          setPasswordErrors({ newPassword: response.message });
        }
      }
    }
  };

  // Save Branding handler
  const handleSaveBranding = async () => {
    const errors: Record<string, string> = {};

    if (branding.primaryColor && !isValidHexColor(branding.primaryColor)) {
      errors.primaryColor = "Invalid color format. Use #rrggbb";
    }
    if (branding.secondaryColor && !isValidHexColor(branding.secondaryColor)) {
      errors.secondaryColor = "Invalid color format. Use #rrggbb";
    }

    setBrandingErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const payload: Record<string, string> = {};
      if (branding.primaryColor) {
        payload.brandPrimaryHex = normalizeHexColor(branding.primaryColor);
      }
      if (branding.secondaryColor) {
        payload.brandSecondaryHex = normalizeHexColor(branding.secondaryColor);
      }

      await updateBrandThemeMutation.mutateAsync(payload);
    } catch (error: any) {
      const response = error.response?.data;
      if (response?.message) {
        if (response.message.includes("Invalid brand color")) {
          if (response.message.includes("primary")) {
            setBrandingErrors({ primaryColor: response.message });
          } else {
            setBrandingErrors({ secondaryColor: response.message });
          }
        }
      }
    }
  };

  // Toggle Logo Allowed handler
  const handleToggleLogoAllowed = async (details: { checked: boolean }) => {
    try {
      await updateLogoAllowedMutation.mutateAsync(details.checked);
      setLogoAllowed(details.checked);
    } catch (error: any) {
      // Mutation hook handles error toast
    }
  };

  // Logo file selection handler
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError(null);

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setLogoError("Logo must be an image (PNG, JPG, JPEG or WEBP)");
      return;
    }

    // Validate file size (200 KiB = 204800 bytes)
    if (file.size > 204800) {
      setLogoError("Logo must be at most 200 KiB");
      return;
    }

    setLogoFile(file);
  };

  // Upload Logo handler
  const handleUploadLogo = async () => {
    if (!logoFile) {
      setLogoError("Please select a logo file");
      return;
    }

    try {
      const response = await uploadLogoMutation.mutateAsync(logoFile);

      const newLogoUrl = response?.data?.data?.logoUrl;
      const newLogoAllowed = response?.data?.data?.logoAllowed;

      if (newLogoUrl) {
        setLogoUrl(newLogoUrl);
      }
      if (typeof newLogoAllowed === "boolean") {
        setLogoAllowed(newLogoAllowed);
      }

      setLogoFile(null);
      setLogoError(null);
    } catch (error: any) {
      const response = error.response?.data;
      if (response?.message) {
        setLogoError(response.message);
      } else {
        setLogoError("Failed to upload logo");
      }
    }
  };

  // Check if user can manage firm settings (FIRM_ADMIN)
  const canManageFirmSettings = resolveRoleCode(me?.role) === "FIRM_ADMIN";

  return (
    <Box p={{ base: 4, md: 8 }} mx="auto">
      <SettingsHeader />

      <Stack gap={8}>
        {/* Account Security & Firm Logo aligned horizontally on large screens */}
        {canManageFirmSettings ? (
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} alignItems="stretch">
            <AccountSecuritySection
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              passwordErrors={passwordErrors}
              showPasswords={showPasswords}
              setShowPasswords={setShowPasswords}
              onSubmit={handleChangePassword}
              isLoading={changePasswordMutation.isPending}
            />

            <FirmLogoSection
              logoUrl={logoUrl}
              logoAllowed={logoAllowed}
              logoFile={logoFile}
              logoError={logoError}
              onToggleAllowed={handleToggleLogoAllowed}
              onFileChange={handleLogoFileChange}
              onUpload={handleUploadLogo}
              isToggleLoading={updateLogoAllowedMutation.isPending}
              isUploadLoading={uploadLogoMutation.isPending}
            />
          </Grid>
        ) : (
          <AccountSecuritySection
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            passwordErrors={passwordErrors}
            showPasswords={showPasswords}
            setShowPasswords={setShowPasswords}
            onSubmit={handleChangePassword}
            isLoading={changePasswordMutation.isPending}
          />
        )}

        {/* Firm Branding Section */}
        {canManageFirmSettings && (
          <FirmBrandingSection
            branding={branding}
            setBranding={setBranding}
            brandingErrors={brandingErrors}
            onSave={handleSaveBranding}
            isLoading={updateBrandThemeMutation.isPending}
          />
        )}
      </Stack>
    </Box>
  );
};
