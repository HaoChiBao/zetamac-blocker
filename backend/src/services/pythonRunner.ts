import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { CodingProblem } from '../types/problem';
import { SubmissionResult, TestCaseResult } from '../types/submission';
import os from 'os';

export const PythonRunner = {
    runSubmission: async (code: string, problem: CodingProblem): Promise<SubmissionResult> => {
        // TODO: Use a secure sandbox (e.g. Docker, nsjail) for production.
        // This implementation runs code directly on the host, which is unsafe.
        
        const tempDir = os.tmpdir();
        const tempFile = path.join(tempDir, `submission_${Date.now()}_${Math.random().toString(36).substring(7)}.py`);

        // Construct the harness
        // We will print JSON results to stdout for each test case
        
        const harness = `
import json
import sys
from typing import *

# Data Structure Definitions
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    def __repr__(self):
        return f"ListNode({self.val})"

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
    def __repr__(self):
        return f"TreeNode({self.val})"

# Helpers
def deserialize_list_node(data):
    if not data: return None
    dummy = ListNode(0)
    curr = dummy
    for val in data:
        curr.next = ListNode(val)
        curr = curr.next
    return dummy.next

def serialize_list_node(head):
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return res

def deserialize_tree_node(data):
    if not data: return None
    root = TreeNode(data[0])
    queue = [root]
    i = 1
    while i < len(data):
        node = queue.pop(0)
        if i < len(data) and data[i] is not None:
            node.left = TreeNode(data[i])
            queue.append(node.left)
        i += 1
        if i < len(data) and data[i] is not None:
            node.right = TreeNode(data[i])
            queue.append(node.right)
        i += 1
    return root

def serialize_tree_node(root):
    if not root: return []
    res = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            res.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            res.append(None)
    # Trim trailing Nones
    while res and res[-1] is None:
        res.pop()
    return res

# User Code
${code}

import io

# Test Harness
def run_tests():
    results = []
    all_passed = True
    
    # Save original stdout
    old_stdout = sys.stdout

    try:
        # Safe JSON parsing
        tests_json = '${JSON.stringify(problem.tests).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'
        tests = json.loads(tests_json)
        
        params_metadata = ${JSON.stringify(problem.function.params)}
        return_type = '${problem.function.returns}'

        for test in tests:
            test_name = test['name']
            inputs = test['input']
            expected = test['output']
            
            # Capture stdout for this test
            sys.stdout = capture = io.StringIO()
            test_logs = ""
            
            try:
                # Prepare arguments
                args = []
                for p in params_metadata:
                    val = inputs[p['name']]
                    if p['type'] == 'ListNode':
                        val = deserialize_list_node(val)
                    elif p['type'] == 'TreeNode':
                        val = deserialize_tree_node(val)
                    args.append(val)
                
                # Call user function
                func_name = '${problem.function.name}'
                if 'Solution' in globals():
                    sol = globals()['Solution']()
                    if hasattr(sol, func_name):
                        user_func = getattr(sol, func_name)
                        received = user_func(*args)
                    else:
                         raise Exception(f"Method '{func_name}' not found in Solution class")
                elif func_name in globals():
                    user_func = globals()[func_name]
                    received = user_func(*args)
                else:
                    raise Exception(f"Function '{func_name}' not found")
                
                # Serialize result if needed for comparison
                serialized_received = received
                if return_type == 'ListNode':
                    serialized_received = serialize_list_node(received)
                elif return_type == 'TreeNode':
                    serialized_received = serialize_tree_node(received)
                
                # Compare
                passed = (serialized_received == expected)
                if not passed:
                    all_passed = False
                    
                # Get logs before restoring stdout
                test_logs = capture.getvalue()
                
                results.append({
                    'name': test_name,
                    'pass': passed,
                    'expected': expected,
                    'received': serialized_received,
                    'logs': test_logs
                })
                
            except Exception as e:
                all_passed = False
                test_logs = capture.getvalue()
                results.append({
                    'name': test_name,
                    'pass': False,
                    'expected': expected,
                    'received': None,
                    'error': str(e),
                    'logs': test_logs
                })
            finally:
                sys.stdout = old_stdout

    except Exception as e:
        all_passed = False
        results.append({'error': str(e)})
            
    print(json.dumps({'allPassed': all_passed, 'results': results}))

if __name__ == '__main__':
    try:
        run_tests()
    except Exception as e:
        print(json.dumps({'error': str(e)}))
`;

        try {
            await fs.promises.writeFile(tempFile, harness);

            return new Promise((resolve) => {
                const pythonProcess = spawn('python', [tempFile]);
                
                let stdoutData = '';
                let stderrData = '';

                // Timeout
                const timeout = setTimeout(() => {
                    pythonProcess.kill();
                    resolve({
                        allPassed: false,
                        results: [],
                        error: 'Execution timed out'
                    });
                }, 5000); // 5s timeout

                pythonProcess.stdout.on('data', (data) => {
                    stdoutData += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    stderrData += data.toString();
                });

                pythonProcess.on('close', (code) => {
                    clearTimeout(timeout);
                    // Cleanup temp file
                    fs.unlink(tempFile, () => {});

                    if (code !== 0 && stderrData) {
                         resolve({
                            allPassed: false,
                            results: [],
                            error: `Runtime Error: ${stderrData}`
                        });
                        return;
                    }

                    try {
                        const result = JSON.parse(stdoutData.trim());
                        if (result.error) {
                             resolve({
                                allPassed: false,
                                results: [],
                                error: result.error
                            });
                        } else {
                            resolve(result as SubmissionResult);
                        }
                    } catch (e) {
                        resolve({
                            allPassed: false,
                            results: [],
                            error: `Failed to parse output: ${stdoutData} (Stderr: ${stderrData})`
                        });
                    }
                });
            });

        } catch (e: any) {
            return {
                allPassed: false,
                results: [],
                error: `System Error: ${e.message}`
            };
        }
    }
};
