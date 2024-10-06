import "./App.css";
import { Button } from "./ComponentsShad/Button";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { decamelize } from "./Libs/api-helpers";
import { DirEntryWithComputed } from "./types/fs-types";
import {
  filterToVideoFiles,
  getFilename,
  getFileType,
  getPathOfFile,
} from "./utils/filetype-utilities";
import { FolderOpenIcon, WaterDropIcon } from "./Libs/Icons";
import { open } from "@tauri-apps/plugin-dialog";
import { rename, readDir } from "@tauri-apps/plugin-fs";
import { useFilesStore } from "./Stores/useFilesStore";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as path from "@tauri-apps/api/path";
// import { generateVideoThumbnails, importFileandPreview } from "@/Libs/thumbnail-generator";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const {
    allRegisteredFiles,
    hasRegisteredFiles,
    registerFiles,
    updateRevisedFilename,
    getRegisteredFile,
    resetRegisteredFiles,
  } = useFilesStore();

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function renameAllFiles() {
    let directory = "";
    // Iterate through the allRegisteredFiles
    for (const file of allRegisteredFiles()) {
      const registeredFile = getRegisteredFile(file.id);
      if (registeredFile && registeredFile.revisedFilename) {
        directory = registeredFile.dirPath;
        const oldName = registeredFile.filename + "." + registeredFile.fileType;
        const newName = registeredFile.revisedFilename + "." + registeredFile.fileType;
        await rename(oldName, newName, {
          oldPathBaseDir: path.BaseDirectory.Document,
          newPathBaseDir: path.BaseDirectory.Document,
        });
      }
    }

    if (directory !== "") {
      loadFilesInDirectory(directory);
    }

    // [Error] Unhandled Promise Rejection: fs.rename not allowed. Permissions associated with this command: fs:allow-app-write, fs:allow-app-write-recursive, fs:allow-appcache-write, fs:allow-appcache-write-recursive, fs:allow-appconfig-write,...
    // (anonymous function) (App.tsx:52)
    // console.log({ allRegisteredFiles: decamelize(allRegisteredFiles()) });
    // await invoke("rename_all_files", { allRegisteredFiles: decamelize(allRegisteredFiles()) });
  }

  const showFileUploader = !hasRegisteredFiles();

  const [selectedVideoFile, setSelectedVideoFile] = useState<DirEntryWithComputed | null>(null);

  const loadFilesInDirectory = async (userProvidedPath: string) => {
    // Optionally normalize the path to remove any trailing slashes, etc.
    const normalizedPath = await path.normalize(userProvidedPath);

    // Read the contents of the directory
    const entries = await readDir(normalizedPath);
    const validVideoFiles = filterToVideoFiles(entries);
    const videoFilesWithPath = validVideoFiles.map((file) => {
      return {
        ...file,
        src: convertFileSrc(`${normalizedPath}/${file.name}`),
        path: `${normalizedPath}/${file.name}`,
        id: uuidv4(),
        filename: getFilename(file.name),
        fileType: getFileType(file.name),
        revisedFilename: "",
        dirPath: userProvidedPath,
      };
    });
    registerFiles(videoFilesWithPath);
  };

  return (
    <div className="grid12 p-8 font-inter gap-3">
      <header className={`cs-12 flex flex-col text-left mb-2`}>
        <button
          onClick={() => {
            resetRegisteredFiles();
          }}
        >
          <h1 className="text-xl font-light fic tracking-tight text-gray-600">
            <WaterDropIcon className={`mr-1`} /> wisp
          </h1>
        </button>
      </header>
      <div className={`cs-12`}>
        {showFileUploader && (
          <button
            className={`w-full h-[200px] border-2 border-dashed border-gray-400 flex items-center justify-center shadow-none rounded`}
            onClick={async () => {
              const userProvidedPath = await open({
                directory: true,
                multiple: false,
              });

              if (userProvidedPath) {
                loadFilesInDirectory(userProvidedPath);
              }
            }}
          >
            <span className={`text-gray-400 tracking-tight text-3xl fic`}>
              <FolderOpenIcon className={`mr-2`} />
              Open Folder
            </span>
          </button>
        )}
      </div>
      <div className={`cs-6 grid12 gap-y-2`}>
        {!showFileUploader && (
          <div className={`cs-12 flex justify-end`}>
            <Button onClick={renameAllFiles}>Rename</Button>
          </div>
        )}
        {!showFileUploader &&
          allRegisteredFiles()
            .sort((a, b) => a.filename.localeCompare(b.filename))
            .map((fileInDir) => {
              const updateFilename = (e: React.ChangeEvent<HTMLInputElement>) => {
                updateRevisedFilename(fileInDir.id, e.currentTarget.value);
              };

              const registeredFile = getRegisteredFile(fileInDir.id);

              return (
                <input
                  type="text"
                  key={`file-${fileInDir.name}`}
                  className={`cs-12 py-1 px-2 bg-gray-50 hover:bg-gray-200 rounded placeholder:text-gray-500`}
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
      {!showFileUploader && (
        <div className={`cs-6`}>
          <video
            src={selectedVideoFile?.src}
            controls
            autoPlay
            className="max-w-full max-h-[80vh]"
            muted
          />
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
}

export default App;
