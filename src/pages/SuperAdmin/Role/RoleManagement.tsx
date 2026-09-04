import { Box, Stack, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";

import RolesTab from "./component/RolesTab";
import UserAssignmentsTab from "./component/UserAssignmentsTab";

const RoleManagement = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Stack gap={6} padding={2}>
      {/* Page Header */}
      <Stack gap={2}>
        <Text textStyle="heading_4">Role Management</Text>
        <Text textStyle="paragraph_regular" color="gray.500">
          Manage user roles and permissions
        </Text>
      </Stack>

      <Tabs.Root
        value={activeTab}
        onValueChange={(details) => setActiveTab(details.value)}
        variant="enclosed"
      >
        <Tabs.List>
          <Tabs.Trigger
            value="users"
            _selected={{ borderColor: "primary.500", color: "primary.500" }}
          >
            User Assignments
          </Tabs.Trigger>
          <Tabs.Trigger
            value="roles"
            _selected={{ borderColor: "primary.500", color: "primary.500" }}
          >
            Roles
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Box mt={4}>
          <Tabs.Content value="users">
            <UserAssignmentsTab />
          </Tabs.Content>
          <Tabs.Content value="roles">
            <RolesTab />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Stack>
  );
};

export default RoleManagement;
