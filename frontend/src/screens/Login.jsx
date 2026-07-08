import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Login = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()

    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data)

            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)

            navigate('/')
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-nexus-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>

            <div className="glass p-8 rounded-2xl shadow-nexus-lg w-full max-w-md animate-fade-in-up relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-500 to-teal-500 flex items-center justify-center">
                        <i className="ri-taxi-fill text-white text-xl"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-gradient">MyTaxi</h1>
                </div>

                <h2 className="text-xl font-semibold text-dark-100 mb-1">Welcome back</h2>
                <p className="text-dark-400 text-sm mb-6">Sign in to book a ride</p>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-dark-300 text-sm font-medium mb-2" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded-xl bg-dark-800/80 text-dark-100 border border-dark-700 focus:border-nexus-500 transition-smooth placeholder-dark-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-dark-300 text-sm font-medium mb-2" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-xl bg-dark-800/80 text-dark-100 border border-dark-700 focus:border-nexus-500 transition-smooth placeholder-dark-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded-xl btn-nexus text-white font-semibold text-sm tracking-wide"
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-dark-400 mt-6 text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-nexus-400 hover:text-nexus-300 font-medium transition-smooth">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default Login