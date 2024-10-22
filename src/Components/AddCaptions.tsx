import React, { useEffect, useState } from "react";
import { Command } from "@tauri-apps/plugin-shell";

import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/ComponentsShad/Button";
import { useCaptionConfig } from "@/Stores/useCaptionConfig";
import { CaretRightIcon, WaterDropIcon } from "@/Libs/Icons";
import { useFilesStore } from "@/Stores/useFilesStore";
import { VideoWrapper } from "@/Libs/VideoWrapper";
import { UploadFiles } from "./UploadFiles";
import { escapeFilePath } from "@/utils/filetype-utilities";

// Import BaseDirectory
import { tempDir } from "@tauri-apps/api/path";

interface Props {
  goHome?: Function;
}

const AddCaptions: React.FC<Props> = ({ goHome = () => {} }: Props) => {
  const { allRegisteredFiles, hasRegisteredFiles } = useFilesStore();

  const { selectedVideo, hasSelectedVideo, setSelectedVideo } = useCaptionConfig();

  const showFileUploader = !hasRegisteredFiles();

  const [tempDirPath, setTempDirPath] = useState<string | null>(null);

  useEffect(() => {
    async function getTempDir() {
      const t = await tempDir();

      setTempDirPath(t);
    }

    getTempDir();
  }, []);

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
          <div className="cs-6 px-4">
            {/* <code>
              <pre>{JSON.stringify(tempDirPath, null, 2)}</pre>
            </code> */}
            <button
              onClick={async () => {
                await Command.create("run-ffmpeg", [
                  "-i",
                  escapeFilePath(selectedVideo.path),
                  "-q:a",
                  "0",
                  "-map",
                  "a",
                  `${tempDirPath}/audio.mp3`,
                ]).execute();

                // console.log(result);
                // console.log(`${tempDirPath}/audio.mp3`);

                // const lsResult = await Command.create("run-ls").execute();
                // console.log(lsResult);

                // const pwdResult = await Command.create("run-pwd").execute();

                // console.log(pwdResult);
              }}
              className={`bg-blue-500 hover:bg-blue-700 transition-all text-white p-2 rounded-md`}
            >
              Fetch Captions
            </button>
          </div>
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
