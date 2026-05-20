import { Link } from "react-router-dom";

const Copyright = () => {
    return (

        <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 md:pt-16">

            <div className="max-w-7xl mx-auto px-6">

                {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Column 1: Brand Info */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="text-white text-xl font-bold mb-4">DigitalBank</h3>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Pakistan's leading digital banking platform. Fast, secure, and always with you.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link to="/press" className="hover:text-blue-400 transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-widest">Support</h4>
                        <p className="text-sm mb-2">help@digitalbank.pk</p>
                        <p className="text-sm font-medium text-slate-300">0800-12345</p>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left text-[11px] md:text-xs">
                    <p className="mb-4 md:mb-0">
                        © {new Date().getFullYear()} Digital Bank. Licensed by State Bank of Pakistan (Sandbox).
                    </p>

                    <div className="flex gap-6 uppercase tracking-widest font-medium">
                        <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>

        </footer>

    );
};

export default Copyright;