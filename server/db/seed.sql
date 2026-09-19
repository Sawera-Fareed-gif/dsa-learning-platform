-- ========================================================================
-- DSA ONLINE LEARNING & QUIZ PLATFORM - SEED DATA
-- Default Admin: admin@dsa.com / Password: Password123! (bcrypt hash)
-- Sample Users: alex@example.com, sara@example.com, chen@example.com (Password: Password123!)
-- ========================================================================

USE dsa_platform;

-- Insert Users (Password123! hashed with bcrypt salt 10: $2a$10$w3a60h5Q1TqM5Rk3aUaUuep533K.fK57Kq6y5U6.i8yBfZC3P5QjS)
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Admin Shehzadi', 'admin@dsa.com', '$2a$10$2HhLwH1i4v15dY43V.V1/u95cM43h0h0gC8F.G06yvU1rS25zF9iO', 'admin'),
(2, 'Alex Turner', 'alex@example.com', '$2a$10$2HhLwH1i4v15dY43V.V1/u95cM43h0h0gC8F.G06yvU1rS25zF9iO', 'user'),
(3, 'Sara Connor', 'sara@example.com', '$2a$10$2HhLwH1i4v15dY43V.V1/u95cM43h0h0gC8F.G06yvU1rS25zF9iO', 'user'),
(4, 'Chen Wei', 'chen@example.com', '$2a$10$2HhLwH1i4v15dY43V.V1/u95cM43h0h0gC8F.G06yvU1rS25zF9iO', 'user'),
(5, 'Sawera Shehzadi', 'za3060873@gmail.com', '$2a$10$2HhLwH1i4v15dY43V.V1/u95cM43h0h0gC8F.G06yvU1rS25zF9iO', 'admin');

-- Insert Problems
INSERT INTO problems (id, title, description, difficulty, topic, options, correct_answer, explanation) VALUES
(1, 'Two Sum Problem', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. What is the optimal time complexity using a Hash Map?', 'Easy', 'Arrays', 
 JSON_ARRAY('O(n^2) time, O(1) space', 'O(n) time, O(n) space', 'O(n log n) time, O(1) space', 'O(log n) time, O(n) space'),
 'O(n) time, O(n) space',
 'By using a Hash Map to store complement values (target - current), we can look up elements in O(1) average time, resulting in an overall O(n) time and O(n) auxiliary space complexity.'),

(2, 'Maximum Subarray (Kadane\'s Algorithm)', 'Find the contiguous subarray with the largest sum. What principle does Kadane\'s algorithm rely on at each step?', 'Medium', 'Arrays',
 JSON_ARRAY('Sorting the array and taking two pointers', 'Deciding whether to add the current element to the existing subarray or start a new subarray', 'Binary search over prefix sums', 'Dividing into 3 sub-problems recursively'),
 'Deciding whether to add the current element to the existing subarray or start a new subarray',
 'Kadane\'s algorithm maintains max_ending_here = max(x, max_ending_here + x), deciding dynamically whether extending or resetting provides a larger sum in O(n) time.'),

(3, 'Reverse Linked List', 'Given the head of a singly linked list, reverse the list and return the reversed list. What pointers are strictly required to iteratively reverse in O(1) space?', 'Easy', 'Linked Lists',
 JSON_ARRAY('prev, current, and next pointers', 'A stack to store all node addresses', 'Two pointers moving in opposite directions from head and tail', 'Only a single slow pointer'),
 'prev, current, and next pointers',
 'An iterative reversal requires three pointers: prev (initially NULL), current (initially head), and next (to preserve reference before mutating current.next).'),

(4, 'Detect Cycle in a Linked List (Floyd\'s Cycle)', 'Given head, the head of a linked list, determine if the linked list has a cycle. Which algorithm achieves O(n) time and O(1) space?', 'Easy', 'Linked Lists',
 JSON_ARRAY('Floyd\'s Tortoise and Hare algorithm', 'Dijkstra\'s shortest path', 'Kruskal\'s minimum spanning tree', 'Boyer-Moore voting algorithm'),
 'Floyd\'s Tortoise and Hare algorithm',
 'Floyd\'s algorithm uses two pointers: slow moves by 1 step and fast moves by 2 steps. If a cycle exists, they are guaranteed to meet inside the loop.'),

(5, 'Invert Binary Tree', 'Given the root of a binary tree, invert the tree, and return its root. What is the time complexity of inverting a binary tree with N nodes?', 'Easy', 'Trees',
 JSON_ARRAY('O(N) because each node is visited once', 'O(N^2) because each swap takes linear time', 'O(log N) always', 'O(1) in-place swap of roots'),
 'O(N) because each node is visited once',
 'Since each node must be visited once to swap its left and right children, the algorithm takes O(N) time where N is the number of nodes.'),

(6, 'Lowest Common Ancestor (LCA) in BST', 'Given a Binary Search Tree (BST) and two nodes p and q, find their Lowest Common Ancestor. What property allows O(h) navigation without a hash table?', 'Medium', 'Trees',
 JSON_ARRAY('Left child is smaller and right child is greater than current root', 'All leaves reside at the exact same depth', 'BST is always balanced with AVL rotations', 'Edges are weighted directed graphs'),
 'Left child is smaller and right child is greater than current root',
 'Because of BST ordering, if both p and q are smaller than root, LCA is in left subtree; if both are greater, it is in right subtree; otherwise, root is the split point (LCA).'),

