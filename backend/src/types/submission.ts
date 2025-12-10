export interface SubmissionRequest {
    problemId: string;
    code: string;
    type?: 'run' | 'submit'; // Default to 'submit' if not present
}

export interface TestCaseResult {
    name: string;
    pass: boolean;
    expected: any;
    received: any;
    error?: string;
    logs?: string; // Captured stdout for this specific test case
}

export interface SubmissionResult {
    allPassed: boolean;
    results: TestCaseResult[];
    executionTimeMs?: number;
    error?: string; // General error (e.g. syntax error)
    logs?: string; // Captured stdout from user code
}
