import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import problemsRouter from './routers/problems';
import submissionsRouter from './routers/submissions';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    console.log(`[🚀 REQUEST] ${req.method} ${req.url} - ${timestamp}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const icon = status >= 400 ? '❌' : '✅';
        console.log(`[${icon} RESPONSE] ${req.method} ${req.url} ${status} - ${duration}ms`);
    });

    next();
});

// Routers
app.use('/problems', problemsRouter);
app.use('/submissions', submissionsRouter);

// Health check & API Directory
app.get('/', (req, res) => {
    res.json({
        service: 'Lowkey Smarter Backend',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: [
            { method: 'GET', path: '/', description: 'Heartbeat & API Directory' },
            { method: 'GET', path: '/problems', description: 'List all available coding problems' },
            { method: 'GET', path: '/problems/random', description: 'Get a random problem (optional query: ?difficulty=easy|medium|hard)' },
            { method: 'POST', path: '/submissions', description: 'Submit code for execution. Body: { problemId, code, type: "run"|"submit" }' }
        ]
    });
});

app.listen(Number(PORT), '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
