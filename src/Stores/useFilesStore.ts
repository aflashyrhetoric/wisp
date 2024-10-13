import { DirEntryWithComputed } from "@/types/fs-types";
import { v4 as uuidv4 } from "uuid";
import * as path from "@tauri-apps/api/path";
import {
  calculateDynamicThreshold,
  clusterTimestamps,
  extractRelativePath,
  fetchFileMetadata,
  filterToVideoFiles,
  getFilename,
  getFileType,
} from "@/utils/filetype-utilities";
import { convertFileSrc } from "@tauri-apps/api/core";
import { readDir } from "@tauri-apps/plugin-fs";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type DirEntryForm = DirEntryWithComputed & {
  revisedFilename?: string;
};

type State = {
  registeredFiles: Record<string, DirEntryForm>;
  allRegisteredFiles: () => DirEntryForm[];
  clusters: DirEntryForm[][];
  clusterDifferences: number[];
};

// prettier-ignore
type Actions = {
    hasRegisteredFiles: () => boolean;
    registerFiles: (files: DirEntryWithComputed[]) => void;
    registerClusters: (files: DirEntryWithComputed[]) => void;
    getRegisteredFile: (id: string) => DirEntryForm | undefined;

    resetRegisteredFiles: () => void;

    updateRevisedFilename: (id: string, revisedFilename: string) => void;
  loadFilesInDirectory: (userProvidedPath: string) => void;
};

export const useFilesStore = create<State & Actions>()(
  devtools(
    immer((set, get) => ({
      // prettier-ignore
      registeredFiles: {},
      clusters: [],
      clusterDifferences: [],
      allRegisteredFiles: () => Object.values(get().registeredFiles),
      hasRegisteredFiles: () => Object.keys(get().registeredFiles).length > 0,
      loadFilesInDirectory: async (userProvidedPath: string) => {
        // Optionally normalize the path to remove any trailing slashes, etc.
        const normalizedPath = await path.normalize(userProvidedPath);

        // Read the contents of the directory
        const entries = await readDir(normalizedPath);
        const validVideoFiles = filterToVideoFiles(entries);
        const baseFolder = await path.documentDir();
        const videoFilesWithPath = await Promise.all(
          validVideoFiles.map(async (file) => {
            return {
              ...file,

              path: `${normalizedPath}/${file.name}`,
              id: uuidv4(),
              src: convertFileSrc(`${normalizedPath}/${file.name}`),

              filename: getFilename(file.name),
              fileType: getFileType(file.name),

              revisedFilename: "",

              dirPath: userProvidedPath,
              relativePath: extractRelativePath(
                `${normalizedPath}/${file.name}`,
                baseFolder,
              ) as string,
              createdAt: await fetchFileMetadata(
                `${normalizedPath}/${file.name}`,
              ),
            };
          }),
        );

        get().registerFiles(videoFilesWithPath as any);

        get().registerClusters(videoFilesWithPath as any);
      },

      resetRegisteredFiles: () => {
        set({ registeredFiles: {} });
      },

      getRegisteredFile: (id: string) => {
        return get().registeredFiles[id];
      },

      registerFiles: (files: DirEntryWithComputed[]) => {
        set({ registeredFiles: {} });
        set((state) => {
          files.forEach((file) => {
            state.registeredFiles[file.id] = file;
          });
        });
      },
      registerClusters: (files: DirEntryWithComputed[]) => {
        set({ clusters: [] });

        const threshold = calculateDynamicThreshold(
          files.map((file) => file.createdAt as number),
        );
        const clusters = clusterTimestamps(files, threshold);

        // Calculate the difference between the last of each cluster and the first of the next cluster, and store it in "clusterDifferences"

        const clusterDifferences = clusters.map((cluster, index) => {
          if (index === clusters.length - 1) {
            return 0;
          }
          return (
            cluster[cluster.length - 1].createdAt -
            clusters[index + 1][0].createdAt
          );
        });

        set((state) => {
          state.clusterDifferences = clusterDifferences;
        });

        set((state) => {
          state.clusters = clusters;
        });
      },

      updateRevisedFilename: (id: string, revisedFilename: string) => {
        set((state) => {
          const file = state.registeredFiles[id];
          if (file) {
            file.revisedFilename = revisedFilename;
          }
        });
      },
    })),
  ),
);
