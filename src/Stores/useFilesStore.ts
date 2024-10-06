import { DirEntryWithComputed } from "@/types/fs-types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type DirEntryForm = DirEntryWithComputed & {
  revisedFilename?: string;
};

type State = {
  registeredFiles: Record<string, DirEntryForm>;
  allRegisteredFiles: () => DirEntryForm[];
};

// prettier-ignore
type Actions = {
    hasRegisteredFiles: () => boolean;
    registerFiles: (files: DirEntryWithComputed[]) => void;
    getRegisteredFile: (id: string) => DirEntryForm | undefined;

    resetRegisteredFiles: () => void;

    updateRevisedFilename: (id: string, revisedFilename: string) => void;
};

export const useFilesStore = create<State & Actions>()(
  devtools(
    immer((set, get) => ({
      // prettier-ignore
      registeredFiles: {},
      allRegisteredFiles: () => Object.values(get().registeredFiles),
      hasRegisteredFiles: () => Object.keys(get().registeredFiles).length > 0,

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

      updateRevisedFilename: (id: string, revisedFilename: string) => {
        set((state) => {
          const file = state.registeredFiles[id];
          if (file) {
            file.revisedFilename = revisedFilename;
          }
        });
      },
    }))
  )
);
