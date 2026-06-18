import { useNavigate } from "react-router-dom";
import Button from "../../components/common/button/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
      <h1 className="text-7xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>

      <p className="mt-2 text-center text-gray-500">
        Sorry, the page you are looking for doesn't exist.
      </p>

      <Button
      name="Go Back"
        onClick={() => navigate("/")}
        className="mt-6 rounded bg-primary px-6 py-2 text-white"
      />
    </div>
  );
};

export default NotFoundPage;
