import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '@/pages/Auth/Login/index'
import Register from '@/pages/Auth/Register/index'
import NoPages from '@/components/NoPages'

const Auth = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NoPages />} />
        </Routes>
    )
}

export default Auth