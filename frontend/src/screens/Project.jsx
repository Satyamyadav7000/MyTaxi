import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)

    const [ runProcess, setRunProcess ] = useState(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }


    function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("")

    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-dark-950 text-dark-100 rounded-xl p-3 border border-dark-700/50'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {

        initializeSocket(project._id)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }


        receiveMessage('project-message', data => {

            console.log(data)
            
            if (data.sender._id == 'ai') {


                const message = JSON.parse(data.message)

                console.log(message)

                webContainer?.mount(message.fileTree)

                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            } else {


                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            }
        })


        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {

            console.log(res.data.project)

            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {

            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex bg-dark-900'>
            {/* Chat Section */}
            <section className="left relative flex flex-col h-screen min-w-96 bg-dark-850 border-r border-dark-700/50">
                <header className='flex justify-between items-center p-3 px-4 w-full glass border-b border-dark-700/50 absolute z-10 top-0'>
                    <button className='flex items-center gap-2 text-dark-300 hover:text-nexus-400 transition-smooth text-sm' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-user-add-line"></i>
                        <span>Add collaborator</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-nexus-400 text-sm font-medium">{project.name}</span>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-800 rounded-lg transition-smooth'>
                            <i className="ri-group-fill"></i>
                        </button>
                    </div>
                </header>
                <div className="conversation-area pt-14 pb-12 flex-grow flex flex-col h-full relative">

                    <div
                        ref={messageBox}
                        className="message-box p-2 flex-grow flex flex-col gap-2 overflow-auto max-h-full">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'} message flex flex-col p-3 ${msg.sender._id === 'ai' ? 'glass-light' : msg.sender._id == user._id.toString() ? 'bg-nexus-600/20 border border-nexus-500/20' : 'bg-dark-800/60 border border-dark-700/30'} w-fit rounded-xl animate-fade-in-up`}>
                                <small className='text-nexus-400/70 text-xs font-medium'>{msg.sender.email}</small>
                                <div className='text-sm text-dark-200 mt-1'>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="inputField w-full flex absolute bottom-0 border-t border-dark-700/50">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            className='p-3 px-4 bg-dark-850 text-dark-100 border-none outline-none flex-grow placeholder-dark-500 text-sm'
                            type="text"
                            placeholder='Type a message... (use @ai for AI help)' />
                        <button
                            onClick={send}
                            className='px-5 btn-nexus text-white'><i className="ri-send-plane-fill"></i></button>
                    </div>
                </div>

                {/* Side Panel - Collaborators */}
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-dark-900 absolute transition-all duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 z-20`}>
                    <header className='flex justify-between items-center px-4 p-3 glass border-b border-dark-700/50'>
                        <h1 className='font-semibold text-lg text-dark-100'>Collaborators</h1>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-800 rounded-lg transition-smooth'>
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-1 p-2">
                        {project.users && project.users.map(user => {
                            return (
                                <div key={user._id} className="user cursor-pointer hover:bg-dark-800/50 p-3 flex gap-3 items-center rounded-xl transition-smooth">
                                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-600 to-teal-600 flex items-center justify-center text-white'>
                                        <i className="ri-user-fill text-sm"></i>
                                    </div>
                                    <div>
                                        <h1 className='font-medium text-dark-200 text-sm'>{user.email}</h1>
                                        <span className="text-xs text-nexus-400/60">Online</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Code Section */}
            <section className="right flex-grow h-full flex">

                {/* File Explorer */}
                <div className="explorer h-full max-w-64 min-w-52 bg-dark-850 border-r border-dark-700/50">
                    <div className="p-3 border-b border-dark-700/50">
                        <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Explorer</span>
                    </div>
                    <div className="file-tree w-full">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                    }}
                                    className={`tree-element cursor-pointer p-2 px-4 flex items-center gap-2 w-full text-left hover:bg-dark-800/50 transition-smooth ${currentFile === file ? 'bg-dark-800 border-l-2 border-nexus-500' : 'border-l-2 border-transparent'}`}>
                                    <i className="ri-file-code-line text-nexus-400/60 text-sm"></i>
                                    <p className='text-sm text-dark-300 font-medium'>{file}</p>
                                </button>))
                        }
                    </div>
                </div>

                {/* Code Editor */}
                <div className="code-editor flex flex-col flex-grow h-full shrink">

                    <div className="top flex justify-between w-full bg-dark-850 border-b border-dark-700/50">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 text-sm transition-smooth ${currentFile === file ? 'bg-dark-900 text-nexus-400 border-b-2 border-nexus-500' : 'bg-dark-850 text-dark-400 hover:text-dark-200 border-b-2 border-transparent'}`}>
                                        <p className='font-medium'>{file}</p>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2 p-1.5">
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree)


                                    const installProcess = await webContainer.spawn("npm", [ "install" ])



                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    if (runProcess) {
                                        runProcess.kill()
                                    }

                                    let tempRunProcess = await webContainer.spawn("npm", [ "start" ]);

                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    setRunProcess(tempRunProcess)

                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                    })

                                }}
                                className='px-4 py-1.5 rounded-lg btn-nexus text-white text-sm font-medium flex items-center gap-2'
                            >
                                <i className="ri-play-fill"></i>
                                Run
                            </button>


                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto bg-dark-900">
                        {
                            fileTree[ currentFile ] && (
                                <div className="code-editor-area h-full overflow-auto flex-grow">
                                    <pre
                                        className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none text-sm"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [ currentFile ]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                    </pre>
                                </div>
                            )
                        }
                    </div>

                </div>

                {/* Preview iframe */}
                {iframeUrl && webContainer &&
                    (<div className="flex min-w-96 flex-col h-full border-l border-dark-700/50">
                        <div className="address-bar bg-dark-850 border-b border-dark-700/50 flex items-center gap-2 p-2 px-3">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
                                <span className="w-3 h-3 rounded-full bg-nexus-500/60"></span>
                            </div>
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl}
                                className="w-full p-1.5 px-3 bg-dark-800 text-dark-300 text-xs rounded-lg border border-dark-700/50 focus:border-nexus-500/50 transition-smooth" />
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
                    </div>)
                }


            </section>

            {/* Add Collaborator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
                    <div className="glass p-5 rounded-2xl w-96 max-w-full mx-4 shadow-nexus-lg">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-semibold text-dark-100'>Add Collaborators</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-1 text-dark-400 hover:text-dark-200 transition-smooth'>
                                <i className="ri-close-fill text-xl"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-1 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user.id} className={`user cursor-pointer hover:bg-dark-800/50 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-nexus-500/10 border border-nexus-500/30' : 'border border-transparent'} p-3 flex gap-3 items-center rounded-xl transition-smooth`} onClick={() => handleUserClick(user._id)}>
                                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-nexus-600 to-teal-600 flex items-center justify-center text-white'>
                                        <i className="ri-user-fill text-sm"></i>
                                    </div>
                                    <h1 className='font-medium text-dark-200 text-sm'>{user.email}</h1>
                                    {Array.from(selectedUserId).indexOf(user._id) != -1 && (
                                        <i className="ri-check-line text-nexus-400 ml-auto"></i>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2.5 btn-nexus text-white rounded-xl font-medium text-sm'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project