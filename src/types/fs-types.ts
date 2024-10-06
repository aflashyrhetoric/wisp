import { DirEntry } from "@tauri-apps/plugin-fs";

export type DirEntryWithComputed = DirEntry & {
  id: string;
  path: string;
  src: string;
  filename: string;
  fileType: string;
  dirPath: string; // the directory that the user provided, where the file is located
  relativePath: string; // relative to documents
  createdAt: number;
};
