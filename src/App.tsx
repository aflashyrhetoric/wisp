import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "./App.css";
import FileRenamer from "./Components/FileRenamer";
import { AppView } from "./types/app-types";
import VideoFilesGraphic from "./Illustrations/VideoFilesGraphic";
import { useFilesStore } from "./Stores/useFilesStore";
import { WaterDropIcon } from "./Libs/Icons";
import ChatIllustrationGraphic from "./Illustrations/ChatIllustrationGraphic";
import AddCaptions from "./Components/AddCaptions";

function App() {
  const { resetRegisteredFiles } = useFilesStore();
  const [view, setView] = useState<AppView>(AppView.Default);

  const goHome = () => {
    setView(AppView.Default);
  };

  return (
    <AnimatePresence>
      <div className="grid12 p-12 pt-5 font-inter">
        <header className={`bg-gray-800 cs-12 flex text-left p-5 rounded-2xl`}>
          <button
            onClick={() => {
              resetRegisteredFiles();
              setView(AppView.Default);
            }}
            className={`hover:italic`}
          >
            <h1 className="text-2xl font-light fic tracking-tight text-white">
              <WaterDropIcon className={`mr-1`} />
              <span className={`font-fredoka`}>wisp</span>
            </h1>
          </button>
        </header>
        {view === AppView.Default && (
          <div className="cs-12 grid12 tac gap-x-12 px-12">
            <div className="cs-12 py-4">
              <p className="font-bold tracking-tight text-2xl mt-4">
                Select Task
              </p>
            </div>

            <button
              className={`cs-4 border border-gray-300 fc p-8 py-20 flex-col bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer`}
              onClick={() => {
                setView(AppView.FileRenamer);
              }}
            >
              <VideoFilesGraphic />
              <p className="font-medium font-fredoka text-2xl mt-12 text-gray-700">
                Rename Footage
              </p>
            </button>
            <button
              className={`cs-4 border border-gray-300 fc p-8 py-20 flex-col bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer`}
              onClick={() => {
                setView(AppView.Captions);
              }}
            >
              <ChatIllustrationGraphic />
              <p className="font-medium font-fredoka text-2xl mt-12 text-gray-700">
                Add Captions
              </p>
            </button>
          </div>
        )}

        {view === AppView.FileRenamer && (
          <motion.div
            className="cs-12 grid12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FileRenamer goHome={goHome} />
          </motion.div>
        )}

        {view === AppView.Captions && (
          <motion.div
            className="cs-12 grid12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AddCaptions goHome={goHome} />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

export default App;
