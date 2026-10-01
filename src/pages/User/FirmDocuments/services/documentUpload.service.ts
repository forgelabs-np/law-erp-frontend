export interface UploadFileToStorageParams {
  /** Presigned object-storage URL returned by the upload-ticket endpoint. */
  uploadUrl: string;
  /** Every field returned by the backend, submitted unchanged. */
  fields: Record<string, string>;
  file: File;
  /** Real browser→storage progress, 0-100. */
  onProgress?: (percent: number) => void;
}

export interface UploadFileToStorageResult {
  status: number;
  /** Raw response text (an S3 POST returns XML). Not parsed, never logged. */
  responseText: string;
}

/**
 * POSTs a file straight to object storage using the presigned POST policy.
 *
 * XHR is used deliberately (rather than the axios API client) because only
 * XHR exposes `upload.onprogress`, which drives the real progress bar.
 *
 * Contract details that must not drift:
 * - multipart/form-data POST — never PUT, never JSON
 * - every returned field is appended exactly as provided, and the file is
 *   appended LAST (S3 requires the file field to come after the policy)
 * - the multipart `Content-Type` header is NOT set manually so the browser
 *   can generate the boundary
 * - the backend never receives the file bytes; only the storage bucket does
 */
export const uploadFileToStorage = ({
  uploadUrl,
  fields,
  file,
  onProgress,
}: UploadFileToStorageParams): Promise<UploadFileToStorageResult> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // The file MUST be last: the storage policy field order is enforced.
    formData.append("file", file);

    const request = new XMLHttpRequest();

    request.open("POST", uploadUrl, true);

    // Note: no Content-Type header is set — the browser adds the multipart
    // boundary. Setting it manually breaks the signature check.

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;

      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(Math.min(100, Math.max(0, percent)));
    };

    request.onload = () => {
      // Storage answers 200/204 on success; anything else is a failure.
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100);
        resolve({ status: request.status, responseText: request.responseText });
        return;
      }

      reject(
        new Error(
          request.status === 0
            ? "The upload could not reach storage. Check your connection and try again."
            : `The storage upload failed (${request.status}).`
        )
      );
    };

    request.onerror = () => {
      reject(
        new Error(
          "The upload could not reach storage. Check your connection and try again."
        )
      );
    };

    request.ontimeout = () => {
      reject(new Error("The storage upload timed out. Please try again."));
    };

    request.send(formData);
  });
};
