import { Routes, Route } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Home from "@/pages/Frontend/Home"
import Feature from "@/pages/Frontend/Feature"
import Security from "@/pages/Frontend/Security"
import NoPages from "@/components/NoPages"

const index = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Feature />} />
                <Route path="/security" element={<Security />} />
                <Route path="*" element={<NoPages />} />
            </Routes>
            <Footer />
        </>
    )
}

export default index