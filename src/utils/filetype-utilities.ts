import * as path from "@tauri-apps/api/path";
import { DirEntryWithComputed } from "@/types/fs-types";
import { DirEntry } from "@tauri-apps/plugin-fs";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { DirEntryForm } from "@/Stores/useFilesStore";

export function pathIsInDocumentsFolder(path: string): boolean {
  // Must strictly follow the format of /Users/someUsername/Documents

  // Ensure that the path starts with /Users
  if (!path.startsWith("/Users")) return false;

  // Ensure that the path contains some username after /Users
  if (path.split("/").length < 3) return false;

  // Ensure that the path contains Documents
  return path.includes("Documents");
}

export function getRelativePath(path: string) {}

export function extractRelativePath(fullPath: string, baseFolder: string) {
  const baseIndex = fullPath.indexOf(baseFolder);
  if (baseIndex === -1) {
    return null; // baseFolder not found
  }

  // Get the path after the base folder
  const afterBasePath = fullPath.slice(baseIndex + baseFolder.length);

  // Remove the file name at the end
  const lastSlashIndex = afterBasePath.lastIndexOf("/");
  if (lastSlashIndex === -1) {
    return null; // No valid relative path found
  }

  return afterBasePath.slice(0, lastSlashIndex + 1); // Include the trailing slash
}

export function getDocumentsPath(path: string) {
  // Given something like "C:/Users/username/Documents/videos/video.mp4", will return "C:/Users/username/Documents"

  const parts = path.split("/");
  return parts.slice(0, parts.length - 2).join("/");
}

/**
 * Given a filename, return the file type.
 */
export function getFileType(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts[parts.length - 1];
}

export function filterToVideoFiles(files: DirEntry[] | DirEntryWithComputed[]): DirEntry[] {
  const videoFiletypes = ["mp4", "mov", "mkv", "avi", "mov", "webm", "flv"];

  return files.filter((file) => {
    const fileType = getFileType(file.name);

    return videoFiletypes.includes(fileType);
  });
}

export function getFilename(filename: string) {
  // Get the filename without the extension but do not just split on "." since the title may contain periods
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) return filename; // No extension found
  return filename.substring(0, lastDotIndex);
}

export function getPathOfFile(filename: string): string {
  // Given something like "C:/Users/username/Documents/file.txt", will return "C:/Users/username/Documents"

  const parts = filename.split("/");
  parts.pop();
  return parts.join("/");
}

export type VideoMetadata = {
  duration: number;
  width: number;
  height: number;
  aspectRatio: number;
};

export function getVideoMetadata(src: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    // Create a video element to load the video
    const video = document.createElement("video");

    video.preload = "metadata"; // Only preload metadata (not the whole video)
    video.src = src; // Set the video source

    // Handle successful metadata loading
    video.onloadedmetadata = function () {
      resolve({
        duration: video.duration, // Video duration in seconds
        width: video.videoWidth, // Video width in pixels
        height: video.videoHeight, // Video height in pixels
        aspectRatio: video.videoWidth / video.videoHeight, // Aspect ratio
      });
      URL.revokeObjectURL(video.src); // Free up memory
    };

    // Handle errors (e.g., if video cannot be loaded)
    video.onerror = function () {
      reject(new Error("Failed to load video metadata."));
    };
  });
}

export async function fetchFileMetadata(filePath: string): Promise<number | undefined> {
  try {
    const createdAt = await invoke("get_file_metadata", { filePath });
    console.log("Created At: ", createdAt);
    return parseInt(createdAt as string);
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
}

export function calculateDynamicThreshold(timestamps: number[], scaleFactor = 2) {
  if (timestamps.length < 2) return 0; // No threshold for one or zero timestamps

  timestamps.sort((a, b) => a - b); // Sort timestamps in ascending order

  const differences = [];
  for (let i = 1; i < timestamps.length; i++) {
    differences.push(timestamps[i] - timestamps[i - 1]);
  }

  const averageDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
  return averageDifference * scaleFactor; // Return dynamic threshold based on average difference
}

export function clusterTimestamps(videoFilesWithPath: DirEntryForm[], threshold: number) {
  if (videoFilesWithPath.length === 0) return [];

  videoFilesWithPath.sort((a, b) => a.createdAt - b.createdAt); // Sort timestamps in ascending order
  const clusters = [];
  let currentCluster = [videoFilesWithPath[0]];

  for (let i = 1; i < videoFilesWithPath.length; i++) {
    const timeDiff = videoFilesWithPath[i].createdAt - videoFilesWithPath[i - 1].createdAt;

    if (timeDiff <= threshold) {
      // Add to the current cluster if within the threshold
      currentCluster.push(videoFilesWithPath[i]);
    } else {
      // Start a new cluster
      clusters.push(currentCluster);
      currentCluster = [videoFilesWithPath[i]];
    }
  }

  // Push the last cluster
  clusters.push(currentCluster);

  return clusters;
}
// Example usage
//   const videoTimestamps = [1, 2, 3, 8, 10, 11, 1000, 1020, 1040];
//   const threshold = ; // Define the time threshold (e.g., 20 seconds)
//   const clusters = clusterTimestamps(videoTimestamps, threshold);

//   console.log(clusters);
// Output: [[1, 2, 3], [8, 10, 11], [1000, 1020, 1040]]

export function secondsToHms(signedSeconds: number) {
  const seconds = Math.abs(signedSeconds);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}
