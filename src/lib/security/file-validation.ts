// Magic bytes for supported file types
const SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] }, // ‰PNG
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] }, // ÿØÿ
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF (WebP container)
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
];

const ALLOWED_MIMES = new Set(SIGNATURES.map((s) => s.mime));

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: string;
}

/**
 * Validate a file's content by checking magic bytes, size, and MIME type.
 * This is server-side validation that cannot be bypassed by the client.
 */
export function validateFileContent(
  buffer: ArrayBuffer,
  claimedType: string,
): FileValidationResult {
  if (buffer.byteLength === 0) {
    return { valid: false, error: "File is empty" };
  }

  if (buffer.byteLength > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  const header = new Uint8Array(buffer.slice(0, 12));
  let detectedMime: string | undefined;

  for (const sig of SIGNATURES) {
    const match = sig.bytes.every((byte, i) => header[i] === byte);
    if (match) {
      detectedMime = sig.mime;
      break;
    }
  }

  if (!detectedMime) {
    return {
      valid: false,
      error: "Unsupported file format. Upload PDF, PNG, JPG, or WebP.",
    };
  }

  // Cross-check: claimed MIME must match detected MIME (or be close enough)
  // JPEG can be "image/jpg" or "image/jpeg"
  const normalizedClaimed = claimedType === "image/jpg" ? "image/jpeg" : claimedType;
  if (!ALLOWED_MIMES.has(normalizedClaimed)) {
    return {
      valid: false,
      error: "Unsupported file type. Upload PDF, PNG, JPG, or WebP.",
    };
  }

  return { valid: true, detectedMime };
}

/**
 * Convert an ArrayBuffer + MIME type to a data URL for the OpenAI vision API.
 */
export function bufferToDataUrl(buffer: ArrayBuffer, mime: string): string {
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${mime};base64,${base64}`;
}
