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
