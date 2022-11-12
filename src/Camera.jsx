import React, { useCallback, useEffect, useRef, useState } from "react"; // check the useRef hook
import Webcam from "react-webcam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";

const Camera = () => {
  const start = () => {
    toast.success("right click on preview to save", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "info",
    });
  };

  const notify = () => {
    toast.success("Recording video", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "success",
    });
  };
  const download = () => {
    toast.success("your video is downloading", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [imgSrc, setImgSrc] = React.useState(null);

  // function save()
  // {
  //   window.open(toDataURL('image/png'));
  // //   var gh=(canvas.toDataURL('png'));
  // //   alert("converted");
  // }

  const capture = React.useCallback(() => {
    start();
    const imageSrc = webcamRef.current.getScreenshot();
    localStorage.setItem("imageSrc",imageSrc);
    setImgSrc(imageSrc);

    // download image
    const a = document.createElement('a');
    a.download = 'captured.jpeg'
    a.href = imageSrc;
    a.click();
  }, [webcamRef, setImgSrc]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    notify();
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      download();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      localStorage.setItem("capturedVideoURL", "react-webcam-stream-capture.webm");
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <section className=" h-[100vh] xl:h-[100vh] lg:h-[100vh] md:h-[100vh] sm:h-[100vh] xl:w-[100%]  w-full flex justify-center py-6  bg-cyan-900   ">
      <article className="h-[75vh] sm:h-[75vh] md:h-[75vh] lg:h-[65vh] xl:-[] 2xl:h-[]  w-auto  bg-white rounded-lg bg-opacity-10  shadow-xl shadow-slate-800">
        <div className="flex">
          <Webcam
            className="border-4 border-green-400"
            width={420}
            height={20}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
          <h1 className=" absolute top-8 ml-4 text-sm rounded-md   text-teal-50 bg-red-600 font-mono ">
            live capture
          </h1>
          {imgSrc && (
            <div>
              <img
                className=" border-4 border-green-400 relative "
                src={imgSrc}
              />
              <h1 className=" absolute top-8 ml-4 text-sm  rounded-md  text-teal-50 bg-slate-900 font-mono ">
                Preview
              </h1>
            </div>
          )}
        </div>

        {capturing ? (
          <button
            className="mt-4 ml-2  h-8 w-28 rounded-md hover:text-white hover:bg-green-400  ease-in-out duration-700   text-black font-mono bg-gray-300"
            onClick={handleStopCaptureClick}
          >
            Stop Capture
          </button>
        ) : (
          <button
            className="mt-4 ml-2   h-8 w-28 rounded-md hover:text-white hover:bg-green-400  ease-in-out duration-700   text-black font-mono bg-gray-300"
            onClick={handleStartCaptureClick}
          >
            create video
          </button>
        )}
        {recordedChunks.length > 0 && (
          <button
            className="mt-4 ml-2  h-8 w-20 rounded-md hover:text-white hover:bg-green-400  ease-in-out duration-700   text-black font-mono bg-gray-300"
            onClick={handleDownload}
          >
            Download
          </button>
        )}
        <button
          className="mt-4 ml-2  h-8 w-36 rounded-md hover:text-white hover:bg-green-400  ease-in-out duration-700   text-black font-mono bg-gray-300"
          onClick={capture}
        >
          Capture photo
        </button>
        {/* <button className="mt-4 ml-2  h-8 w-52 rounded-md hover:text-white hover:bg-green-400  ease-in-out duration-700   text-black font-mono bg-gray-300" >Click to save image</button> */}
        {/* <>
      <Webcam
      className="border-b-4 border-green-400"  width={420} height={20}
        audio={false}
       
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        
        // videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
    </> */}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Flip}
        />
      </article>
    </section>
  );
};

export default Camera;
