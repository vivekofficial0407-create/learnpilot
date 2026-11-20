/**
 * LearnPilot - Offline Hardcoded Demo Course
 * High-quality sample course: "Modern Asynchronous Architecture & Concurrency"
 * Ensures 100% functionality even when offline or without an API key.
 */

import { DemoCourseData } from '@/types';

export const DEMO_COURSE_DATA: DemoCourseData = {
  profile: {
    topic: 'Modern Asynchronous Architecture & Concurrency',
    selfReportedLevel: 'intermediate',
    assessedLevel: 'intermediate',
    goal: 'career',
    goalCustomText: 'Design resilient distributed backend services',
    style: 'example-heavy',
    completedOnboarding: true,
    createdAt: new Date().toISOString(),
  },
  diagnostic: {
    questions: [
      {
        id: 'diag-1',
        question: 'What is the primary difference between concurrency and parallelism?',
        options: [
          'Concurrency is dealing with lots of things at once; parallelism is doing lots of things at once.',
          'Concurrency requires multiple CPU cores, while parallelism works on single-core chips.',
          'Parallelism uses event loops, while concurrency only uses multi-threading.',
          'There is no functional difference; they are interchangeable terms.',
        ],
        correctIndex: 0,
        difficultyLevel: 'beginner',
        explanation:
          'As Rob Pike famously phrased: Concurrency is about structure (handling multiple things at once), while parallelism is about execution (executing multiple things simultaneously on multiple cores).',
      },
      {
        id: 'diag-2',
        question: 'In an Event Loop model (like Node.js or Python asyncio), what causes the event loop to block?',
        options: [
          'Awaiting a network socket read',
          'Executing a CPU-heavy synchronous loop or cryptographic calculation',
          'Spawning multiple Promise objects',
          'Using non-blocking file descriptors',
        ],
        correctIndex: 1,
        difficultyLevel: 'intermediate',
        explanation:
          'The event loop runs on a single main thread. Synchronous CPU-intensive operations tie up the thread and prevent the event loop from picking up pending I/O events.',
      },
      {
        id: 'diag-3',
        question: 'What is a "Race Condition" in concurrent programming?',
        options: [
          'When two threads execute faster than the clock frequency of the processor',
          'When program correctness depends on the non-deterministic relative timing or order of threads',
          'When memory leaks exceed available RAM during concurrent garbage collection',
          'When a deadlock is resolved automatically by the operating system kernel',
        ],
        correctIndex: 1,
        difficultyLevel: 'intermediate',
        explanation:
          'A race condition occurs when two or more operations must execute in the proper order, but the timing is non-deterministic, potentially corrupting shared state.',
      },
      {
        id: 'diag-4',
        question: 'Which synchronization primitive allows exactly N threads to access a shared resource simultaneously?',
        options: ['Mutex', 'Counting Semaphore', 'Spinlock', 'Condition Variable'],
        correctIndex: 1,
        difficultyLevel: 'advanced',
        explanation:
          'A Counting Semaphore maintains an internal counter initialized to N. Each acquire decrements it, and each release increments it, allowing up to N concurrent holders.',
      },
    ],
  },
  roadmap: {
    id: 'roadmap-demo-01',
    topic: 'Modern Asynchronous Architecture & Concurrency',
    targetLevel: 'intermediate',
    style: 'example-heavy',
    totalEstimatedMinutes: 145,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'mod-1',
        order: 1,
        title: 'Foundations of Concurrency: Threads vs Event Loops',
        description: 'Understand OS thread scheduling, context switching overhead, and event loop mechanics.',
        estimatedMinutes: 25,
        difficulty: 'beginner',
        learningObjectives: [
          'Differentiate CPU-bound vs I/O-bound workloads',
          'Visualize the Event Loop phases and microtask queues',
          'Measure context switching latency',
        ],
        keyConcepts: ['Event Loop', 'Thread Pool', 'Non-blocking I/O', 'Microtasks'],
        status: 'in-progress',
        quizScore: null,
        attemptsCount: 0,
      },
      {
        id: 'mod-2',
        order: 2,
        title: 'Asynchronous Control Flow & Coroutines',
        description: 'Master Promises, async/await syntax, cooperative multitasking, and cancellation tokens.',
        estimatedMinutes: 30,
        difficulty: 'intermediate',
        learningObjectives: [
          'Avoid unhandled promise rejections and silent failures',
          'Implement AbortController for request cancellation',
          'Manage concurrent batching with Promise.allSettled',
        ],
        keyConcepts: ['Promises', 'Async/Await', 'Cancellation', 'Promise Combinators'],
        status: 'locked',
        quizScore: null,
        attemptsCount: 0,
      },
      {
        id: 'mod-3',
        order: 3,
        title: 'Synchronization & Shared State Safety',
        description: 'Explore Race conditions, Deadlocks, Mutexes, and atomic operations.',
        estimatedMinutes: 30,
        difficulty: 'intermediate',
        learningObjectives: [
          'Diagnose data races using test harnesses',
          'Implement Mutex locks and compare-and-swap primitives',
          'Prevent circular wait deadlock conditions',
        ],
        keyConcepts: ['Race Condition', 'Mutex Lock', 'Deadlock Prevention', 'Atomics'],
        status: 'locked',
        quizScore: null,
        attemptsCount: 0,
      },
      {
        id: 'mod-4',
        order: 4,
        title: 'Backpressure, Queues & Rate Limiting',
        description: 'Handle high-throughput streaming data without exhausting process memory.',
        estimatedMinutes: 30,
        difficulty: 'advanced',
        learningObjectives: [
          'Design Token Bucket and Leaky Bucket rate limiters',
          'Handle backpressure in reactive streams',
          'Implement worker pools with bounded priority queues',
        ],
        keyConcepts: ['Backpressure', 'Token Bucket', 'Worker Pool', 'High Watermark'],
        status: 'locked',
        quizScore: null,
        attemptsCount: 0,
      },
      {
        id: 'mod-5',
        order: 5,
        title: 'Distributed Concurrency & Actor Models',
        description: 'Scale concurrency across nodes with message passing, idempotency, and saga patterns.',
        estimatedMinutes: 30,
        difficulty: 'advanced',
        learningObjectives: [
          'Implement the Actor pattern for state isolation',
          'Ensure message idempotency with deduplication keys',
          'Coordinate multi-step distributed sagas',
        ],
        keyConcepts: ['Actor Model', 'Message Passing', 'Idempotency', 'Saga Pattern'],
        status: 'locked',
        quizScore: null,
        attemptsCount: 0,
      },
    ],
  },
  moduleContents: {
    'mod-1': {
      moduleId: 'mod-1',
      title: 'Foundations of Concurrency: Threads vs Event Loops',
      coreExplanation: `
Concurrency is the composition of independently executing computations. In modern software architecture, handling thousands of simultaneous connections efficiently is the difference between a resilient system and a crashed server.

Operating systems manage traditional threads with preemptive multitasking. Each OS thread typically allocates 1MB to 8MB of stack memory and incurs CPU cache invalidation during context switches. For I/O-bound workloads (like web servers awaiting database responses), spawning a thread per request quickly exhausts memory and degrades throughput.

The Event Loop paradigm solves this via non-blocking asynchronous I/O. Instead of waiting for data to arrive over a network socket, the single thread registers a callback with kernel notification facilities (like epoll on Linux, kqueue on macOS, or IOCP on Windows) and immediately processes other ready events.
      `.trim(),
      styleSpecificContent: {
        simpleSummary:
          'Imagine a restaurant with 1 waiter (the Event Loop) versus 50 waiters (Multi-threading). The single waiter takes an order, hands it to the kitchen (Kernel/OS), and immediately attends to the next table instead of standing frozen at the kitchen counter.',
        analogies: [
          'The Single Waiter Metaphor: Taking orders continuously without standing idle waiting for meals to cook.',
          'Microtask Queue vs Macrotask Queue: Microtasks (Promises) are VIP express line passengers served before the next main bus arrives.',
        ],
        practicalCodeExamples: [
          {
            title: 'Demonstrating Non-blocking I/O vs CPU Blocking',
            language: 'typescript',
            code: `// Simulating event loop behavior with microtasks
async function fetchUserData(userId: string): Promise<string> {
  console.log('1. Initiating non-blocking network request...');
  
  // Non-blocking simulated network call: yields control to event loop
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  console.log('3. Data arrived via OS kernel callback!');
  return \`User #\${userId} profile\`;
}

console.log('Start');
fetchUserData('42');
console.log('2. Main thread continues processing subsequent operations!');
// Output sequence:
// Start
// 1. Initiating non-blocking network request...
// 2. Main thread continues processing subsequent operations!
// 3. Data arrived via OS kernel callback!`,
            explanation:
              'Notice how step 2 runs before step 3 because await yields control of the thread back to the event loop rather than freezing the runtime.',
          },
        ],
        examTipsAndPitfalls: [
          {
            tip: 'Event loops excel at I/O-bound tasks; for CPU-heavy tasks (like video transcoding), always offload to worker threads or subprocesses.',
            commonTrap:
              'Thinking async makes CPU calculations faster. Async merely avoids blocking the thread while waiting for external I/O.',
            quickReviewFormula: 'Concurrency = Structure / Coordination; Parallelism = Simultaneous Hardware Execution.',
          },
        ],
      },
      keyTakeaways: [
        'OS Threads allocate substantial stack memory; Event Loops multiplex thousands of sockets on minimal RAM.',
        'Never perform synchronous blocking computations on the event loop main thread.',
        'Microtasks (Promises) always drain before the next macrotask (timer, I/O) executes.',
      ],
    },
    'mod-2': {
      moduleId: 'mod-2',
      title: 'Asynchronous Control Flow & Coroutines',
      coreExplanation: `
Coroutines are functions that can suspend execution and resume later without losing state. Modern languages express coroutines through async/await. While async/await drastically improves readability over callback hell, managing concurrency limits and cleanup remains critical.

A major anti-pattern in production code is launching unbounded concurrent promises (e.g. \`Promise.all(urls.map(fetch))\`). If the array contains 5,000 URLs, the application fires 5,000 simultaneous socket connections, crashing network interfaces or triggering rate limits. Structured concurrency tools like concurrency pools or \`p-limit\` safeguard against this.
      `.trim(),
      styleSpecificContent: {
        practicalCodeExamples: [
          {
            title: 'Concurrency Limiter with AbortSignal',
            language: 'typescript',
            code: `// Resilient batching with timeout and cancellation
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id); // Prevent timer memory leak
  }
}

// Bounded concurrency processor
async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const p = fn(item).then((res) => {
      results.push(res);
    });
    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
      // Remove settled promises
    }
  }
  await Promise.all(executing);
  return results;
}`,
            explanation:
              'This pattern caps parallel HTTP requests to prevent socket exhaustion and ensures reliable cancellation via AbortController.',
          },
        ],
      },
      keyTakeaways: [
        'Always provide timeout and cancellation handlers using AbortController.',
        'Never execute unbounded Promise.all across arbitrary user input lengths.',
        'Use Promise.allSettled when individual failures should not abort the entire batch.',
      ],
    },
    'mod-3': {
      moduleId: 'mod-3',
      title: 'Synchronization & Shared State Safety',
      coreExplanation: `
When multiple concurrent routines read and modify shared mutable memory, the order of instruction execution depends on scheduler interleaving. A Race Condition happens when the output depends on non-deterministic timing.

To protect critical sections, we employ Mutual Exclusion (Mutex) locks. A Mutex ensures that only one worker enters the protected block at any given time. However, acquiring multiple locks introduces the hazard of Deadlock: Thread A holds Lock 1 waiting for Lock 2, while Thread B holds Lock 2 waiting for Lock 1.
      `.trim(),
      styleSpecificContent: {
        practicalCodeExamples: [
          {
            title: 'Async Mutex Implementation',
            language: 'typescript',
            code: `class AsyncMutex {
  private locked = false;
  private queue: (() => void)[] = [];

  async acquire(): Promise<() => void> {
    if (!this.locked) {
      this.locked = true;
      return () => this.release();
    }

    return new Promise<() => void>((resolve) => {
      this.queue.push(() => {
        resolve(() => this.release());
      });
    });
  }

  private release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.locked = false;
    }
  }
}

// Usage:
const mutex = new AsyncMutex();
const unlock = await mutex.acquire();
try {
  // Critical section: safe modification of shared state
} finally {
  unlock();
}`,
            explanation:
              'The async mutex queues waiting tasks as suspended promises, ensuring FIFO execution without busy-waiting (spinlock) CPU burn.',
          },
        ],
      },
      keyTakeaways: [
        'Always release mutexes inside a finally block to avoid permanent lock starvation on errors.',
        'Enforce strict global lock ordering to eliminate circular wait deadlocks.',
        'Prefer immutability and message passing over shared mutable state whenever possible.',
      ],
    },
    'mod-4': {
      moduleId: 'mod-4',
      title: 'Backpressure, Queues & Rate Limiting',
      coreExplanation: `
Backpressure occurs when the consumer of data cannot keep up with the producer. Without backpressure mechanisms, unbounded buffers consume heap memory until an Out-Of-Memory (OOM) crash terminates the service.

Rate limit algorithms (Token Bucket, Leaky Bucket, Sliding Window Log) govern flow rates. In event-driven Node.js, streams implement backpressure via highWaterMark thresholds and the \`drain\` event, signaling when the buffer has cleared sufficiently to accept more chunks.
      `.trim(),
      styleSpecificContent: {
        practicalCodeExamples: [
          {
            title: 'Token Bucket Rate Limiter',
            language: 'typescript',
            code: `class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly capacity: number,
    private readonly refillRatePerSec: number
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  tryConsume(tokensToConsume = 1): boolean {
    this.refill();
    if (this.tokens >= tokensToConsume) {
      this.tokens -= tokensToConsume;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const addedTokens = elapsed * this.refillRatePerSec;
    this.tokens = Math.min(this.capacity, this.tokens + addedTokens);
    this.lastRefill = now;
  }
}`,
            explanation:
              'Token Bucket permits burst traffic up to capacity while guaranteeing an average long-term limit.',
          },
        ],
      },
      keyTakeaways: [
        'Backpressure prevents memory overflow by pausing data producers.',
        'Token Bucket handles bursty traffic; Leaky Bucket guarantees smoothed constant emission.',
        'Monitor queue lengths in production: unbounded queues are ticking memory bombs.',
      ],
    },
    'mod-5': {
      moduleId: 'mod-5',
      title: 'Distributed Concurrency & Actor Models',
      coreExplanation: `
Scaling concurrency past a single server requires distributed coordination. Shared memory is no longer available across physical network boundaries.

The Actor Model treats actors as autonomous compute units with private state, communicating strictly through asynchronous message passing. To achieve fault tolerance in distributed transactions, developers use Sagas (choreographed or orchestrated) paired with Idempotency Keys to safeguard against duplicate network retries.
      `.trim(),
      styleSpecificContent: {
        practicalCodeExamples: [
          {
            title: 'Idempotent Message Handler Pattern',
            language: 'typescript',
            code: `interface JobMessage {
  idempotencyKey: string;
  payload: Record<string, unknown>;
}

class IdempotentProcessor {
  private processedKeys = new Set<string>();

  async process(msg: JobMessage): Promise<void> {
    if (this.processedKeys.has(msg.idempotencyKey)) {
      console.log('Duplicate message ignored:', msg.idempotencyKey);
      return;
    }

    // Execute state mutation
    await this.handlePayload(msg.payload);

    this.processedKeys.add(msg.idempotencyKey);
  }

  private async handlePayload(data: Record<string, unknown>) {
    // Business logic
  }
}`,
            explanation:
              'Idempotency keys prevent duplicate billing or side effects caused by at-least-once distributed delivery semantics.',
          },
        ],
      },
      keyTakeaways: [
        'The Actor Model eliminates shared state race conditions through isolated message mailboxes.',
        'Distributed systems are at-least-once by nature; all endpoints must be strictly idempotent.',
        'Use compensating transactions in Sagas rather than blocking two-phase commits across microservices.',
      ],
    },
  },
  quizzes: {
    'mod-1': [
      {
        id: 'q-mod1-1',
        moduleId: 'mod-1',
        question: 'Why does an OS thread consume significantly more baseline memory than an event loop callback?',
        options: [
          'OS threads pre-allocate a dedicated call stack (1-8MB) and kernel data structures.',
          'Event loops compress memory using binary gzip trees.',
          'OS threads duplicate the entire operating system kernel into user space.',
          'Event loops only execute 32-bit instructions.',
        ],
        correctIndex: 0,
        explanation:
          'Every OS thread requires its own pre-allocated stack space (typically 1-8 MB), whereas an event loop callback is just a lightweight function reference in the heap.',
        conceptTag: 'Thread Memory Overhead',
      },
      {
        id: 'q-mod1-2',
        moduleId: 'mod-1',
        question: 'What occurs when you run a synchronous while(true) loop on the Node.js main thread?',
        options: [
          'The event loop automatically forks a worker thread to handle it.',
          'The event loop freezes, blocking all subsequent timers, network I/O, and HTTP requests.',
          'The V8 engine skips the loop and continues executing other callbacks.',
          'Only that specific HTTP connection is paused; others continue normally.',
        ],
        correctIndex: 1,
        explanation:
          'Because the Event Loop runs on a single main thread, a synchronous infinite loop starves the thread, completely blocking all subsequent I/O events.',
        conceptTag: 'Event Loop Starvation',
      },
      {
        id: 'q-mod1-3',
        moduleId: 'mod-1',
        question: 'Which queue has the highest priority in the JavaScript Event Loop execution order?',
        options: ['Timer queue (setTimeout)', 'I/O poll queue', 'Microtask queue (Promise.then)', 'Check queue (setImmediate)'],
        correctIndex: 2,
        explanation:
          'The microtask queue (Promises, queueMicrotask, process.nextTick) is drained completely immediately after the current synchronous frame and before the next macrotask starts.',
        conceptTag: 'Microtasks vs Macrotasks',
      },
      {
        id: 'q-mod1-4',
        moduleId: 'mod-1',
        question: 'What kernel mechanism allows modern servers to watch thousands of network sockets without polling each one sequentially?',
        options: [
          'epoll / kqueue / IOCP event notification interfaces',
          'Sequential CPU interrupt polling',
          'Hard drive swap paging',
          'RAM bus arbitration',
        ],
        correctIndex: 0,
        explanation:
          'Kernel notification facilities like Linux epoll and BSD kqueue provide O(1) readiness notifications when sockets receive packets, eliminating sequential polling.',
        conceptTag: 'Kernel Socket Multiplexing',
      },
      {
        id: 'q-mod1-5',
        moduleId: 'mod-1',
        question: 'When should you choose a multi-threaded worker pool over an event loop?',
        options: [
          'Serving static HTML web pages',
          'Handling 10,000 idle WebSocket connections',
          'Performing heavy image transformations or mathematical matrix multiplications',
          'Reading small JSON files from local SSD cache',
        ],
        correctIndex: 2,
        explanation:
          'Worker thread pools are ideal for CPU-bound computations (image processing, crypto, machine learning inference) where parallel multi-core calculation is required.',
        conceptTag: 'CPU vs I/O Bound Workloads',
      },
    ],
    'mod-2': [
      {
        id: 'q-mod2-1',
        moduleId: 'mod-2',
        question: 'What is the main danger of executing Promise.all() over an array of 10,000 URLs?',
        options: [
          'The promises will be executed in reverse order',
          'Socket exhaustion, high memory spike, and triggering server rate limits',
          'The JavaScript runtime will crash with a SyntaxError',
          'The browser will delete its local cache',
        ],
        correctIndex: 1,
        explanation:
          'Launching 10,000 simultaneous promises attempts to open thousands of sockets simultaneously, exhausting file descriptors and causing catastrophic connection drops.',
        conceptTag: 'Unbounded Concurrency Hazard',
      },
      {
        id: 'q-mod2-2',
        moduleId: 'mod-2',
        question: 'How does AbortController communicate cancellation to an ongoing fetch request?',
        options: [
          'By terminating the process immediately',
          'By emitting an "abort" event on its associated AbortSignal object',
          'By sending a SIGKILL signal to the server',
          'By throwing a memory segmentation fault',
        ],
        correctIndex: 1,
        explanation:
          'The AbortController manages an AbortSignal instance. Calling .abort() flips the signal state and triggers cancellation listeners inside the fetch API.',
        conceptTag: 'AbortController Pattern',
      },
      {
        id: 'q-mod2-3',
        moduleId: 'mod-2',
        question: 'What is the key difference between Promise.all() and Promise.allSettled()?',
        options: [
          'Promise.all rejects immediately upon the first failure, whereas Promise.allSettled waits for all promises to finish regardless of outcome.',
          'Promise.allSettled only works in browser environments, not in Node.js.',
          'Promise.all executes in parallel; Promise.allSettled executes strictly sequentially.',
          'Promise.allSettled returns only the resolved values, discarding rejections.',
        ],
        correctIndex: 0,
        explanation:
          'Promise.all implements "fail-fast" behavior. Promise.allSettled guarantees that every promise settles, returning an array of status objects.',
        conceptTag: 'Promise Combinators',
      },
      {
        id: 'q-mod2-4',
        moduleId: 'mod-2',
        question: 'What happens if a promise in Node.js rejects and has no .catch() handler attached?',
        options: [
          'Node.js ignores the error silently',
          'An UnhandledPromiseRejection is raised, which terminates the process by default in modern Node.js versions',
          'The promise automatically retries 3 times',
          'The event loop resets itself',
        ],
        correctIndex: 1,
        explanation:
          'Modern Node.js crashes the process with non-zero exit code upon encountering unhandled promise rejections to prevent zombie corrupted states.',
        conceptTag: 'Unhandled Rejection Handling',
      },
      {
        id: 'q-mod2-5',
        moduleId: 'mod-2',
        question: 'What does the "await" keyword actually do to thread execution?',
        options: [
          'Freezes the CPU core until the promise resolves',
          'Suspends the execution of the async function and yields control back to the caller/event loop',
          'Creates a background OS thread for the remaining code in the function',
          'Clears all pending timers',
        ],
        correctIndex: 1,
        explanation:
          'Await does NOT freeze the thread. It suspends the local coroutine and returns execution control to the event loop to continue serving other tasks.',
        conceptTag: 'Async Coroutine Yielding',
      },
    ],
    'mod-3': [
      {
        id: 'q-mod3-1',
        moduleId: 'mod-3',
        question: 'What is a "Race Condition"?',
        options: [
          'A competition between two developers to merge PRs',
          'A flaw where the output depends on non-deterministic timing of concurrent operations',
          'A benchmark test for processor speed',
          'A hardware defect in CPU cache lines',
        ],
        correctIndex: 1,
        explanation:
          'A race condition arises when concurrent tasks access shared state without synchronization, yielding unpredictable outcomes depending on interleaving.',
        conceptTag: 'Race Condition Mechanics',
      },
      {
        id: 'q-mod3-2',
        moduleId: 'mod-3',
        question: 'Why should a Mutex unlock call ALWAYS be placed inside a finally block?',
        options: [
          'To run the unlock in parallel with the try block',
          'To ensure the lock is released even if an unexpected exception or error occurs within the critical section',
          'Because compilers reject code that does not use finally',
          'To reduce RAM usage by half',
        ],
        correctIndex: 1,
        explanation:
          'If an exception is thrown inside the critical section and the unlock call is skipped, the Mutex remains permanently locked, causing a deadlock.',
        conceptTag: 'Mutex Safe Release',
      },
      {
        id: 'q-mod3-3',
        moduleId: 'mod-3',
        question: 'Which of the following is one of Coffman’s four necessary conditions for Deadlock?',
        options: ['Circular Wait', 'Garbage Collection', 'Dynamic Typing', 'Non-blocking Sockets'],
        correctIndex: 0,
        explanation:
          'The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Breaking any one prevents deadlock.',
        conceptTag: 'Deadlock Coffman Conditions',
      },
      {
        id: 'q-mod3-4',
        moduleId: 'mod-3',
        question: 'What is the primary benefit of Compare-And-Swap (CAS) atomic operations over traditional mutexes?',
        options: [
          'CAS requires OS context switches to kernel mode',
          'CAS operates lock-free at the CPU hardware instruction level, eliminating thread suspension overhead',
          'CAS allows infinite threads to modify memory without limits',
          'CAS prevents all memory leaks',
        ],
        correctIndex: 1,
        explanation:
          'CAS is supported directly by hardware CPU instructions (e.g. CMPXCHG on x86), enabling lock-free data structures without putting threads to sleep.',
        conceptTag: 'Lock-free Atomics',
      },
      {
        id: 'q-mod3-5',
        moduleId: 'mod-3',
        question: 'How can developers reliably eliminate the "Circular Wait" condition in multi-lock applications?',
        options: [
          'By acquiring all required locks in a globally strictly defined order (e.g. lock ID alphabetical order)',
          'By using random timeouts before each lock attempt',
          'By running all code in a single thread with no async operations',
          'By ignoring lock errors',
        ],
        correctIndex: 0,
        explanation:
          'Enforcing a strict global acquisition order (e.g., always acquire Lock A before Lock B) makes circular dependency graphs mathematically impossible.',
        conceptTag: 'Deadlock Prevention Ordering',
      },
    ],
    'mod-4': [
      {
        id: 'q-mod4-1',
        moduleId: 'mod-4',
        question: 'What problem does backpressure solve in streaming pipelines?',
        options: [
          'Network packet corruption',
          'Faster consumer starvation',
          'A fast producer overwhelming a slow consumer, resulting in runaway memory buffering and OOM crashes',
          'SQL injection vulnerabilities',
        ],
        correctIndex: 2,
        explanation:
          'Backpressure throttles or pauses the upstream data producer when the downstream consumer cannot ingest data quickly enough.',
        conceptTag: 'Backpressure Fundamentals',
      },
      {
        id: 'q-mod4-2',
        moduleId: 'mod-4',
        question: 'How does the Token Bucket rate limiter accommodate burst traffic compared to Leaky Bucket?',
        options: [
          'Token Bucket allows consumers to use accumulated tokens immediately up to capacity, permitting controlled bursts.',
          'Token Bucket rejects all bursts immediately.',
          'Token Bucket does not track time.',
          'Token Bucket requires a distributed Redis cluster for single requests.',
        ],
        correctIndex: 0,
        explanation:
          'In Token Bucket, tokens accumulate over idle periods up to bucket capacity, allowing bursts of requests up to that capacity.',
        conceptTag: 'Token Bucket Burst Handling',
      },
      {
        id: 'q-mod4-3',
        moduleId: 'mod-4',
        question: 'In Node.js Writable streams, what does returning false from stream.write(chunk) indicate?',
        options: [
          'The chunk was rejected and deleted',
          'The stream buffer has exceeded its highWaterMark; the caller should pause writing until the "drain" event fires',
          'The network connection was closed',
          'The file system is full',
        ],
        correctIndex: 1,
        explanation:
          'When write() returns false, the internal buffer is full. The producer must stop writing until the stream emits "drain".',
        conceptTag: 'Stream highWaterMark Flow Control',
      },
      {
        id: 'q-mod4-4',
        moduleId: 'mod-4',
        question: 'Why are unbounded in-memory task queues dangerous in production microservices?',
        options: [
          'They execute tasks out of order',
          'Under sustained overload, queued tasks grow indefinitely until the process runs out of RAM and crashes (OOM)',
          'They cannot store JavaScript objects',
          'They slow down disk read operations',
        ],
        correctIndex: 1,
        explanation:
          'Unbounded queues offer no limit on memory consumption. Under traffic spikes, memory grows until the OS kills the process.',
        conceptTag: 'Bounded Queue Safety',
      },
      {
        id: 'q-mod4-5',
        moduleId: 'mod-4',
        question: 'What is the purpose of exponential backoff with jitter in retry mechanisms?',
        options: [
          'To flood the failing service with requests as fast as possible',
          'To prevent the "Thundering Herd" problem where thousands of clients retry at the exact same synchronized interval',
          'To decrease network latency to zero',
          'To ensure only one client succeeds while others disconnect',
        ],
        correctIndex: 1,
        explanation:
          'Adding random jitter desynchronizes retrying clients, preventing catastrophic traffic spikes from overwhelming a recovering service.',
        conceptTag: 'Retry Backoff with Jitter',
      },
    ],
    'mod-5': [
      {
        id: 'q-mod5-1',
        moduleId: 'mod-5',
        question: 'In the Actor Model, how do actors modify state owned by other actors?',
        options: [
          'By directly editing the other actor’s memory pointer',
          'They cannot modify other actors’ state directly; they can only send asynchronous messages to their mailbox',
          'By acquiring a global distributed database lock',
          'By restarting the operating system container',
        ],
        correctIndex: 1,
        explanation:
          'Actors encapsulate their state completely. Communication happens exclusively via message passing, preventing shared memory race conditions.',
        conceptTag: 'Actor Isolation Principle',
      },
      {
        id: 'q-mod5-2',
        moduleId: 'mod-5',
        question: 'What does "Idempotency" mean in distributed APIs?',
        options: [
          'An operation produces the exact same side-effect and outcome whether executed once or repeated multiple times',
          'An operation only executes during night hours',
          'An operation requires two separate database servers',
          'An operation that always returns an error code',
        ],
        correctIndex: 0,
        explanation:
          'An idempotent operation (e.g. payment with idempotency key) ensures that retrying a network-dropped request does not cause duplicate transactions.',
        conceptTag: 'API Idempotency Guarantee',
      },
      {
        id: 'q-mod5-3',
        moduleId: 'mod-5',
        question: 'In the Saga pattern for distributed transactions, what handles rollbacks when a downstream step fails?',
        options: [
          'The database runs a global hardware transaction lock',
          'Compensating transactions are executed in reverse order to undo previously committed steps',
          'The entire server is restored from tape backup',
          'The failure is quietly ignored',
        ],
        correctIndex: 1,
        explanation:
          'Because distributed sagas commit local transactions in steps, a failure triggers explicit compensating transactions (e.g. refunding a charge).',
        conceptTag: 'Saga Compensating Transactions',
      },
      {
        id: 'q-mod5-4',
        moduleId: 'mod-5',
        question: 'Why are distributed transactions (Two-Phase Commit / 2PC) often avoided in high-scale microservices?',
        options: [
          '2PC is blocking and holds database locks across network boundaries, severely degrading availability and throughput',
          '2PC is unsupported by relational databases',
          '2PC uses too little network bandwidth',
          '2PC is patented and illegal to use in open source',
        ],
        correctIndex: 0,
        explanation:
          'Two-Phase Commit holds locks until all participants acknowledge, creating a single point of failure and bottleneck under network partitions.',
        conceptTag: '2PC Availability Tradeoffs',
      },
      {
        id: 'q-mod5-5',
        moduleId: 'mod-5',
        question: 'What delivery guarantee do most distributed message brokers (Kafka, RabbitMQ, SQS) provide by default?',
        options: ['Exactly-once delivery without deduplication', 'At-least-once delivery', 'At-most-twice delivery', 'Zero-loss delivery without disk write'],
        correctIndex: 1,
        explanation:
          'Under network partitions, brokers resend unacknowledged messages, guaranteeing at-least-once delivery; consumers must be idempotent.',
        conceptTag: 'At-Least-Once Delivery Semantics',
      },
    ],
  },
};
