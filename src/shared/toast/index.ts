import { createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
  duration: 4000,
});

const toastSuccess = (message: string) => {
  toaster.create({
    id: message,
    title: message,
    type: "success",
  });
};

const toastFail = (message: string) => {
  toaster.create({
    id: message,
    title: message,
    type: "error",
  });
};

const toastInfo = (message: string) => {
  toaster.create({
    id: message,
    title: message,
    type: "info",
  });
};

const toastPromise = async <T>(
  promiseAction: Promise<T>,
  id?: string,
  loadingMessage?: string,
  successMessage?: string,
  errorMessage?: string
) => {
  const toastId = id ?? "promise-toast";

  toaster.create({
    id: toastId,
    title: loadingMessage ?? "Saving...",
    type: "loading",
  });

  try {
    const res = await promiseAction;

    toaster.update(toastId, {
      title: successMessage ?? "Success!",
      type: "success",
    });

    return res;
  } catch (error) {
    toaster.update(toastId, {
      title: errorMessage ?? "Error!",
      type: "error",
    });

    throw error;
  }
};

export { toastSuccess, toastFail, toastInfo, toastPromise };
