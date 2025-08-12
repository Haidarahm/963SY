import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-6xl font-bold text-[#F26A1B] mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#F26A1B] text-white rounded-md border-2 border-[#F26A1B] font-medium hover:bg-white hover:text-[#F26A1B] transition-all"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
