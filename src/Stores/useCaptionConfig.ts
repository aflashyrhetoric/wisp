import { DirEntryWithComputed } from "@/types/fs-types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type CaptionConfig = {
  // textColor?: string;
  // strokeColor?: string;
  // strokeWidth?: number; // px
};

type State = {
  selectedVideo: DirEntryWithComputed | null;
};

// prettier-ignore
type Actions = {
  resetSelectedVideo: () => void;
  setSelectedVideo: (video: DirEntryWithComputed) => void;
  hasSelectedVideo: () => boolean;
};

export const useCaptionConfig = create<State & Actions>()(
  devtools(
    immer((set, get) => ({
      selectedVideo: null,
      resetSelectedVideo: () => set(() => ({ selectedVideo: "" })),
      setSelectedVideo: (video: DirEntryWithComputed) =>
        set(() => ({ selectedVideo: video })),

      hasSelectedVideo: () => !!get().selectedVideo,
    })),
  ),
);
