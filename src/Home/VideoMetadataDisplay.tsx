import React, { useEffect, useState } from "react";
import { getVideoMetadata, VideoMetadata } from "@/utils/filetype-utilities";

interface Props {
  src: string;
  className?: string;
}

const VideoMetadataDisplay: React.FC<Props> = ({ src, className }: Props) => {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  useEffect(() => {
    async function fetchMetadata() {
      const metadata = await getVideoMetadata(src);
      setMetadata(metadata);
    }

    fetchMetadata();
  }, [src]);

  const cellClassname = "border border-gray-800 overflow-hidden rounded-lg fic cs-3";
  const labelClassname = "bg-gray-800 text-white px-3 py-1";
  const valueClassname = "fc grow px-3 py-1";

  if (!metadata) {
    return <></>;
  }

  return (
    <>
      <div className={cellClassname}>
        <div className={labelClassname}>Duration</div>
        <div className={valueClassname}>{Math.floor(metadata.duration)}s</div>
      </div>
      <div className={cellClassname}>
        <div className={labelClassname}>Width</div>
        <div className={valueClassname}>{Math.floor(metadata.width)}</div>
      </div>
      <div className={cellClassname}>
        <div className={labelClassname}>Height</div>
        <div className={valueClassname}>{Math.floor(metadata.height)}</div>
      </div>
      <div className={cellClassname}>
        <div className={labelClassname}>Ratio</div>
        <div className={valueClassname}>{metadata.aspectRatio.toFixed(2)}</div>
      </div>
    </>
  );
};

export default VideoMetadataDisplay;
