import { motion } from "framer-motion";
import { FaPaintBrush } from "react-icons/fa";

const ArtBlobLoader = () => {
  return (
    // <div className="fixed inset-0 bg-gradient-to-br from-[#FDF6F0] to-[#F6F8FF] flex items-center justify-center z-[9999]">
    //   <motion.div
    //     className="absolute w-72 h-72 bg-[#FF6666] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
    //     animate={{
    //       scale: [1, 1.2, 1],
    //       x: [0, 50, -50, 0],
    //       y: [0, -50, 50, 0],
    //     }}
    //     transition={{
    //       duration: 6,
    //       repeat: Infinity,
    //       ease: "easeInOut",
    //     }}
    //   />

    //   <motion.div
    //     className="absolute w-72 h-72 bg-[#081F62] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
    //     animate={{
    //       scale: [1, 1.3, 1],
    //       x: [0, -60, 60, 0],
    //       y: [0, 60, -60, 0],
    //     }}
    //     transition={{
    //       duration: 7,
    //       repeat: Infinity,
    //       ease: "easeInOut",
    //     }}
    //   />

    //   <motion.div
    //     className="absolute w-72 h-72 bg-[#22C1C3] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
    //     animate={{
    //       scale: [1, 1.4, 1],
    //       x: [0, 70, -70, 0],
    //       y: [0, -70, 70, 0],
    //     }}
    //     transition={{
    //       duration: 8,
    //       repeat: Infinity,
    //       ease: "easeInOut",
    //     }}
    //   />

    //   <div className="relative z-10">
    //     <p className="text-4xl font-extrabold text-[#081F62] animate-pulse">
    //       Loading Art...
    //     </p>
    //   </div>
    // </div>
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 120 120"
        className="absolute"
      >
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          stroke="#081F62"
          strokeWidth="4"
          fill="none"
          strokeDasharray="314"
          strokeDashoffset="314"
          animate={{
            strokeDashoffset: [314, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
      <FaPaintBrush className="text-primary text-4xl animate-pulse" />
    </div>
  );
};

export default ArtBlobLoader;
