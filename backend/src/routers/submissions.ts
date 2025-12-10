import express from 'express';
import { ProblemsService } from '../services/problems';
import { PythonRunner } from '../services/pythonRunner';
import { SubmissionRequest } from '../types/submission';

const router = express.Router();

router.post('/', async (req, res) => {
    const { problemId, code, type = 'submit' } = req.body as SubmissionRequest;

    if (!problemId || !code) {
        return res.status(400).json({ error: 'Missing problemId or code' });
    }

    const problem = ProblemsService.getById(problemId);
    if (!problem) {
        return res.status(404).json({ error: 'Problem not found' });
    }

    try {
        // If 'run', only use first 3 tests (or fewer if problem has fewer)
        let testsToRun = problem.tests;
        if (type === 'run') {
            testsToRun = problem.tests.slice(0, 3);
        }

        // Create a shallow copy with the subset of tests
        const problemSubset = { ...problem, tests: testsToRun };

        const result = await PythonRunner.runSubmission(code, problemSubset);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
