import { Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  SubMenuResponse,
  useAddEditModuleMenuMutation,
  useModuleMenuByIdQuery
} from "@/api/menuSetup";
import { FormProvider } from "@/shared/components";
import CustomDrawer from "@/shared/components/drawer/CustomerDrawer";
import { MenuSetupForm } from "./component/MenuSetupForm";
import { MenuSetupFormValues, ModuleMenuPayload } from "./types";

const defaultValues: MenuSetupFormValues = {
  menu: {
    displayOrder: "",
    menuName: "",
    menuCode: "",
    privilege: [],
    subMenus: [],
    moduleType: "CMS", // fallback or default moduleType if needed
  },
};

export const AddEditMenu = ({
  open,
  onClose,
  id,
  setId,
}: {
  open: boolean;
  onClose: () => void;
  id?: string;
  setId: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const { data: menuById, isLoading: isLoadingMenu } = useModuleMenuByIdQuery(
    id ?? ""
  );

  const methods = useForm<MenuSetupFormValues>({
    defaultValues,
  });
  const { control, handleSubmit, reset } = methods;

  const { mutate, isPending } = useAddEditModuleMenuMutation();

  useEffect(() => {
    if (open && !id) {
      reset(defaultValues);
      setId("");
    }
  }, [open, id, reset, setId]);

  useEffect(() => {
    if (menuById && id) {
      reset({
        menu: {
          displayOrder: menuById.displayOrder?.toString() ?? "",
          menuName: menuById.name ?? "",
          menuCode: menuById.code ?? "",
          privilege: menuById.privilege ?? [],
          subMenus:
            menuById.subModules?.map((sub: SubMenuResponse) => ({
              id: sub.id,
              displayOrder: sub.displayOrder?.toString() ?? "",
              menuName: sub.name ?? "",
              menuCode: sub.code ?? "",
              privilege: sub.privilege ?? [],
            })) ?? [],
        },
      });
    }
  }, [menuById, id, reset]);

  const onSubmit = (data: MenuSetupFormValues) => {
    const payload: ModuleMenuPayload = {
      ...(id ? { id } : {}),
      menuName: data.menu.menuName,
      menuCode: data.menu.menuCode.toUpperCase(),
      displayOrder: data.menu.displayOrder,
      privilege: data.menu.privilege,
      subMenus: data.menu.subMenus.map((sub) => ({
        ...(sub.id ? { id: sub.id } : {}),
        displayOrder: sub.displayOrder,
        menuName: sub.menuName,
        menuCode: sub.menuCode,
        privilege: sub.privilege,
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        closeHandler();
      },
    });
  };

  const closeHandler = () => {
    resetHandler();
    onClose();
  };
  const resetHandler = () => {
    reset(defaultValues);
    setId("");
  };

  return (
    <FormProvider methods={methods}>
      <CustomDrawer
        open={open}
        onClose={closeHandler}
        title={id ? "Edit Menu Setup" : "Add Menu Setup"}
        subHeading="Fill in the information below to continue"
        hasFooter
        submitButtonText="Submit"
        exitButtonText="Close"
        resetButtonText="Clear"
        handleReset={resetHandler}
        handleExit={closeHandler}
        handleSubmit={handleSubmit(onSubmit)}
        isSubmitting={isPending}
        disabled={!!id && isLoadingMenu}
        component={
          <Stack gap={6} p={4}>
            <MenuSetupForm control={control} isEdit={!!id} />
          </Stack>
        }
        size="xl"
      />
    </FormProvider>
  );
};
