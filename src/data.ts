import { Candidate, InterviewSession, Question } from './types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Algorithms',
    description: 'Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.',
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Write your code here\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) {\n            return [map.get(diff), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
      python: `def two_sum(nums, target):\n    # Write your code here\n    hash_map = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in hash_map:\n            return [hash_map[diff], i]\n        hash_map[num] = i\n    return []`,
      go: `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    m := make(map[int]int)\n    for i, num := range nums {\n        diff := target - num\n        if idx, found := m[diff]; found {\n            return []int{idx, i}\n        }\n        m[num] = i\n    }\n    return nil\n}`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}`
    },
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]' },
      { input: 'nums = [3,2,4], target = 6', expected: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', expected: '[0, 1]' }
    ]
  },
  {
    id: 'q2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Data Structures',
    description: 'Given a string `s` containing just the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'` and `\']\'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    starterCode: {
      javascript: `function isValid(s) {\n    // Write your code here\n    const stack = [];\n    const map = {\n        \')\': \'(\',\n        \'}\': \'{\',\n        \']\': \'[\'\n    };\n    for (let char of s) {\n        if (char in map) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}`,
      python: `def is_valid(s: str) -> bool:\n    # Write your code here\n    stack = []\n    bracket_map = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in bracket_map:\n            top_element = stack.pop() if stack else \'#\'\n            if bracket_map[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack`,
      go: `func isValid(s string) bool {\n    // Write your code here\n    stack := []rune{}\n    brackets := map[rune]rune{\')\': \'(\', \'}\': \'{\', \']\': \'[\'}\n    for _, char := range s {\n        if match, exists := brackets[char]; exists {\n            if len(stack) == 0 || stack[len(stack)-1] != match {\n                return false\n            }\n            stack = stack[:len(stack)-1]\n        } else {\n            stack = append(stack, char)\n        }\n    }\n    return len(stack) == 0\n}`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\' || c == \'{\' || c == \'[\') {\n                stack.push(c);\n            } else if (c == \')\' && !stack.isEmpty() && stack.peek() == \'(\') {\n                stack.pop();\n            } else if (c == \'}\' && !stack.isEmpty() && stack.peek() == \'{\') {\n                stack.pop();\n            } else if (c == \']\' && !stack.isEmpty() && stack.peek() == \'[\') {\n                stack.pop();\n            } else {\n                return false;\n            }\n        }\n        return stack.isEmpty();\n    }\n}`
    },
    testCases: [
      { input: 's = "()"', expected: 'true' },
      { input: 's = "()[]{}"', expected: 'true' },
      { input: 's = "(]"', expected: 'false' }
    ]
  },
  {
    id: 'q3',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Algorithms',
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return *an array of the non-overlapping intervals that cover all the intervals in the input*.',
    starterCode: {
      javascript: `function merge(intervals) {\n    // Write your code here\n    if (intervals.length <= 1) return intervals;\n    intervals.sort((a, b) => a[0] - b[0]);\n    const merged = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const current = intervals[i];\n        const lastMerged = merged[merged.length - 1];\n        if (current[0] <= lastMerged[1]) {\n            lastMerged[1] = Math.max(lastMerged[1], current[1]);\n        } else {\n            merged.push(current);\n        }\n    }\n    return merged;\n}`,
      python: `def merge(intervals):\n    # Write your code here\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged`,
      go: `func merge(intervals [][]int) [][]int {\n    // Write your code here\n    return nil\n}`,
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return null;\n    }\n}`
    },
    testCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', expected: '[[1,5]]' }
    ]
  },
  {
    id: 'q4',
    title: 'LRU Cache',
    difficulty: 'Hard',
    category: 'Data Structures',
    description: 'Design a data structure that follows the constraints of a **Least Recently Used (LRU) Cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the key exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.',
    starterCode: {
      javascript: `class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.cache = new Map();\n    }\n\n    get(key) {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key);\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n\n    put(key, value) {\n        if (this.cache.has(key)) {\n            this.cache.delete(key);\n        }\n        this.cache.set(key, value);\n        if (this.cache.size > this.capacity) {\n            const firstKey = this.cache.keys().next().value;\n            this.cache.delete(firstKey);\n        }\n    }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass`,
      go: `type LRUCache struct {\n\n}\n\nfunc Constructor(capacity int) LRUCache {\n    return LRUCache{}\n}`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}`
    },
    testCases: [
      { input: 'LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1);', expected: '1' }
    ]
  },
  {
    id: 'q5',
    title: 'Design Twitter',
    difficulty: 'Medium',
    category: 'System Design',
    description: 'Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in the user\'s news feed.\n\nImplement the `Twitter` class:\n- `void postTweet(userId, tweetId)` Composes a new tweet.\n- `List<Integer> getNewsFeed(userId)` Retrieve the 10 most recent tweet IDs in the user\'s news feed.\n- `void follow(followerId, followeeId)` Follower follows a followee.\n- `void unfollow(followerId, followeeId)` Follower unfollows a followee.',
    starterCode: {
      javascript: `class Twitter {\n    constructor() {\n        \n    }\n    postTweet(userId, tweetId) {}\n    getNewsFeed(userId) {}\n    follow(followerId, followeeId) {}\n    unfollow(followerId, followeeId) {}\n}`,
      python: `class Twitter:\n    def __init__(self):\n        pass\n    def post_tweet(self, user_id: int, tweet_id: int) -> None:\n        pass\n    def get_news_feed(self, user_id: int) -> list:\n        pass`,
      go: `type Twitter struct {}\nfunc Constructor() Twitter { return Twitter{} }`,
      java: `class Twitter {\n    public Twitter() {}\n}`
    },
    testCases: [
      { input: 'Twitter twitter = new Twitter(); twitter.postTweet(1, 5); twitter.getNewsFeed(1);', expected: '[5]' }
    ]
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    status: 'Active',
    appliedRole: 'Senior Frontend Engineer',
    averageScore: 4.5,
    lastInterviewDate: '2026-06-25',
    notes: 'Incredible React & system architecture skills. Code is clean and modular.'
  },
  {
    id: 'c2',
    name: 'John Smith',
    email: 'john.smith@techcorp.io',
    status: 'Passed',
    appliedRole: 'Backend Engineer II',
    averageScore: 4.8,
    lastInterviewDate: '2026-06-20',
    notes: 'Excellent grasp of concurrency in Go and database query optimizations.'
  },
  {
    id: 'c3',
    name: 'Alice Johnson',
    email: 'alice.j@innovate.co',
    status: 'Failed',
    appliedRole: 'Senior Infrastructure Architect',
    averageScore: 2.1,
    lastInterviewDate: '2026-06-18',
    notes: 'Failed basic coding checks. Had trouble describing distributed transactions.'
  },
  {
    id: 'c4',
    name: 'Bob Miller',
    email: 'bob.m@devops.net',
    status: 'Pending',
    appliedRole: 'DevOps Engineer',
    averageScore: 0,
    lastInterviewDate: 'Pending',
    notes: 'Strong resume detailing Kubernetes operator creations.'
  },
  {
    id: 'c5',
    name: 'Sofia Rodriguez',
    email: 'sofia.r@dataanalytics.com',
    status: 'Active',
    appliedRole: 'Staff Data Scientist',
    averageScore: 3.9,
    lastInterviewDate: '2026-06-24',
    notes: 'Great statistical foundation, but needs to work on Python execution efficiency.'
  },
  {
    id: 'c6',
    name: 'David Chen',
    email: 'd.chen@cloudbuilders.dev',
    status: 'Pending',
    appliedRole: 'Full Stack Developer',
    averageScore: 0,
    lastInterviewDate: 'Pending',
    notes: 'Bootcamp grad with impressive portfolio projects and fast learning abilities.'
  }
];

