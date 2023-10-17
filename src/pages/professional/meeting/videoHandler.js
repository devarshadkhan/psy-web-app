import React, { useEffect, useState } from "react";
import { Inviter, Registerer, SessionState, UserAgent } from "sip.js";

const App = () => {
  const [ID, setID] = useState("");
  const [Password, setPassword] = useState("");

  const transportOptions = {
    server: "wss://voip.psychica.com:8089/ws",
  };

  function onInvite(invitation) {
    invitation.accept();
  }

  function getLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        //window.localStream = stream;
        //window.localAudio.srcObject = stream;
        window.localAudio.autoplay = true;
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  }

  useEffect(() => {
    getLocalStream();
  }, []);

  // function assignStream(stream, element) {
  //   // Set element source.
  //   element.autoplay = true; // Safari does not allow calling .play() from a non user action
  //   element.srcObject = stream;

  //   // Load and start playback of media.
  //   element.play().catch((error) => {
  //     console.error("Failed to play media");
  //     console.error(error);
  //   });

  //   // If a track is added, load and restart playback of media.
  //   stream.onaddtrack = () => {
  //     element.load(); // Safari does not work otheriwse
  //     element.play().catch((error) => {
  //       console.error("Failed to play remote media on add track");
  //       console.error(error);
  //     });
  //   };

  //   // If a track is removed, load and restart playback of media.
  //   stream.onremovetrack = () => {
  //     element.load(); // Safari does not work otheriwse
  //     element.play().catch((error) => {
  //       console.error("Failed to play remote media on remove track");
  //       console.error(error);
  //     });
  //   };
  // }

  return (
    <div>
      <input onChange={(event) => setID(event.target.value)} />
      <input onChange={(event) => setPassword(event.target.value)} />
      <button role="button" onClick={(e) => ClickHandel(e)}>
        Click
      </button>
      <video id="mediaElement"></video>
    </div>
  );
};

export default App;
