import { unlink, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (file: File, folders: string) => {
  const extFile = path.extname(file.name);
  const fileName = `${uuidv4()}${extFile}`;
  const bytesFile = await file.arrayBuffer();
  const bufferFile = Buffer.from(bytesFile);
  const filePath = path.join(process.cwd(), "public", folders, fileName);
  await writeFile(filePath, bufferFile);
  const fileUrl = `/${folders}/${fileName}`;
  return { fileName, fileUrl, filePath, bufferFile };
};

export const removeFile = async (fileUrl: string) => {
  await unlink(fileUrl);
};

export const getFilePath = (file: string) => {
  return path.join(process.cwd(), `public/${file}`);
};
