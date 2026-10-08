import { Badge, HStack, Box, Stack, Text, VStack } from "@chakra-ui/react";

import {
  useEmployeeByIdQuery,
  EmployeeResponseType,
} from "@/api/employeeManagement";
import { Dialog } from "@/shared/components/dialog";
import { formatDate } from "@/pages/User/CaseManagement/utils/matterHelpers";

interface EmployeeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  id?: string;
}

const formatDateDisplay = (value?: string | null): string => {
  if (!value) return "N/A";
  try {
    return formatDate(value);
  } catch {
    return value;
  }
};

export const EmployeeDetailsModal = ({
  open,
  onClose,
  id,
}: EmployeeDetailsModalProps) => {
  const { data: employee, isLoading } = useEmployeeByIdQuery(id ?? "");

  if (!id) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Employee Details"
      hasFooter={false}
      size={"md"}
      // scrollBehavior="inside"
    >
      {isLoading ? (
        <Stack p={4}>
          <Text fontSize="sm" color="gray.500">
            Loading employee details...
          </Text>
        </Stack>
      ) : employee ? (
        <Box height={"510px"} overflowY={"scroll"}>
          <Stack p={4} gap={6}>
            <EmployeeDetailsSection employee={employee} />
          </Stack>
        </Box>
      ) : (
        <Stack p={4}>
          <Text fontSize="sm" color="gray.500">
            No employee data found.
          </Text>
        </Stack>
      )}
    </Dialog>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <Text
    fontSize="xs"
    fontWeight="700"
    color="gray.500"
    textTransform="uppercase"
    letterSpacing="wider"
    mb={2}
  >
    {children}
  </Text>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <HStack
    w="100%"
    justifyContent="space-between"
    alignItems="center"
    py={2}
    borderBottom="1px solid"
    borderColor="gray.100"
  >
    <Text flexShrink={0} fontSize="sm" color="gray.600" fontWeight="500">
      {label}
    </Text>
    <Text
      flex={1}
      fontSize="sm"
      fontWeight="500"
      color="gray.900"
      textAlign="right"
      ml={4}
      wordBreak="break-all"
    >
      {value}
    </Text>
  </HStack>
);

function EmployeeDetailsSection({
  employee,
}: {
  employee: EmployeeResponseType;
}) {
  return (
    <>
      <Stack gap={2}>
        <SectionHeading>Basic Information</SectionHeading>
        <VStack align="stretch" gap={0}>
          <DetailRow label="Full Name" value={employee.fullName ?? "N/A"} />
          <DetailRow label="Username" value={employee.username ?? "N/A"} />
          <DetailRow label="Email" value={employee.email ?? "N/A"} />
          <DetailRow label="Mobile Number" value={employee.mobileNo ?? "N/A"} />
          <DetailRow
            label="Employee Code"
            value={employee.employeeCode ?? "N/A"}
          />
          <DetailRow
            label="User Type"
            value={
              <Badge
                bg="blue.100"
                color="blue.700"
                px={2}
                py={0.5}
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {employee.userType ?? "N/A"}
              </Badge>
            }
          />
          <DetailRow
            label="Status"
            value={
              <Badge
                bg={employee.isActive ? "green.100" : "gray.100"}
                color={employee.isActive ? "green.700" : "gray.700"}
                px={2}
                py={0.5}
                borderRadius="md"
                fontSize="xs"
                fontWeight="600"
              >
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
            }
          />
        </VStack>
      </Stack>

      <Stack gap={2}>
        <SectionHeading>Role & Professional Information</SectionHeading>
        <VStack align="stretch" gap={0}>
          <DetailRow label="Role Name" value={employee.roleName ?? "N/A"} />
          <DetailRow label="Role Code" value={employee.roleCode ?? "N/A"} />
          <DetailRow
            label="Designation"
            value={employee.designation ?? "N/A"}
          />
          <DetailRow
            label="Bar Council Number"
            value={employee.barCouncilNo ?? "N/A"}
          />
          <DetailRow
            label="Specialization"
            value={employee.specialization ?? "N/A"}
          />
          <DetailRow
            label="Joining Date"
            value={formatDateDisplay(employee.joiningDate)}
          />
        </VStack>
      </Stack>

      <Stack gap={2}>
        <SectionHeading>Emergency Contact</SectionHeading>
        <VStack align="stretch" gap={0}>
          <DetailRow
            label="Emergency Contact Name"
            value={employee.emergencyContactName ?? "N/A"}
          />
          <DetailRow
            label="Emergency Contact Phone"
            value={employee.emergencyContactPhone ?? "N/A"}
          />
        </VStack>
      </Stack>

      <Stack gap={2}>
        <SectionHeading>Additional Information</SectionHeading>
        <VStack align="stretch" gap={0}>
          <DetailRow label="Notes" value={employee.notes ?? "N/A"} />
          <DetailRow
            label="Created At"
            value={formatDateDisplay(employee.createdAt)}
          />
        </VStack>
      </Stack>
    </>
  );
}
