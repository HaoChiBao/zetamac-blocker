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

// Health check
app.get('/', (req, res) => {
    res.send('Lowkey Smarter Backend is running');
});

app.listen(Number(PORT), '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
