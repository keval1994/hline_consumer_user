import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
const Breadcrumb = ({ pageName }) => {
  return (
    <div className="mb-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm md:text-base text-gray-600">
          <li className="flex items-center text-xl">
            <Link to="/" className="text-primary hover:text-accent font-medium">
              Home
            </Link>
            <FaChevronRight className="ml-2 text-accent text-2xl md:text-xl" />
          </li>
          <li className="ml-2 font-semibold text-primary text-xl">
            {pageName}
          </li>
        </ol>
      </nav>
    </div>
  );
};
export default Breadcrumb;
