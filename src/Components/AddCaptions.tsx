import React from "react";
import { Button } from "@/ComponentsShad/Button";
import { useCaptionConfig } from "@/Stores/useCaptionConfig";
import { CaretRightIcon, WaterDropIcon } from "@/Libs/Icons";
import { useFilesStore } from "@/Stores/useFilesStore";
import { VideoWrapper } from "@/Libs/VideoWrapper";
import { UploadFiles } from "./UploadFiles";
// import { readDir, rename } from "@tauri-apps/plugin-fs";
// import { DirEntryWithComputed } from "@/types/fs-types";

interface Props {
  className?: string;
  goHome?: Function;
}

const AddCaptions: React.FC<Props> = ({ goHome, className = "" }: Props) => {
  const { allRegisteredFiles, hasRegisteredFiles, loadFilesInDirectory } =
    useFilesStore();

  const { selectedVideo, hasSelectedVideo, setSelectedVideo } =
    useCaptionConfig();

  const showFileUploader = !hasRegisteredFiles();

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
      {showFileUploader && <UploadFiles />}
      {hasSelectedVideo() && selectedVideo?.path && (
        <div className="cs-12 grid12">
          <div className="cs-6">
            <VideoWrapper src={selectedVideo.src} />
          </div>
          <div className="cs-6 p-4">poop</div>
          {/* <code className="cs-6">
            <pre>{JSON.stringify(selectedVideo, null, 2)}</pre>
          </code> */}
        </div>
      )}
      {!hasSelectedVideo() &&
        allRegisteredFiles().map((file) => {
          return (
            <div
              key={file.id}
              className={`cs-12 flex items-center justify-between border-b border-gray-200 py-2`}
            >
              <div className={`flex items-center`}>
                <WaterDropIcon className={`mr-2`} />
                <p className={`fic`}>{file.name}</p>
              </div>
              <div className={`flex items-center`}>
                <Button
                  onClick={() => {
                    setSelectedVideo(file);
                  }}
                  className={`mr-2`}
                >
                  Select
                </Button>
                <Button
                  onClick={() => {
                    // const newFileName = `${file.name.replace(
                    //   ".mp4",
                    //   ""
                    // )}-captions.mp4`;
                    // rename({
                    //   oldPath: file.path,
                    //   newPath: path.join(file.dir, newFileName),
                    // });
                  }}
                >
                  Add Captions
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default AddCaptions;
