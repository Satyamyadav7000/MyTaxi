// Mock Socket.IO client implementation for client-side standalone demo.
// Simulates live chat messages and AI responses locally.

let listeners = {};
let currentProjectId = null;

const triggerEvent = (eventName, data) => {
    if (listeners[eventName]) {
        listeners[eventName].forEach(cb => cb(data));
    }
};

export const initializeSocket = (projectId) => {
    console.log(`[Mock Socket] Initialized for project ${projectId}`);
    currentProjectId = projectId;
    listeners = {};

    // Simulate collaborator joining after 2 seconds
    setTimeout(() => {
        triggerEvent('project-message', {
            sender: { _id: 'user1', email: 'collaborator1@mytaxi.com' },
            message: 'Hey! I just joined the workspace.'
        });
    }, 2000);

    return {
        disconnect: () => console.log('[Mock Socket] Disconnected')
    };
};

export const receiveMessage = (eventName, cb) => {
    if (!listeners[eventName]) {
        listeners[eventName] = [];
    }
    listeners[eventName].push(cb);
};

export const sendMessage = (eventName, data) => {
    console.log(`[Mock Socket] Send event: ${eventName}`, data);

    if (eventName === 'project-message') {
        const messageText = data.message;

        // If message is addressed to @ai
        if (messageText.includes('@ai')) {
            const userPrompt = messageText.replace('@ai', '').trim();
            
            // Simulate AI thinking and replying
            setTimeout(() => {
                const aiResponse = {
                    text: `Here is a sample code structure for your request: "${userPrompt}"`,
                    fileTree: {
                        'sample.js': {
                            file: {
                                contents: `// AI Generated code\nfunction helloWorld() {\n  console.log("Hello from MyTaxi AI!");\n}\nhelloWorld();`
                            }
                        }
                    }
                };

                triggerEvent('project-message', {
                    sender: { _id: 'ai', email: 'AI' },
                    message: JSON.stringify(aiResponse)
                });
            }, 1500);
        } else {
            // Simulate collaborator typing/replying to user
            setTimeout(() => {
                const mockReplies = [
                    'Nice code!',
                    'Looking good, let me know if you need help.',
                    'Can we add a new file?',
                    'I will test this layout now.'
                ];
                const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];

                triggerEvent('project-message', {
                    sender: { _id: 'user2', email: 'developer2@mytaxi.com' },
                    message: randomReply
                });
            }, 2500);
        }
    }
};