// Mock Axios implementation to run frontend statically without a backend.
// Perfect for standalone resume/portfolio demos.

const mockUsers = [
    { _id: 'user1', email: 'collaborator1@mytaxi.com' },
    { _id: 'user2', email: 'developer2@mytaxi.com' },
    { _id: 'user3', email: 'designer3@mytaxi.com' }
];

const getLocalStorageData = (key, defaultVal) => {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const setLocalStorageData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const mockAxiosInstance = {
    interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
    },
    
    post: async (url, data) => {
        console.log(`[Mock API POST] ${url}`, data);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency

        if (url === '/users/register' || url === '/users/login') {
            const user = { _id: 'demo_user_id', email: data.email || 'guest@mytaxi.com' };
            localStorage.setItem('mock_user', JSON.stringify(user));
            return {
                data: {
                    user,
                    token: 'mock_jwt_token_for_demo'
                }
            };
        }

        if (url === '/projects/create') {
            const projects = getLocalStorageData('mock_projects', []);
            const newProj = {
                _id: 'proj_' + Math.random().toString(36).substr(2, 9),
                name: data.name,
                users: [{ _id: 'demo_user_id', email: 'guest@mytaxi.com' }],
                fileTree: {
                    'index.js': {
                        file: {
                            contents: "console.log('Welcome to MyTaxi editor!');\n\n// Press Run to execute"
                        }
                    },
                    'package.json': {
                        file: {
                            contents: '{\n  "name": "mytaxi-app",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js"\n  }\n}'
                        }
                    }
                }
            };
            projects.push(newProj);
            setLocalStorageData('mock_projects', projects);
            return { data: newProj };
        }

        throw new Error(`Mock POST route not implemented: ${url}`);
    },

    get: async (url) => {
        console.log(`[Mock API GET] ${url}`);
        await new Promise(resolve => setTimeout(resolve, 300));

        if (url === '/projects/all') {
            const projects = getLocalStorageData('mock_projects', []);
            return { data: { projects } };
        }

        if (url === '/users/all') {
            return { data: { users: mockUsers } };
        }

        // Get single project
        if (url.startsWith('/projects/get-project/')) {
            const projectId = url.split('/').pop();
            const projects = getLocalStorageData('mock_projects', []);
            const project = projects.find(p => p._id === projectId);
            if (project) {
                return { data: { project } };
            }
            throw new Error('Project not found');
        }

        throw new Error(`Mock GET route not implemented: ${url}`);
    },

    put: async (url, data) => {
        console.log(`[Mock API PUT] ${url}`, data);
        await new Promise(resolve => setTimeout(resolve, 200));

        if (url === '/projects/update-file-tree') {
            const projects = getLocalStorageData('mock_projects', []);
            const projectIndex = projects.findIndex(p => p._id === data.projectId);
            if (projectIndex !== -1) {
                projects[projectIndex].fileTree = data.fileTree;
                setLocalStorageData('mock_projects', projects);
                return { data: projects[projectIndex] };
            }
            throw new Error('Project not found');
        }

        if (url === '/projects/add-user') {
            const projects = getLocalStorageData('mock_projects', []);
            const projectIndex = projects.findIndex(p => p._id === data.projectId);
            if (projectIndex !== -1) {
                const addedUsers = mockUsers.filter(u => data.users.includes(u._id));
                // Add unique users
                addedUsers.forEach(u => {
                    if (!projects[projectIndex].users.some(existing => existing._id === u._id)) {
                        projects[projectIndex].users.push(u);
                    }
                });
                setLocalStorageData('mock_projects', projects);
                return { data: projects[projectIndex] };
            }
            throw new Error('Project not found');
        }

        throw new Error(`Mock PUT route not implemented: ${url}`);
    }
};

export default mockAxiosInstance;