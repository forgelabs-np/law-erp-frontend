import { Button } from "@chakra-ui/react";

import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
} from "@/shared/components/ui/Dialog";

import { CaseFilters as CaseFiltersType } from "../types/case.types";
import { CaseFilters } from "./CaseFilters";

interface CaseFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CaseFiltersType;
  onFiltersChange: (filters: CaseFiltersType) => void;
  onClearFilters: () => void;
}

export const CaseFiltersModal = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
}: CaseFiltersModalProps) => {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <DialogContent maxWidth="500px">
        <DialogHeader>
          <DialogTitle>Filter Cases</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody>
          <CaseFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClearFilters={onClearFilters}
          />
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
