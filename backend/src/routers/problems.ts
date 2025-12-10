import express from 'express';
import { ProblemsService } from '../services/problems';
import { Difficulty } from '../types/problem';

const router = express.Router();

router.get('/', (req, res) => {
    const difficulty = req.query.difficulty as Difficulty | undefined;
    const problems = ProblemsService.getAll(difficulty);
    // Return metadata only to save bandwidth if needed, but for v1 full object is fine
    // Or map to summary
    const summary = problems.map(p => ({
        id: p.id,
        title: p.title,
        difficulty: p.difficulty,
        description: p.description, // Include description for preview?
        function: p.function
    }));
    res.json(summary);
});

router.get('/random', (req, res) => {
    const difficulty = req.query.difficulty as Difficulty | undefined;
    const problem = ProblemsService.getRandom(difficulty);
    if (!problem) {
        return res.status(404).json({ error: 'No problems found' });
    }
    res.json(problem);
});

router.get('/:id', (req, res) => {
    const problem = ProblemsService.getById(req.params.id);
    if (!problem) {
        return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
});

export default router;
