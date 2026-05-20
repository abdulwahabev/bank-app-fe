import { Link } from "react-router-dom";

const NoPages = () => {
    return (

        <main>

            <div className="h-screen flex flex-col items-center justify-center bg-white font-sans p-4">

                {/* Simple Text Error */}
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <h2 className="text-xl font-medium text-red-600 mt-2">Page Not Found</h2>

                {/* Plain Button */}
                <Link to="/" className="text-blue-600 font-semibold border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-all">
                    Back to Home
                </Link>

            </div>

        </main>
    );
};

export default NoPages;