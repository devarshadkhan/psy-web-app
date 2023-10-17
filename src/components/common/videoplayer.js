import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "@/styles/components/common/VideoPlayer.module.css";
import { BsPlayFill } from "react-icons/bs";
import ReactPlayer from "react-player";
import classNames from "classnames";
const VideoPlayer = ({ src }) => {
  const videoplayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className={classNames(styles.playerContainer, "position-relative")}>
      <ReactPlayer
        width="100%"
        height="100%"
        playing={isPlaying}
        onPause={() => setIsPlaying(false)}
        controls={isPlaying}
        ref={videoplayerRef}
        className={styles.video}
        url={src}
      />
      {!isPlaying && (
        <div
          role="button"
          onClick={() => setIsPlaying(true)}
          className={styles.payerButton}
        >
          <BsPlayFill className={styles.playerIcon} />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