(7, 'Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How does this reduce to a known mathematical relation?', 'Easy', 'Dynamic Programming',
 JSON_ARRAY('Fibonacci recurrence: F(n) = F(n-1) + F(n-2)', 'Catalan numbers recurrence', 'Factorial permutation: n!', 'Binomial coefficients: C(n, 2)'),
 'Fibonacci recurrence: F(n) = F(n-1) + F(n-2)',
 'To reach step n, you can either step from (n-1) or from (n-2). Hence, ways(n) = ways(n-1) + ways(n-2), which is isomorphic to the Fibonacci sequence.'),

(8, '0/1 Knapsack Problem', 'Given weights and values of n items, put these items in a knapsack of capacity W to get maximum value. Why can\'t greedy approach solve 0/1 knapsack?', 'Medium', 'Dynamic Programming',
 JSON_ARRAY('Items cannot be broken; taking a high value-to-weight item may leave empty space that wastes capacity', 'Greedy requires float division which is prohibited in integer arrays', 'Greedy always produces negative weight cycles', 'There are no optimal substructures in knapsack'),
 'Items cannot be broken; taking a high value-to-weight item may leave empty space that wastes capacity',
 'Unlike Fractional Knapsack where items can be subdivided, 0/1 Knapsack requires DP because greedy selection by density may trap the capacity into a suboptimal packing.'),

(9, 'Breadth-First Search (BFS) Shortest Path', 'In an unweighted graph, which data structure is fundamental to finding the shortest path between two vertices?', 'Easy', 'Graphs',
 JSON_ARRAY('Queue (FIFO)', 'Stack (LIFO)', 'Max Heap', 'Disjoint Set Union (DSU)'),
 'Queue (FIFO)',
 'BFS explores vertices in concentric level-by-level frontiers using a FIFO queue, ensuring that the first time a node is reached corresponds to its minimum edge distance.'),

(10, 'Detect Cycle in Directed Graph', 'Which algorithm or color-marking approach is standard for finding cycles in a directed graph using DFS?', 'Medium', 'Graphs',
 JSON_ARRAY('3-color DFS (White, Gray, Black) to detect back-edges', 'Prim\'s algorithm', 'Bellman-Ford relaxation', 'Huffman coding tree'),
 '3-color DFS (White, Gray, Black) to detect back-edges',
 'In 3-color DFS: White = unvisited, Gray = currently visiting in recursion stack, Black = completely processed. Visiting a Gray node indicates a back-edge (cycle).'),

(11, 'Valid Anagram', 'Given two strings s and t, return true if t is an anagram of s. What is the optimal frequency counting space complexity assuming lowercase English letters?', 'Easy', 'Strings',
 JSON_ARRAY('O(1) space using a fixed 26-element integer array', 'O(N^2) using nested substring matching', 'O(N log N) using quicksort', 'O(2^N) exponential combinations'),
 'O(1) space using a fixed 26-element integer array',
 'Since lowercase English alphabet has a constant size of 26 characters, an integer array of length 26 consumes O(1) constant auxiliary space.'),

(12, 'Merge Sort Time & Space Complexity', 'What are the worst-case time complexity and standard auxiliary space complexity of Merge Sort on an array of size N?', 'Medium', 'Sorting & Searching',
 JSON_ARRAY('O(N log N) time and O(N) auxiliary space', 'O(N^2) time and O(1) auxiliary space', 'O(N) time and O(log N) auxiliary space', 'O(N log N) time and O(1) auxiliary space'),
 'O(N log N) time and O(N) auxiliary space',
 'Merge sort recursively splits the array into halves (log N levels) and merges them in O(N) per level, totaling O(N log N) time and requiring O(N) buffer space for the merge step.');

-- Insert Quizzes
INSERT INTO quizzes (id, title, topic, problem_ids) VALUES
(1, 'Arrays & Hashing Fundamentals', 'Arrays', JSON_ARRAY(1, 2)),
(2, 'Linked Lists & Pointers Mastery', 'Linked Lists', JSON_ARRAY(3, 4)),
(3, 'Trees & Hierarchical Structures', 'Trees', JSON_ARRAY(5, 6)),
(4, 'Dynamic Programming Essentials', 'Dynamic Programming', JSON_ARRAY(7, 8)),
(5, 'Graph Traversal & Graph Algorithms', 'Graphs', JSON_ARRAY(9, 10)),
(6, 'Strings & Sorting Practice', 'Strings', JSON_ARRAY(11, 12));

-- Insert Scores
INSERT INTO scores (user_id, quiz_id, score, total_questions, date_taken) VALUES
(2, 1, 100, 2, '2026-09-15 14:30:00'),
(2, 2, 80, 2, '2026-09-16 11:15:00'),
(2, 3, 90, 2, '2026-09-17 09:45:00'),
(3, 1, 90, 2, '2026-09-16 16:20:00'),
(3, 4, 100, 2, '2026-09-18 13:00:00'),
(4, 1, 70, 2, '2026-09-17 17:10:00'),
(4, 5, 85, 2, '2026-09-18 19:30:00'),
(5, 1, 100, 2, '2026-09-18 20:00:00'),
(5, 2, 100, 2, '2026-09-19 08:30:00'),
(5, 3, 100, 2, '2026-09-19 10:15:00');
