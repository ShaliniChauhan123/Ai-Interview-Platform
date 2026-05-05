export const ROLE_OPTIONS = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Engineer',
  'Mobile Engineer',
  'DevOps Engineer',
  'Data Engineer',
]

export const EXPERIENCE_OPTIONS = [
  'Fresher (0-1 years)',
  'Junior (1-3 years)',
  'Mid-Level (3-5 years)',
  'Senior (5-8 years)',
  'Lead (8+ years)',
]

export const SKILL_OPTIONS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Tailwind CSS',
  'Next.js',
  'Python',
  'SQL',
  'Testing Library',
  'Docker',
]

export const STEPS = [
  'Welcome',
  'Candidate Details',
  'Interview Setup',
  'AI Interview',
  'Coding Section',
  'Summary',
]

export const questions = [
  'Tell me about a project where you improved system performance.',
  'How do you handle disagreements during code reviews?',
  'Explain a difficult bug you diagnosed and fixed.',
  'Describe how you prioritize technical debt.',
  'Walk me through a recent feature you shipped end-to-end.',
  'How do you ensure code quality on a fast-paced team?',
  'Describe a time you made a trade-off between speed and correctness.',
  'How do you approach breaking down a large technical problem?',
  'Tell me about a time you mentored or unblocked another engineer.',
  'What does a good code review from you look like?',
]

export const questionDifficulty = [
  { label: 'Medium', hint: 'STAR + metrics' },
  { label: 'Easy', hint: 'Collaboration' },
  { label: 'Hard', hint: 'Deep technical' },
  { label: 'Medium', hint: 'Prioritization' },
  { label: 'Hard', hint: 'End-to-end ownership' },
  { label: 'Medium', hint: 'Quality systems' },
  { label: 'Hard', hint: 'Trade-offs' },
  { label: 'Medium', hint: 'Problem solving' },
  { label: 'Easy', hint: 'Leadership' },
  { label: 'Easy', hint: 'Communication' },
]

export const questionUseCases = [
  'Use-case: assess performance diagnosis, measurement, and impact communication.',
  'Use-case: evaluate collaboration skills and ability to resolve technical conflict.',
  'Use-case: check debugging approach, observability mindset, and rigor.',
  'Use-case: understand prioritization, risk management, and stakeholder alignment.',
  'Use-case: validate end-to-end ownership and delivery discipline.',
  'Use-case: gauge quality practices under constraints (tests, reviews, tooling).',
  'Use-case: evaluate judgment under pressure and trade-off reasoning.',
  'Use-case: check problem decomposition and planning clarity.',
  'Use-case: assess mentorship, unblocking style, and team impact.',
  'Use-case: validate review standards, communication, and quality bar.',
]

export const typingAnalysisByQuestion = [
  'Analyzing impact framing and metrics...',
  'Listening for empathy and shared standards...',
  'Tracking hypotheses and narrowing strategy...',
  'Checking prioritization signals and constraints...',
  'Watching for ownership across design → deploy...',
  'Looking for repeatable quality habits...',
  'Evaluating trade-off articulation and risk...',
  'Following breakdown into milestones...',
  'Noting coaching style and escalation judgment...',
  'Reviewing code review rubric and examples...',
]

export const aiTypingHints = [
  'Interviewer is composing the next prompt…',
  'Synthesizing your last answer into follow-ups…',
  'Calibrating difficulty based on your signals…',
  'Checking clarity, structure, and specificity…',
]

export const codingPrompt = {
  title: 'Two Sum Variant',
  statement:
    'Given an array of integers and a target, return indices of two numbers such that they add up to the target. Assume exactly one valid answer exists.',
  input: 'nums = [3, 7, 11, 15], target = 18',
  output: '[1, 2]',
}

export const defaultTwoSumJs = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const diff = target - nums[i];
    if (seen.has(diff)) return [seen.get(diff), i];
    seen.set(nums[i], i);
  }
  return [];
}`

export const defaultCodeByLanguage = {
  JavaScript: defaultTwoSumJs,
  TypeScript: defaultTwoSumJs,
  Python: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []`,
  Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        java.util.Map<Integer, Integer> seen = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (seen.containsKey(diff)) {
                return new int[] { seen.get(diff), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
}
