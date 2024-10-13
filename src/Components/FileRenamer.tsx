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

const FileRenamer: React.FC<Props> = ({ goHome, className = "" }: Props) => {
  const {
    allRegisteredFiles,
    clusters,
    clusterDifferences,
    getRegisteredFile,
    hasRegisteredFiles,
    registerClusters,
    registerFiles,
    resetRegisteredFiles,
    updateRevisedFilename,
    loadFilesInDirectory,
  } = useFilesStore();

  async function renameAllFiles() {
    let directory = "";
    // Iterate through the allRegisteredFiles
    for (const file of allRegisteredFiles()) {
      const registeredFile = getRegisteredFile(file.id);
      if (registeredFile && registeredFile.revisedFilename) {
        if (directory === "") {
          directory = registeredFile.dirPath;
        }
        const DOCUMENTS_DIR = await path.documentDir();
        const oldName = `${DOCUMENTS_DIR}/${registeredFile.relativePath}${registeredFile.filename}.${registeredFile.fileType}`;
        const newName = `${DOCUMENTS_DIR}/${registeredFile.relativePath}${registeredFile.revisedFilename}.${registeredFile.fileType}`;
        await rename(oldName, newName, {
          oldPathBaseDir: path.BaseDirectory.Document,
          newPathBaseDir: path.BaseDirectory.Document,
        });
      }
    }

    loadFilesInDirectory(directory);
  }

  const showFileUploader = !hasRegisteredFiles();

  const [selectedVideoFile, setSelectedVideoFile] =
    useState<DirEntryWithComputed | null>(null);

  // const loadFilesInDirectory = async (userProvidedPath: string) => {
  //   // Optionally normalize the path to remove any trailing slashes, etc.
  //   const normalizedPath = await path.normalize(userProvidedPath);

  //   // Read the contents of the directory
  //   const entries = await readDir(normalizedPath);
  //   const validVideoFiles = filterToVideoFiles(entries);
  //   const baseFolder = await path.documentDir();
  //   const videoFilesWithPath = await Promise.all(
  //     validVideoFiles.map(async (file) => {
  //       return {
  //         ...file,

  //         path: `${normalizedPath}/${file.name}`,
  //         id: uuidv4(),
  //         src: convertFileSrc(`${normalizedPath}/${file.name}`),

  //         filename: getFilename(file.name),
  //         fileType: getFileType(file.name),

  //         revisedFilename: "",

  //         dirPath: userProvidedPath,
  //         relativePath: extractRelativePath(
  //           `${normalizedPath}/${file.name}`,
  //           baseFolder,
  //         ) as string,
  //         createdAt: await fetchFileMetadata(`${normalizedPath}/${file.name}`),
  //       };
  //     }),
  //   );

  //   registerFiles(videoFilesWithPath);

  //   registerClusters(videoFilesWithPath);
  // };

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
          Rename Files
        </p>
      </div>

      {showFileUploader && (
        <div className={`cs-12`}>
          <button
            className={`w-full h-[200px] border-2 fc flex-col border-dashed border-gray-400 shadow-none rounded-xl`}
            onClick={async () => {
              const userProvidedPath = await open({
                directory: true,
                multiple: false,
              });

              if (userProvidedPath) {
                if (!pathIsInDocumentsFolder(userProvidedPath)) {
                  return;
                }

                loadFilesInDirectory(userProvidedPath);
              }
            }}
          >
            <p className={`text-gray-400 tracking-tight text-3xl fic`}>
              <FolderOpenIcon className={`mr-2`} />
              Open Folder
            </p>
            <p className={`text-sm italic text-gray-400 mt-2 `}>
              Must be in ~/Documents
            </p>
          </button>
        </div>
      )}
      <div className={`cs-6`}>
        {!showFileUploader && (
          <div className={`flex justify-end`}>
            <Button onClick={renameAllFiles}>Rename</Button>
          </div>
        )}
        {!showFileUploader &&
          clusters.map((clusterOfFiles, clusterIndex) => {
            return (
              <div key={`cluster-${clusterIndex}`}>
                <div className={`relative pl-3 space-y-2`}>
                  <div
                    className={`h-full w-1 rounded-full absolute left-0 bg-gray-400`}
                  />

                  {clusterOfFiles.map((fileInDir) => {
                    const updateFilename = (
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      updateRevisedFilename(
                        fileInDir.id,
                        e.currentTarget.value,
                      );
                    };

                    const registeredFile = getRegisteredFile(fileInDir.id);

                    return (
                      <input
                        type="text"
                        key={`file-${fileInDir.name}`}
                        className={`cs-12 w-full h-[48px] p-4 hover:bg-gray-200 rounded-lg placeholder:text-gray-500`}
                        onMouseEnter={() => {
                          setSelectedVideoFile(fileInDir);
                        }}
                        onFocus={() => {
                          setSelectedVideoFile(fileInDir);
                        }}
                        onChange={updateFilename}
                        placeholder={registeredFile?.filename}
                        value={registeredFile?.revisedFilename}
                      />
                    );
                  })}
                </div>
                {clusterDifferences[clusterIndex] ? (
                  <div
                    className={`my-3 bg-gray-50 fc font-inter rounded text-xs text-gray-400 py-2 px-4`}
                  >
                    {secondsToHms(clusterDifferences[clusterIndex])}
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
      {!showFileUploader && (
        <div className={`border border-gray-400 rounded-xl bg-white p-4 cs-6`}>
          {/* <div className={`cs-12`}>
            <code>
              <pre>{JSON.stringify(selectedVideoFile, null, 2)}</pre>
            </code>
          </div> */}
          <div className={`w-full gap-x-4 grid12`}>
            {selectedVideoFile?.src && (
              <VideoMetadataDisplay src={selectedVideoFile?.src} />
            )}
          </div>
          <div className={`cs-12 fc`}>
            <video
              src={selectedVideoFile?.src}
              controls
              autoPlay
              className="h-[400px]"
              muted
            />
          </div>
        </div>
      )}

      {/* <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault();
        greet();
      }}
    >
      <input
        id="greet-input"
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Enter a name..."
      />
      <button type="submit">Greet</button>
    </form>

    <p>{greetMsg}</p> */}
    </div>
  );
};

export default FileRenamer;
