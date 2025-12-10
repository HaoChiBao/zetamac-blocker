import { CodingProblem } from "../types/problem";

const easyProblems: CodingProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume exactly one solution exists.",
    function: {
      name: "twoSum",
      params: [
        { name: "nums", type: "number[]" },
        { name: "target", type: "number" }
      ],
      returns: "number[]"
    },
    tests: [
      { name: "example 1", input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
      { name: "example 2", input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
      { name: "duplicates", input: { nums: [3, 3], target: 6 }, output: [0, 1] },
      { name: "negative numbers", input: { nums: [-1, -2, -3, -4, -5], target: -8 }, output: [2, 4] },
      { name: "zero sum", input: { nums: [0, 4, 3, 0], target: 0 }, output: [0, 3] }
    ]
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    function: {
      name: "isPalindrome",
      params: [
        { name: "x", type: "number" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "positive palindrome", input: { x: 121 }, output: true },
      { name: "negative number", input: { x: -121 }, output: false },
      { name: "not a palindrome", input: { x: 10 }, output: false },
      { name: "single digit", input: { x: 7 }, output: true },
      { name: "large palindrome", input: { x: 12321 }, output: true }
    ]
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    function: {
      name: "isValid",
      params: [
        { name: "s", type: "string" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "simple pair", input: { s: "()" }, output: true },
      { name: "mixed pairs", input: { s: "()[]{}" }, output: true },
      { name: "mismatch", input: { s: "(]" }, output: false },
      { name: "nested correct", input: { s: "([{}])" }, output: true },
      { name: "nested incorrect", input: { s: "([)]" }, output: false }
    ]
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    difficulty: "easy",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    function: {
      name: "searchInsert",
      params: [
        { name: "nums", type: "number[]" },
        { name: "target", type: "number" }
      ],
      returns: "number"
    },
    tests: [
      { name: "target found", input: { nums: [1, 3, 5, 6], target: 5 }, output: 2 },
      { name: "target insert middle", input: { nums: [1, 3, 5, 6], target: 2 }, output: 1 },
      { name: "target insert end", input: { nums: [1, 3, 5, 6], target: 7 }, output: 4 },
      { name: "target insert start", input: { nums: [1, 3, 5, 6], target: 0 }, output: 0 },
      { name: "empty array", input: { nums: [], target: 5 }, output: 0 }
    ]
  },
  {
    id: "plus-one",
    title: "Plus One",
    difficulty: "easy",
    description: "You are given a large integer represented as an integer array digits. Increment the large integer by one and return the resulting array of digits.",
    function: {
      name: "plusOne",
      params: [
        { name: "digits", type: "number[]" }
      ],
      returns: "number[]"
    },
    tests: [
      { name: "simple increment", input: { digits: [1, 2, 3] }, output: [1, 2, 4] },
      { name: "carry over", input: { digits: [4, 3, 2, 1] }, output: [4, 3, 2, 2] },
      { name: "single digit nine", input: { digits: [9] }, output: [1, 0] },
      { name: "multiple nines", input: { digits: [9, 9, 9] }, output: [1, 0, 0, 0] },
      { name: "carry over middle", input: { digits: [1, 9, 9] }, output: [2, 0, 0] }
    ]
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    function: {
      name: "climbStairs",
      params: [
        { name: "n", type: "number" }
      ],
      returns: "number"
    },
    tests: [
      { name: "two steps", input: { n: 2 }, output: 2 },
      { name: "three steps", input: { n: 3 }, output: 3 },
      { name: "one step", input: { n: 1 }, output: 1 },
      { name: "five steps", input: { n: 5 }, output: 8 },
      { name: "ten steps", input: { n: 10 }, output: 89 }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    description: "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    function: {
      name: "maxProfit",
      params: [
        { name: "prices", type: "number[]" }
      ],
      returns: "number"
    },
    tests: [
      { name: "standard profit", input: { prices: [7, 1, 5, 3, 6, 4] }, output: 5 },
      { name: "decreasing prices", input: { prices: [7, 6, 4, 3, 1] }, output: 0 },
      { name: "two days profit", input: { prices: [2, 4] }, output: 2 },
      { name: "two days loss", input: { prices: [4, 2] }, output: 0 },
      { name: "fluctuation", input: { prices: [2, 1, 2, 1, 0, 1, 2] }, output: 2 }
    ]
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "easy",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    function: {
      name: "isPalindrome",
      params: [
        { name: "s", type: "string" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "classic example", input: { s: "A man, a plan, a canal: Panama" }, output: true },
      { name: "race a car", input: { s: "race a car" }, output: false },
      { name: "empty string", input: { s: " " }, output: true },
      { name: "numbers only", input: { s: "12321" }, output: true },
      { name: "mixed chars", input: { s: "0P" }, output: false }
    ]
  },
  {
    id: "single-number",
    title: "Single Number",
    difficulty: "easy",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
    function: {
      name: "singleNumber",
      params: [
        { name: "nums", type: "number[]" }
      ],
      returns: "number"
    },
    tests: [
      { name: "simple pair", input: { nums: [2, 2, 1] }, output: 1 },
      { name: "multiple pairs", input: { nums: [4, 1, 2, 1, 2] }, output: 4 },
      { name: "single element", input: { nums: [1] }, output: 1 },
      { name: "negative numbers", input: { nums: [-1, -1, -2] }, output: -2 },
      { name: "larger array", input: { nums: [0, 1, 0, 1, 99] }, output: 99 }
    ]
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "easy",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    function: {
      name: "containsDuplicate",
      params: [
        { name: "nums", type: "number[]" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "has duplicate", input: { nums: [1, 2, 3, 1] }, output: true },
      { name: "distinct", input: { nums: [1, 2, 3, 4] }, output: false },
      { name: "multiple duplicates", input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, output: true },
      { name: "empty array", input: { nums: [] }, output: false },
      { name: "single element", input: { nums: [1] }, output: false }
    ]
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "easy",
    description: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Return the modified array.",
    function: {
      name: "moveZeroes",
      params: [
        { name: "nums", type: "number[]" }
      ],
      returns: "number[]"
    },
    tests: [
      { name: "mixed zeroes", input: { nums: [0, 1, 0, 3, 12] }, output: [1, 3, 12, 0, 0] },
      { name: "only zero", input: { nums: [0] }, output: [0] },
      { name: "no zeroes", input: { nums: [1, 2, 3] }, output: [1, 2, 3] },
      { name: "all zeroes", input: { nums: [0, 0, 0] }, output: [0, 0, 0] },
      { name: "leading zeroes", input: { nums: [0, 0, 1] }, output: [1, 0, 0] }
    ]
  },
  {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "easy",
    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    function: {
      name: "missingNumber",
      params: [
        { name: "nums", type: "number[]" }
      ],
      returns: "number"
    },
    tests: [
      { name: "missing 2", input: { nums: [3, 0, 1] }, output: 2 },
      { name: "missing 2 longer", input: { nums: [0, 1] }, output: 2 },
      { name: "missing 8", input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, output: 8 },
      { name: "missing 0", input: { nums: [1] }, output: 0 },
      { name: "missing 1", input: { nums: [0] }, output: 1 }
    ]
  },
  {
    id: "intersection-of-two-arrays",
    title: "Intersection of Two Arrays",
    difficulty: "easy",
    description: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.",
    function: {
      name: "intersection",
      params: [
        { name: "nums1", type: "number[]" },
        { name: "nums2", type: "number[]" }
      ],
      returns: "number[]"
    },
    tests: [
      { name: "simple intersection", input: { nums1: [1, 2, 2, 1], nums2: [2, 2] }, output: [2] },
      { name: "multiple intersection", input: { nums1: [4, 9, 5], nums2: [9, 4, 9, 8, 4] }, output: [9, 4] },
      { name: "no intersection", input: { nums1: [1, 2, 3], nums2: [4, 5, 6] }, output: [] },
      { name: "identical", input: { nums1: [1, 2], nums2: [1, 2] }, output: [1, 2] },
      { name: "one empty", input: { nums1: [], nums2: [1] }, output: [] }
    ]
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place.",
    function: {
      name: "reverseString",
      params: [
        { name: "s", type: "string[]" }
      ],
      returns: "string[]"
    },
    tests: [
      { name: "hello", input: { s: ["h", "e", "l", "l", "o"] }, output: ["o", "l", "l", "e", "h"] },
      { name: "Hannah", input: { s: ["H", "a", "n", "n", "a", "h"] }, output: ["h", "a", "n", "n", "a", "H"] },
      { name: "single char", input: { s: ["a"] }, output: ["a"] },
      { name: "two chars", input: { s: ["a", "b"] }, output: ["b", "a"] },
      { name: "empty", input: { s: [] }, output: [] }
    ]
  },
  {
    id: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "easy",
    description: "Given an integer n, return a string array where: answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, 'Fizz' if by 3, 'Buzz' if by 5, or i as a string.",
    function: {
      name: "fizzBuzz",
      params: [
        { name: "n", type: "number" }
      ],
      returns: "string[]"
    },
    tests: [
      { name: "n=3", input: { n: 3 }, output: ["1", "2", "Fizz"] },
      { name: "n=5", input: { n: 5 }, output: ["1", "2", "Fizz", "4", "Buzz"] },
      { name: "n=15", input: { n: 15 }, output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
      { name: "n=1", input: { n: 1 }, output: ["1"] },
      { name: "n=0", input: { n: 0 }, output: [] }
    ]
  },
  {
    id: "first-unique-character",
    title: "First Unique Character in a String",
    difficulty: "easy",
    description: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
    function: {
      name: "firstUniqChar",
      params: [
        { name: "s", type: "string" }
      ],
      returns: "number"
    },
    tests: [
      { name: "leetcode", input: { s: "leetcode" }, output: 0 },
      { name: "loveleetcode", input: { s: "loveleetcode" }, output: 2 },
      { name: "no unique", input: { s: "aabb" }, output: -1 },
      { name: "single char", input: { s: "z" }, output: 0 },
      { name: "long string", input: { s: "abcabcz" }, output: 6 }
    ]
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "easy",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    function: {
      name: "isAnagram",
      params: [
        { name: "s", type: "string" },
        { name: "t", type: "string" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "standard anagram", input: { s: "anagram", t: "nagaram" }, output: true },
      { name: "not anagram", input: { s: "rat", t: "car" }, output: false },
      { name: "diff length", input: { s: "a", t: "ab" }, output: false },
      { name: "same word", input: { s: "hello", t: "hello" }, output: true },
      { name: "empty strings", input: { s: "", t: "" }, output: true }
    ]
  },
  {
    id: "power-of-two",
    title: "Power of Two",
    difficulty: "easy",
    description: "Given an integer n, return true if it is a power of two. Otherwise, return false.",
    function: {
      name: "isPowerOfTwo",
      params: [
        { name: "n", type: "number" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "1 is power of 2", input: { n: 1 }, output: true },
      { name: "16 is power of 2", input: { n: 16 }, output: true },
      { name: "3 is not", input: { n: 3 }, output: false },
      { name: "negative not", input: { n: -16 }, output: false },
      { name: "zero not", input: { n: 0 }, output: false }
    ]
  },
  {
    id: "length-of-last-word",
    title: "Length of Last Word",
    difficulty: "easy",
    description: "Given a string s consisting of words and spaces, return the length of the last word in the string.",
    function: {
      name: "lengthOfLastWord",
      params: [
        { name: "s", type: "string" }
      ],
      returns: "number"
    },
    tests: [
      { name: "hello world", input: { s: "Hello World" }, output: 5 },
      { name: "trailing spaces", input: { s: "   fly me   to   the moon  " }, output: 4 },
      { name: "luffy", input: { s: "luffy is still joyboy" }, output: 6 },
      { name: "single word", input: { s: "Hello" }, output: 5 },
      { name: "single char", input: { s: "a" }, output: 1 }
    ]
  },
  {
    id: "ransom-note",
    title: "Ransom Note",
    difficulty: "easy",
    description: "Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine.",
    function: {
      name: "canConstruct",
      params: [
        { name: "ransomNote", type: "string" },
        { name: "magazine", type: "string" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "fail simple", input: { ransomNote: "a", magazine: "b" }, output: false },
      { name: "fail duplicate", input: { ransomNote: "aa", magazine: "ab" }, output: false },
      { name: "success", input: { ransomNote: "aa", magazine: "aab" }, output: true },
      { name: "empty note", input: { ransomNote: "", magazine: "abc" }, output: true },
      { name: "empty mag", input: { ransomNote: "a", magazine: "" }, output: false }
    ]
  },
  {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "easy",
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    function: {
      name: "longestCommonPrefix",
      params: [{ name: "strs", type: "string[]" }],
      returns: "string"
    },
    tests: [
      { name: "flower prefix", input: { strs: ["flower", "flow", "flight"] }, output: "fl" },
      { name: "no prefix", input: { strs: ["dog", "racecar", "car"] }, output: "" },
      { name: "identical", input: { strs: ["a", "a", "a"] }, output: "a" },
      { name: "single string", input: { strs: ["ab"] }, output: "ab" },
      { name: "empty array", input: { strs: [] }, output: "" }
    ]
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    function: {
      name: "mergeTwoLists",
      params: [
        { name: "list1", type: "ListNode" },
        { name: "list2", type: "ListNode" }
      ],
      returns: "ListNode"
    },
    tests: [
      { name: "example 1", input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] },
      { name: "example 2", input: { list1: [], list2: [] }, output: [] },
      { name: "example 3", input: { list1: [], list2: [0] }, output: [0] },
      { name: "disjoint ranges", input: { list1: [1, 2], list2: [3, 4] }, output: [1, 2, 3, 4] },
      { name: "interleaved", input: { list1: [1, 5], list2: [2, 6] }, output: [1, 2, 5, 6] }
    ]
  },
  {
    id: "remove-duplicates-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "easy",
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements.",
    function: {
      name: "removeDuplicates",
      params: [{ name: "nums", type: "number[]" }],
      returns: "number"
    },
    tests: [
      { name: "example 1", input: { nums: [1, 1, 2] }, output: 2 },
      { name: "example 2", input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, output: 5 },
      { name: "no duplicates", input: { nums: [1, 2, 3] }, output: 3 },
      { name: "all identical", input: { nums: [1, 1, 1] }, output: 1 },
      { name: "empty", input: { nums: [] }, output: 0 }
    ]
  },
  {
    id: "remove-element",
    title: "Remove Element",
    difficulty: "easy",
    description: "Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. Return the number of elements in nums which are not equal to val.",
    function: {
      name: "removeElement",
      params: [
        { name: "nums", type: "number[]" },
        { name: "val", type: "number" }
      ],
      returns: "number"
    },
    tests: [
      { name: "example 1", input: { nums: [3, 2, 2, 3], val: 3 }, output: 2 },
      { name: "example 2", input: { nums: [0, 1, 2, 2, 3, 0, 4, 2], val: 2 }, output: 5 },
      { name: "remove all", input: { nums: [1, 1, 1], val: 1 }, output: 0 },
      { name: "remove none", input: { nums: [1, 2, 3], val: 4 }, output: 3 },
      { name: "empty", input: { nums: [], val: 1 }, output: 0 }
    ]
  },
  {
    id: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "easy",
    description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array.",
    function: {
      name: "merge",
      params: [
        { name: "nums1", type: "number[]" },
        { name: "m", type: "number" },
        { name: "nums2", type: "number[]" },
        { name: "n", type: "number" }
      ],
      returns: "number[]"
    },
    tests: [
      { name: "standard merge", input: { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 }, output: [1, 2, 2, 3, 5, 6] },
      { name: "nums2 empty", input: { nums1: [1], m: 1, nums2: [], n: 0 }, output: [1] },
      { name: "nums1 empty", input: { nums1: [0], m: 0, nums2: [1], n: 1 }, output: [1] },
      { name: "unsorted end", input: { nums1: [4, 5, 6, 0, 0, 0], m: 3, nums2: [1, 2, 3], n: 3 }, output: [1, 2, 3, 4, 5, 6] },
      { name: "equal", input: { nums1: [1, 1, 0, 0], m: 2, nums2: [1, 1], n: 2 }, output: [1, 1, 1, 1] }
    ]
  },
  {
    id: "pascals-triangle",
    title: "Pascal's Triangle",
    difficulty: "easy",
    description: "Given an integer numRows, return the first numRows of Pascal's triangle.",
    function: {
      name: "generate",
      params: [{ name: "numRows", type: "number" }],
      returns: "number[][]"
    },
    tests: [
      { name: "5 rows", input: { numRows: 5 }, output: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]] },
      { name: "1 row", input: { numRows: 1 }, output: [[1]] },
      { name: "2 rows", input: { numRows: 2 }, output: [[1], [1, 1]] },
      { name: "3 rows", input: { numRows: 3 }, output: [[1], [1, 1], [1, 2, 1]] },
      { name: "4 rows", input: { numRows: 4 }, output: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]] }
    ]
  },
  {
    id: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    function: {
      name: "maxDepth",
      params: [{ name: "root", type: "TreeNode" }],
      returns: "number"
    },
    tests: [
      { name: "example 1", input: { root: [3, 9, 20, null, null, 15, 7] }, output: 3 },
      { name: "example 2", input: { root: [1, null, 2] }, output: 2 },
      { name: "empty tree", input: { root: [] }, output: 0 },
      { name: "single node", input: { root: [0] }, output: 1 },
      { name: "linear tree", input: { root: [1, 2, null, 3] }, output: 3 }
    ]
  },
  {
    id: "symmetric-tree",
    title: "Symmetric Tree",
    difficulty: "easy",
    description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    function: {
      name: "isSymmetric",
      params: [{ name: "root", type: "TreeNode" }],
      returns: "boolean"
    },
    tests: [
      { name: "symmetric", input: { root: [1, 2, 2, 3, 4, 4, 3] }, output: true },
      { name: "asymmetric", input: { root: [1, 2, 2, null, 3, null, 3] }, output: false },
      { name: "empty", input: { root: [] }, output: true },
      { name: "single", input: { root: [1] }, output: true },
      { name: "value mismatch", input: { root: [1, 2, 2, 3, null, null, 4] }, output: false }
    ]
  },
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "easy",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    function: {
      name: "invertTree",
      params: [{ name: "root", type: "TreeNode" }],
      returns: "TreeNode"
    },
    tests: [
      { name: "example 1", input: { root: [4, 2, 7, 1, 3, 6, 9] }, output: [4, 7, 2, 9, 6, 3, 1] },
      { name: "example 2", input: { root: [2, 1, 3] }, output: [2, 3, 1] },
      { name: "empty", input: { root: [] }, output: [] },
      { name: "single", input: { root: [1] }, output: [1] },
      { name: "left only", input: { root: [1, 2] }, output: [1, null, 2] }
    ]
  },
  {
    id: "same-tree",
    title: "Same Tree",
    difficulty: "easy",
    description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not.",
    function: {
      name: "isSameTree",
      params: [
        { name: "p", type: "TreeNode" },
        { name: "q", type: "TreeNode" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "same", input: { p: [1, 2, 3], q: [1, 2, 3] }, output: true },
      { name: "diff structure", input: { p: [1, 2], q: [1, null, 2] }, output: false },
      { name: "diff values", input: { p: [1, 2, 1], q: [1, 1, 2] }, output: false },
      { name: "both empty", input: { p: [], q: [] }, output: true },
      { name: "one empty", input: { p: [1], q: [] }, output: false }
    ]
  },
  {
    id: "path-sum",
    title: "Path Sum",
    difficulty: "easy",
    description: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.",
    function: {
      name: "hasPathSum",
      params: [
        { name: "root", type: "TreeNode" },
        { name: "targetSum", type: "number" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "example 1", input: { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], targetSum: 22 }, output: true },
      { name: "example 2", input: { root: [1, 2, 3], targetSum: 5 }, output: false },
      { name: "empty", input: { root: [], targetSum: 0 }, output: false },
      { name: "single equal", input: { root: [1], targetSum: 1 }, output: true },
      { name: "single not equal", input: { root: [1], targetSum: 2 }, output: false }
    ]
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "easy",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    function: {
      name: "hasCycle",
      params: [{ name: "head", type: "ListNode" }],
      returns: "boolean"
    },
    tests: [
      { name: "cycle pos 1", input: { head: [3, 2, 0, -4], pos: 1 }, output: true },
      { name: "cycle pos 0", input: { head: [1, 2], pos: 0 }, output: true },
      { name: "no cycle", input: { head: [1], pos: -1 }, output: false },
      { name: "empty", input: { head: [], pos: -1 }, output: false },
      { name: "long no cycle", input: { head: [1, 2, 3, 4], pos: -1 }, output: false }
    ]
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    function: {
      name: "reverseList",
      params: [{ name: "head", type: "ListNode" }],
      returns: "ListNode"
    },
    tests: [
      { name: "example 1", input: { head: [1, 2, 3, 4, 5] }, output: [5, 4, 3, 2, 1] },
      { name: "example 2", input: { head: [1, 2] }, output: [2, 1] },
      { name: "empty", input: { head: [] }, output: [] },
      { name: "single", input: { head: [1] }, output: [1] },
      { name: "three nodes", input: { head: [3, 2, 1] }, output: [1, 2, 3] }
    ]
  },
  {
    id: "palindrome-linked-list",
    title: "Palindrome Linked List",
    difficulty: "easy",
    description: "Given the head of a singly linked list, return true if it is a palindrome.",
    function: {
      name: "isPalindrome",
      params: [{ name: "head", type: "ListNode" }],
      returns: "boolean"
    },
    tests: [
      { name: "example 1", input: { head: [1, 2, 2, 1] }, output: true },
      { name: "example 2", input: { head: [1, 2] }, output: false },
      { name: "odd length palindrome", input: { head: [1, 2, 3, 2, 1] }, output: true },
      { name: "single", input: { head: [1] }, output: true },
      { name: "empty", input: { head: [] }, output: true }
    ]
  },
  {
    id: "majority-element",
    title: "Majority Element",
    difficulty: "easy",
    description: "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.",
    function: {
      name: "majorityElement",
      params: [{ name: "nums", type: "number[]" }],
      returns: "number"
    },
    tests: [
      { name: "example 1", input: { nums: [3, 2, 3] }, output: 3 },
      { name: "example 2", input: { nums: [2, 2, 1, 1, 1, 2, 2] }, output: 2 },
      { name: "single", input: { nums: [1] }, output: 1 },
      { name: "large majority", input: { nums: [5, 5, 5, 5, 1, 2, 3] }, output: 5 },
      { name: "negative", input: { nums: [-1, -1, 2] }, output: -1 }
    ]
  },
  {
    id: "happy-number",
    title: "Happy Number",
    difficulty: "easy",
    description: "Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat until the number equals 1 (happy), or loops endlessly.",
    function: {
      name: "isHappy",
      params: [{ name: "n", type: "number" }],
      returns: "boolean"
    },
    tests: [
      { name: "19 is happy", input: { n: 19 }, output: true },
      { name: "2 is not", input: { n: 2 }, output: false },
      { name: "1 is happy", input: { n: 1 }, output: true },
      { name: "7 is happy", input: { n: 7 }, output: true },
      { name: "4 is not", input: { n: 4 }, output: false }
    ]
  },
  {
    id: "isomorphic-strings",
    title: "Isomorphic Strings",
    difficulty: "easy",
    description: "Given two strings s and t, determine if they are isomorphic. Two strings s and t are isomorphic if the characters in s can be replaced to get t.",
    function: {
      name: "isIsomorphic",
      params: [
        { name: "s", type: "string" },
        { name: "t", type: "string" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "egg add", input: { s: "egg", t: "add" }, output: true },
      { name: "foo bar", input: { s: "foo", t: "bar" }, output: false },
      { name: "paper title", input: { s: "paper", t: "title" }, output: true },
      { name: "bad mapping", input: { s: "ab", t: "aa" }, output: false },
      { name: "empty", input: { s: "", t: "" }, output: true }
    ]
  },
  {
    id: "word-pattern",
    title: "Word Pattern",
    difficulty: "easy",
    description: "Given a pattern and a string s, find if s follows the same pattern. Here follow means a full match, such that there is a bijection between a letter in pattern and a non-empty word in s.",
    function: {
      name: "wordPattern",
      params: [
        { name: "pattern", type: "string" },
        { name: "s", type: "string" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "abba dog cat", input: { pattern: "abba", s: "dog cat cat dog" }, output: true },
      { name: "abba dog cat fish", input: { pattern: "abba", s: "dog cat fish dog" }, output: false },
      { name: "aaaa dog cat", input: { pattern: "aaaa", s: "dog cat cat dog" }, output: false },
      { name: "abba dog dog", input: { pattern: "abba", s: "dog dog dog dog" }, output: false },
      { name: "single", input: { pattern: "a", s: "dog" }, output: true }
    ]
  },
  {
    id: "add-binary",
    title: "Add Binary",
    difficulty: "easy",
    description: "Given two binary strings a and b, return their sum as a binary string.",
    function: {
      name: "addBinary",
      params: [
        { name: "a", type: "string" },
        { name: "b", type: "string" }
      ],
      returns: "string"
    },
    tests: [
      { name: "11 + 1", input: { a: "11", b: "1" }, output: "100" },
      { name: "1010 + 1011", input: { a: "1010", b: "1011" }, output: "10101" },
      { name: "zeroes", input: { a: "0", b: "0" }, output: "0" },
      { name: "diff length", input: { a: "111", b: "1" }, output: "1000" },
      { name: "1 + 1", input: { a: "1", b: "1" }, output: "10" }
    ]
  },
  {
    id: "sqrt-x",
    title: "Sqrt(x)",
    difficulty: "easy",
    description: "Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.",
    function: {
      name: "mySqrt",
      params: [{ name: "x", type: "number" }],
      returns: "number"
    },
    tests: [
      { name: "4", input: { x: 4 }, output: 2 },
      { name: "8", input: { x: 8 }, output: 2 },
      { name: "0", input: { x: 0 }, output: 0 },
      { name: "1", input: { x: 1 }, output: 1 },
      { name: "large", input: { x: 2147395600 }, output: 46340 }
    ]
  },
  {
    id: "number-of-1-bits",
    title: "Number of 1 Bits",
    difficulty: "easy",
    description: "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
    function: {
      name: "hammingWeight",
      params: [{ name: "n", type: "number" }],
      returns: "number"
    },
    tests: [
      { name: "11 (1011)", input: { n: 11 }, output: 3 },
      { name: "128 (10000000)", input: { n: 128 }, output: 1 },
      { name: "max", input: { n: 2147483645 }, output: 30 },
      { name: "0", input: { n: 0 }, output: 0 },
      { name: "3", input: { n: 3 }, output: 2 }
    ]
  },
  {
    id: "excel-sheet-column-number",
    title: "Excel Sheet Column Number",
    difficulty: "easy",
    description: "Given a string columnTitle that represents the column title as appears in an Excel sheet, return its corresponding column number.",
    function: {
      name: "titleToNumber",
      params: [{ name: "columnTitle", type: "string" }],
      returns: "number"
    },
    tests: [
      { name: "A", input: { columnTitle: "A" }, output: 1 },
      { name: "AB", input: { columnTitle: "AB" }, output: 28 },
      { name: "ZY", input: { columnTitle: "ZY" }, output: 701 },
      { name: "Z", input: { columnTitle: "Z" }, output: 26 },
      { name: "AA", input: { columnTitle: "AA" }, output: 27 }
    ]
  },
  {
    id: "valid-perfect-square",
    title: "Valid Perfect Square",
    difficulty: "easy",
    description: "Given a positive integer num, return true if num is a perfect square or false otherwise.",
    function: {
      name: "isPerfectSquare",
      params: [{ name: "num", type: "number" }],
      returns: "boolean"
    },
    tests: [
      { name: "16", input: { num: 16 }, output: true },
      { name: "14", input: { num: 14 }, output: false },
      { name: "1", input: { num: 1 }, output: true },
      { name: "large perfect", input: { num: 10000 }, output: true },
      { name: "large non-perfect", input: { num: 9999 }, output: false }
    ]
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    difficulty: "easy",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    function: {
      name: "fib",
      params: [{ name: "n", type: "number" }],
      returns: "number"
    },
    tests: [
      { name: "n=2", input: { n: 2 }, output: 1 },
      { name: "n=3", input: { n: 3 }, output: 2 },
      { name: "n=4", input: { n: 4 }, output: 3 },
      { name: "n=0", input: { n: 0 }, output: 0 },
      { name: "n=1", input: { n: 1 }, output: 1 }
    ]
  },
  {
    id: "third-maximum-number",
    title: "Third Maximum Number",
    difficulty: "easy",
    description: "Given an integer array nums, return the third distinct maximum number in this array. If the third maximum does not exist, return the maximum number.",
    function: {
      name: "thirdMax",
      params: [{ name: "nums", type: "number[]" }],
      returns: "number"
    },
    tests: [
      { name: "example 1", input: { nums: [3, 2, 1] }, output: 1 },
      { name: "example 2", input: { nums: [1, 2] }, output: 2 },
      { name: "example 3", input: { nums: [2, 2, 3, 1] }, output: 1 },
      { name: "duplicates only", input: { nums: [1, 1, 1] }, output: 1 },
      { name: "all distinct", input: { nums: [5, 4, 3, 2, 1] }, output: 3 }
    ]
  },
  {
    id: "keyboard-row",
    title: "Keyboard Row",
    difficulty: "easy",
    description: "Given an array of strings words, return the words that can be typed using letters of the alphabet on only one row of American keyboard like the image below.",
    function: {
      name: "findWords",
      params: [{ name: "words", type: "string[]" }],
      returns: "string[]"
    },
    tests: [
      { name: "example 1", input: { words: ["Hello", "Alaska", "Dad", "Peace"] }, output: ["Alaska", "Dad"] },
      { name: "example 2", input: { words: ["omk"] }, output: [] },
      { name: "example 3", input: { words: ["adsdf", "sfd"] }, output: ["adsdf", "sfd"] },
      { name: "empty", input: { words: [] }, output: [] },
      { name: "mixed case", input: { words: ["a", "A"] }, output: ["a", "A"] }
    ]
  },
  {
    id: "to-lower-case",
    title: "To Lower Case",
    difficulty: "easy",
    description: "Given a string s, return the string after replacing every uppercase letter with the same lowercase letter.",
    function: {
      name: "toLowerCase",
      params: [{ name: "s", type: "string" }],
      returns: "string"
    },
    tests: [
      { name: "Hello", input: { s: "Hello" }, output: "hello" },
      { name: "here", input: { s: "here" }, output: "here" },
      { name: "LOVELY", input: { s: "LOVELY" }, output: "lovely" },
      { name: "mixed", input: { s: "AlPhAbEt" }, output: "alphabet" },
      { name: "empty", input: { s: "" }, output: "" }
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "easy",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    function: {
      name: "search",
      params: [
        { name: "nums", type: "number[]" },
        { name: "target", type: "number" }
      ],
      returns: "number"
    },
    tests: [
      { name: "found", input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, output: 4 },
      { name: "not found", input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, output: -1 },
      { name: "single found", input: { nums: [5], target: 5 }, output: 0 },
      { name: "single not found", input: { nums: [5], target: -5 }, output: -1 },
      { name: "empty", input: { nums: [], target: 5 }, output: -1 }
    ]
  },
  {
    id: "can-place-flowers",
    title: "Can Place Flowers",
    difficulty: "easy",
    description: "You have a long flowerbed in which some of the plots are planted, and some are not. However, flowers cannot be planted in adjacent plots. Given an integer array flowerbed containing 0's and 1's, and an integer n, return if n new flowers can be planted.",
    function: {
      name: "canPlaceFlowers",
      params: [
        { name: "flowerbed", type: "number[]" },
        { name: "n", type: "number" }
      ],
      returns: "boolean"
    },
    tests: [
      { name: "place 1", input: { flowerbed: [1, 0, 0, 0, 1], n: 1 }, output: true },
      { name: "place 2", input: { flowerbed: [1, 0, 0, 0, 1], n: 2 }, output: false },
      { name: "empty bed", input: { flowerbed: [0, 0, 0], n: 2 }, output: true },
      { name: "no flowers", input: { flowerbed: [1, 0, 1], n: 0 }, output: true },
      { name: "single valid", input: { flowerbed: [0], n: 1 }, output: true }
    ]
  },
  {
    id: "detect-capital",
    title: "Detect Capital",
    difficulty: "easy",
    description: "We define the usage of capitals in a word to be right when one of the following cases holds: All letters are capitals, all letters are not capitals, or only the first letter is capital.",
    function: {
      name: "detectCapitalUse",
      params: [{ name: "word", type: "string" }],
      returns: "boolean"
    },
    tests: [
      { name: "USA", input: { word: "USA" }, output: true },
      { name: "FlaG", input: { word: "FlaG" }, output: false },
      { name: "leetcode", input: { word: "leetcode" }, output: true },
      { name: "Google", input: { word: "Google" }, output: true },
      { name: "g", input: { word: "g" }, output: true }
    ]
  }
];

export default easyProblems;