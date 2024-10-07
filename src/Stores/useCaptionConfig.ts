import { DirEntryWithComputed } from "@/types/fs-types";
import {
  calculateDynamicThreshold,
  clusterTimestamps,
} from "@/utils/filetype-utilities";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type CaptionConfig = {
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number; // px
};

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
};

export const useFilesStore = create<State & Actions>()(
  devtools(
    immer((set, get) => ({
      // prettier-ignore
      configuration: {},

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
        console.log({ threshold });
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
