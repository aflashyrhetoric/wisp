import { Button } from "@/ComponentsShad/Button";
import { v4 as uuidv4 } from "uuid";
import { open } from "@tauri-apps/plugin-dialog";
import * as path from "@tauri-apps/api/path";
import VideoMetadataDisplay from "@/Home/VideoMetadataDisplay";
import { CaretRightIcon, FolderOpenIcon, WaterDropIcon } from "@/Libs/Icons";
import {
  extractRelativePath,
  fetchFileMetadata,
  filterToVideoFiles,
  getFilename,
  getFileType,
  pathIsInDocumentsFolder,
  secondsToHms,
} from "@/utils/filetype-utilities";
import { convertFileSrc } from "@tauri-apps/api/core";
import React, { useState } from "react";
import { useFilesStore } from "@/Stores/useFilesStore";
import { readDir, rename } from "@tauri-apps/plugin-fs";
import { DirEntryWithComputed } from "@/types/fs-types";

interface Props {
  className?: string;
  goHome?: Function;
}

const AddCaptions: React.FC<Props> = ({ goHome, className = "" }: Props) => {
  return (
    <div className="cs-12 grid12 pt-5 font-inter gap-3">
      <div className="cs-12 py-4">
        <p className="font-bold tracking-tight text-2xl mt-4">
          <button
            onClick={() => {
              goHome();
            }}
            className="ific"
          >
            <span className="hover:underline">Home</span>{" "}
            <span className="mx-1">
              <CaretRightIcon className="inline" />
            </span>
          </button>
          Add Captions
        </p>
      </div>
      poop
    </div>
  );
};

export default AddCaptions;
