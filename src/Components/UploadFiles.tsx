import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpenIcon } from "@/Libs/Icons";
import { pathIsInDocumentsFolder } from "@/utils/filetype-utilities";
import { useFilesStore } from "@/Stores/useFilesStore";

export const UploadFiles = () => {
  const { loadFilesInDirectory } = useFilesStore();

  return (
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
  );
};
