import { ToastContainer, toast } from "react-toastify";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const notify = (message, type) => {
  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case "success":
      toast.success(message, {
        ...toastOptions,
        icon: <FaCheckCircle style={{ color: "#fff", fontSize: "20px" }} />,
        style: { backgroundColor: "#4caf50", color: "#fff" },
      });
      break;
    case "error":
      toast.error(message, {
        ...toastOptions,
        icon: <FaTimesCircle style={{ color: "#fff", fontSize: "20px" }} />,
        style: { backgroundColor: "#dc2626", color: "#fff" },
      });
      break;
    case "warning":
      toast.warn(message, {
        ...toastOptions,
        icon: (
          <FaExclamationCircle style={{ color: "#fff", fontSize: "20px" }} />
        ),
        style: { backgroundColor: "#ff9800", color: "#fff" },
      });
      break;
    default:
      toast.info(message, {
        ...toastOptions,
        icon: (
          <FaExclamationCircle style={{ color: "#fff", fontSize: "20px" }} />
        ),
        style: { backgroundColor: "#2196f3", color: "#fff" },
      });
  }
};

const Toast = () => <ToastContainer />;
//  <ToastContainer
//    toastClassName="custom-toast"
//    closeButton={({ closeToast }) => (
//      <button
//        onClick={closeToast}
//        style={{
//          color: "#fff",
//          fontSize: "16px",
//          border: "none",
//          background: "transparent",
//          cursor: "pointer",
//        }}
//      >
//        ✖
//      </button>
//    )}
//  />;
export { Toast, notify };
