export const formatFile = (filename: string | File): File => {
  if (filename instanceof File) {
    return filename;
  }
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
  };
  const mimeType = mimeMap[ext || ""] || "application/octet-stream";
  return new File([""], filename, { type: mimeType });
};