export const INITIAL_INTERVIEWS: InterviewSession[] = [
  {
    id: 'i1',
    candidateId: 'c1',
    candidateName: 'Jane Doe',
    interviewerName: 'Sarah Connor',
    role: 'Senior Frontend Engineer',
    date: '2026-06-25',
    time: '14:00',
    status: 'In Progress',
    notes: 'Live technical round: Data structure structures and performance.',
    selectedLanguage: 'javascript',
    codeSolution: `// Solved Two Sum cleanly\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) {\n            return [map.get(diff), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
    duration: 60,
    codingQuestions: ['q1'],
    joiningId: 'INT-391-482',
    interviewLink: '#/room/INT-391-482'
  },
  {
    id: 'i2',
    candidateId: 'c2',
    candidateName: 'John Smith',
    interviewerName: 'Marcus Aurelius',
    role: 'Backend Engineer II',
    date: '2026-06-20',
    time: '10:00',
    status: 'Completed',
    score: 4.8,
    notes: 'Passed coding + architecture seamlessly. Strongly recommend hire.',
    selectedLanguage: 'go',
    codeSolution: `// John Smith Go solution\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Perfect logic")\n}`,
    duration: 45,
    codingQuestions: ['q3'],
    joiningId: 'INT-582-918',
    interviewLink: '#/room/INT-582-918'
  },
  {
    id: 'i3',
    candidateId: 'c3',
    candidateName: 'Alice Johnson',
    interviewerName: 'Ada Lovelace',
    role: 'Senior Infrastructure Architect',
    date: '2026-06-18',
    time: '16:00',
    status: 'Completed',
    score: 2.1,
    notes: 'Struggled on basic algorithm implementation and caching layers.',
    duration: 60,
    codingQuestions: ['q4'],
    joiningId: 'INT-291-039',
    interviewLink: '#/room/INT-291-039'
  },
  {
    id: 'i4',
    candidateId: 'c4',
    candidateName: 'Bob Miller',
    interviewerName: 'Grace Hopper',
    role: 'DevOps Engineer',
    date: '2026-06-26',
    time: '11:00',
    status: 'Scheduled',
    notes: 'System and script automation challenge round.',
    duration: 90,
    codingQuestions: ['q5'],
    joiningId: 'INT-812-749',
    interviewLink: '#/room/INT-812-749'
  },
  {
    id: 'i5',
    candidateId: 'c5',
    candidateName: 'Sofia Rodriguez',
    interviewerName: 'Linus Torvalds',
    role: 'Staff Data Scientist',
    date: '2026-06-24',
    time: '09:00',
    status: 'Completed',
    score: 3.9,
    notes: 'Strong algorithms, some gaps in complex distributed database designs.',
    duration: 60,
    codingQuestions: ['q1', 'q2'],
    joiningId: 'INT-603-125',
    interviewLink: '#/room/INT-603-125'
  }
];

