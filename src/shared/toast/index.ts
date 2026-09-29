// Reuse the single shared Chakra toaster instance that is rendered by
// <ToasterProvider/>. Creating a separate createToaster() instance here meant
// every toastSuccess/toastFail call was queued on a toaster nothing renders,
// so those notifications never appeared on screen.
import { toaster } from "@/shared/config";

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

export { toaster, toastSuccess, toastFail, toastInfo, toastPromise };
