"use client";

export function ProblemStatement() {
  return (
    <div className="p-6 overflow-auto border-r border-gray-700 bg-gray-800 h-full">
      <h1 className="text-2xl font-bold mb-4 text-white">Two Sum</h1>
      <p>
        Given an array of integers <code>nums</code> and an integer{" "}
        <code>target</code>, return indices of the two numbers such that they add up
        to the target.
      </p>
      <h2 className="mt-4 font-semibold">Example</h2>
      <pre className="bg-gray-700 p-3 rounded text-sm">
        Input: nums = [2, 7, 11, 15], target = 9
        <br />
        Output: [0, 1]
      </pre>
      <h3 className="mt-4 text-sm font-semibold">Constraints</h3>
      <ul className="list-disc pl-5">
        <li>2 ≤ nums.length ≤ 10⁴</li>
        <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
        <li>-10⁹ ≤ target ≤ 10⁹</li>
      </ul>
    </div>
  );
}