// Helper functions for state management with local storage backing
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key ${key} to localStorage:`, error);
  }
};

export const getCandidates = (): Candidate[] => {
  return getStorageItem<Candidate[]>('interviewos_candidates', INITIAL_CANDIDATES);
};

export const saveCandidates = (candidates: Candidate[]): void => {
  setStorageItem('interviewos_candidates', candidates);
};

export const getInterviews = (): InterviewSession[] => {
  return getStorageItem<InterviewSession[]>('interviewos_interviews', INITIAL_INTERVIEWS);
};

export const saveInterviews = (interviews: InterviewSession[]): void => {
  setStorageItem('interviewos_interviews', interviews);
};

export const getQuestions = (): Question[] => {
  return getStorageItem<Question[]>('interviewos_questions', INITIAL_QUESTIONS);
};

export const saveQuestions = (questions: Question[]): void => {
  setStorageItem('interviewos_questions', questions);
};

export const initializeDatabase = (): void => {
  if (!localStorage.getItem('interviewos_candidates')) {
    saveCandidates(INITIAL_CANDIDATES);
  }
  if (!localStorage.getItem('interviewos_interviews')) {
    saveInterviews(INITIAL_INTERVIEWS);
  }
  if (!localStorage.getItem('interviewos_questions')) {
    saveQuestions(INITIAL_QUESTIONS);
  }
};
