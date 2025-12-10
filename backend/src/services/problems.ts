import { CodingProblem, Difficulty } from "../types/problem";
import easyProblems from "../problems/easy";

const allProblems: CodingProblem[] = [
    ...easyProblems
];

export const ProblemsService = {
    getAll: (difficulty?: Difficulty) => {
        if (difficulty) {
            return allProblems.filter(p => p.difficulty === difficulty);
        }
        return allProblems;
    },

    getById: (id: string) => {
        return allProblems.find(p => p.id === id);
    },

    getRandom: (difficulty?: Difficulty) => {
        const filtered = difficulty ? allProblems.filter(p => p.difficulty === difficulty) : allProblems;
        if (filtered.length === 0) return null;
        return filtered[Math.floor(Math.random() * filtered.length)];
    }
};
