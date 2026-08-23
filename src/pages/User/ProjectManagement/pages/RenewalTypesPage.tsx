import { Box, Button, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useRenewalTypesQuery,
  useCreateRenewalTypeMutation,
  useUpdateRenewalTypeMutation,
  useDeleteRenewalTypeMutation,
} from "../api/project.api";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/shared/components/ui";
import NoDataAvailable from "@/shared/components/NoDataAvailable/NoDataAvailable";
import { Input } from "@chakra-ui/react";
import { ConfirmationDialog } from "@/shared/components/dialog/conformationDialog";

const RenewalTypesPage = () => {
  const navigate = useNavigate();
  const { data: renewalTypes, isLoading, refetch } = useRenewalTypesQuery();
  const createMutation = useCreateRenewalTypeMutation();
  const updateMutation = useUpdateRenewalTypeMutation();
  const deleteMutation = useDeleteRenewalTypeMutation();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  const [deleteTypeId, setDeleteTypeId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleAdd = () => {
    if (!formData.name) return;
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        setFormData({ name: "", description: "" });
        refetch();
      },
    });
  };

  const handleEdit = () => {
    if (!formData.name || !editingType) return;
    updateMutation.mutate(
      { id: editingType.id, data: formData },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingType(null);
          setFormData({ name: "", description: "" });
          refetch();
        },
      }
    );
  };

  const handleDelete = (id: number, isSystem: boolean) => {
    if (isSystem) {
      alert("System renewal types cannot be deleted.");
      return;
    }
    setDeleteTypeId(id);
  };

  const openEditDialog = (type: any) => {
    setEditingType(type);
    setFormData({ name: type.name, description: type.description || "" });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Stack gap={6} padding={2}>
        <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
          <ArrowLeft size={16} /> Back to Projects
        </Button>
        <Stack gap={4}>
          {[1, 2, 3].map((i) => (
            <Box key={i} h="60px" bg="gray.100" borderRadius="md" />
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={6} padding={2}>
      <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
        <ArrowLeft size={16} /> Back to Projects
      </Button>

      <Box
        p={6}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <HStack justify="space-between" align="center" mb={6}>
          <Text textStyle="heading_4">Renewal Types</Text>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={16} color="white" /> Add Type
          </Button>
        </HStack>

        {!renewalTypes || renewalTypes.length === 0 ? (
          <NoDataAvailable content="No renewal types found" />
        ) : (
          <Stack gap={3}>
            {renewalTypes.map((type) => (
              <Box
                key={type.id}
                p={4}
                bg="gray.50"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <HStack
                  justify="space-between"
                  align="flex-start"
                  flexWrap="wrap"
                  gap={2}
                >
                  <VStack align="flex-start" gap={1} flex={1}>
                    <HStack gap={2} align="center">
                      <Text fontSize="sm" fontWeight="600" color="gray.900">
                        {type.name}
                      </Text>
                      {type.system && (
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          bg="gray.200"
                          px={2}
                          py={0.5}
                          borderRadius="md"
                        >
                          System
                        </Text>
                      )}
                    </HStack>
                    {type.description && (
                      <Text fontSize="xs" color="gray.600">
                        {type.description}
                      </Text>
                    )}
                  </VStack>
                  <HStack gap={2}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(type)}
                      disabled={type.system}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(type.id, type.system)}
                      disabled={type.system}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <DialogRoot
        open={isAddDialogOpen}
        onOpenChange={(e) => setIsAddDialogOpen(e.open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Renewal Type</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Name *
                </Text>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Domain Registration"
                  required
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Description
                </Text>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                />
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAdd}
              loading={createMutation.isPending}
              disabled={!formData.name}
            >
              Add Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot
        open={isEditDialogOpen}
        onOpenChange={(details) => setIsEditDialogOpen(details.open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Renewal Type</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Name *
                </Text>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Domain Registration"
                  required
                />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                  Description
                </Text>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                />
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEdit}
              loading={updateMutation.isPending}
              disabled={!formData.name}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <ConfirmationDialog
        open={!!deleteTypeId}
        onClose={() => setDeleteTypeId(null)}
        title="Delete Renewal Type"
        action="delete this renewal type"
        handleSubmit={() => {
          if (deleteTypeId) {
            deleteMutation.mutate(deleteTypeId, {
              onSuccess: () => {
                setDeleteTypeId(null);
                refetch();
              },
            });
          }
        }}
        submitActionPending={deleteMutation.isPending}
      />
    </Stack>
  );
};

export default RenewalTypesPage;
