export type QrEntryErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_QR"
  | "DATABASE_ERROR";

export class QrEntryError extends Error {
  constructor(
    public readonly code: QrEntryErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "QrEntryError";
  }
}
