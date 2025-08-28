import { ClipLoader } from "react-spinners";

const Loading = ({ color = "", size = 10 }) => {
  return (
    <div>
      <ClipLoader color={color} size={size} />
    </div>
  );
};

export default Loading;
