import React, { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { MaximizeIcon, MinusIcon, XIcon } from "../Libs/Icons";

interface Props {
  className: string;
}

const Titlebar: React.FC<Props> = ({ className }: Props) => {
  // when using `"withGlobalTauri": true`, you may use
  // const { getCurrentWindow } = window.__TAURI__.window;

  const appWindow = getCurrentWindow();

  return (
    <>
      <div data-tauri-drag-region className="titlebar">
        <button
          className="titlebar-button"
          id="titlebar-close"
          onClick={() => {
            console.log({ appWindow });
            appWindow.close();
          }}
        >
          <XIcon alt="close" />
        </button>
        <button
          className="titlebar-button"
          id="titlebar-maximize"
          onClick={() => {
            appWindow.maximize();
          }}
        >
          <MaximizeIcon alt="maximize" />
        </button>
        <button
          className="titlebar-button"
          id="titlebar-minimize"
          onClick={() => {
            appWindow.minimize();
          }}
        >
          <MinusIcon alt="minimize" />
        </button>
      </div>
    </>
  );
};

export default Titlebar;
