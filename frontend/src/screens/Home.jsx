import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState(null)
    const [ project, setProject ] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setIsModalOpen(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)

        }).catch(err => {
            console.log(err)
        })

    }, [])

    return (
        <main className='min-h-screen bg-dark-900 relative overflow-hidden'>
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-nexus-500/5 rounded-full blur-3xl"></div>

            {/* Header */}
            <header className="glass border-b border-dark-700/50 px-6 py-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nexus-500 to-teal-500 flex items-center justify-center">
                        <i className="ri-code-s-slash-line text-white text-lg"></i>
                    </div>
                    <h1 className="text-xl font-bold text-gradient">MyTaxi</h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-dark-400 text-sm hidden sm:block">{user?.email}</span>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token')
                            navigate('/login')
                        }}
                        className="text-dark-400 hover:text-dark-200 transition-smooth text-sm px-3 py-1.5 rounded-lg hover:bg-dark-800"
                    >
                        <i className="ri-logout-box-r-line mr-1"></i>
                        Logout
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="p-6 relative z-10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-dark-100 mb-1">Your Projects</h2>
                    <p className="text-dark-400 text-sm">Create and manage your collaborative workspaces</p>
                </div>

                <div className="projects flex flex-wrap gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group p-6 border-2 border-dashed border-dark-700 rounded-2xl hover:border-nexus-500/50 transition-smooth flex flex-col items-center justify-center min-w-[200px] min-h-[140px] hover:bg-dark-800/30">
                        <div className="w-12 h-12 rounded-xl bg-dark-800 group-hover:bg-nexus-500/10 flex items-center justify-center mb-3 transition-smooth">
                            <i className="ri-add-line text-2xl text-dark-400 group-hover:text-nexus-400 transition-smooth"></i>
                        </div>
                        <span className="text-dark-300 group-hover:text-dark-100 font-medium transition-smooth">New Project</span>
                    </button>

                    {
                        project.map((project) => (
                            <div key={project._id}
                                onClick={() => {
                                    navigate(`/project`, {
                                        state: { project }
                                    })
                                }}
                                className="group glass cursor-pointer p-6 rounded-2xl min-w-[200px] min-h-[140px] hover:shadow-nexus transition-smooth hover:border-nexus-500/30 flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-nexus-500/10 flex items-center justify-center mb-3">
                                        <i className="ri-folder-3-line text-nexus-400 text-lg"></i>
                                    </div>
                                    <h2 className='font-semibold text-dark-100 text-lg group-hover:text-nexus-300 transition-smooth'>{project.name}</h2>
                                </div>

                                <div className="flex gap-2 items-center mt-3 text-dark-400">
                                    <i className="ri-user-line text-sm"></i>
                                    <span className="text-xs">{project.users.length} collaborator{project.users.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm z-50 animate-fade-in-up">
                    <div className="glass p-6 rounded-2xl shadow-nexus-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-dark-100">Create New Project</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-dark-400 hover:text-dark-200 transition-smooth p-1">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-dark-300 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="w-full p-3 rounded-xl bg-dark-800/80 text-dark-100 border border-dark-700 focus:border-nexus-500 transition-smooth placeholder-dark-500"
                                    placeholder="Enter project name"
                                    required />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" className="px-5 py-2.5 rounded-xl bg-dark-800 text-dark-300 hover:bg-dark-700 transition-smooth font-medium text-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl btn-nexus text-white font-medium text-sm">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home