import { DirEntryWithComputed } from "@/types/fs-types";
import { DirEntry } from "@tauri-apps/plugin-fs";

/**
 * Given a filename, return the file type.
 */
export function getFileType(fileName: string): string {
  const parts = fileName.split(".");
  return parts[parts.length - 1];
}

export function filterToVideoFiles(files: DirEntry[] | DirEntryWithComputed[]): DirEntry[] {
  const videoFiletypes = ["mp4", "mov", "mkv", "avi", "mov", "webm", "flv"];

  return files.filter((file) => {
    const fileType = getFileType(file.name);

    return videoFiletypes.includes(fileType);
  });
}

export function getFilename(filename: string) {
  // Get the filename without the extension but do not just split on "." since the title may contain periods
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) return filename; // No extension found
  return filename.substring(0, lastDotIndex);
}

export function getPathOfFile(filename: string): string {
  // Given something like "C:/Users/username/Documents/file.txt", will return "C:/Users/username/Documents"

  const parts = filename.split("/");
  parts.pop();
  return parts.join("/");
}
