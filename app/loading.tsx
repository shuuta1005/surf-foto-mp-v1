import Image from "next/image";
//import loader from "@/assets/loader.gif";
import waveLoader from "@/assets/wave-loader.gif";

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image src={waveLoader} height={300} width={300} alt="loang..." />
    </div>
  );
};

export default LoadingPage;
