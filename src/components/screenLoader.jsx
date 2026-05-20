const ScreenLoader = () => {
    return (

        <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-[9999]">

            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

            <h2 className="mt-4 text-xl font-bold text-slate-800 animate-pulse">
                Digital Bank 🏦
            </h2>

            <p className="text-slate-500 text-sm mt-1">Securing your session...</p>

        </div>
    );
};

export default ScreenLoader;