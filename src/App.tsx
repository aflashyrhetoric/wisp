import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { open } from "@tauri-apps/plugin-dialog";
// when using `"withGlobalTauri": true`, you may use
// const { open } = window.__TAURI__.dialog;

import { DirEntry, readDir } from "@tauri-apps/plugin-fs";
import * as path from "@tauri-apps/api/path";

// Assuming the user provided an absolute path

// Open a dialog
// const file = await open({
//   multiple: false,
//   directory: false,
// });
// console.log(file);
// Prints file path or URI

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [discoveredFiles, setDiscoveredFiles] = useState<DirEntry[]>([]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <button
        onClick={async () => {
          const userProvidedPath = await open({
            directory: true,
            multiple: false,
          });

          if (userProvidedPath) {
            // Optionally normalize the path to remove any trailing slashes, etc.
            const normalizedPath = await path.normalize(userProvidedPath);

            // Read the contents of the directory
            const entries = await readDir(normalizedPath);

            setDiscoveredFiles(entries);
          }
        }}
      >
        Open Directory
      </button>
      {discoveredFiles.map((fileInDir) => {
        return <div key={`file-${fileInDir.name}`}>{fileInDir.name}</div>;
      })}

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
