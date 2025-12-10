export type Difficulty = "easy" | "medium" | "hard";

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  function: {
    name: string;
    params: Array<{ name: string; type: string }>;
    returns: string;
  };
  tests: Array<{
    name: string;
    input: any;
    output: any;
  }>;
}
