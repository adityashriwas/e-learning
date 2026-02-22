const BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:8080";

const tests = [
  {
    name: "health endpoint",
    request: () => fetch(`${BASE_URL}/`),
    expect: async (res) => res.status === 200,
  },
  {
    name: "profile requires auth",
    request: () => fetch(`${BASE_URL}/api/v1/user/profile`),
    expect: async (res) => res.status === 401,
  },
  {
    name: "checkout requires auth",
    request: () =>
      fetch(`${BASE_URL}/api/v1/purchase/checkout/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: "000000000000000000000000" }),
      }),
    expect: async (res) => res.status === 401,
  },
  {
    name: "progress requires auth",
    request: () => fetch(`${BASE_URL}/api/v1/progress/test-course-id`),
    expect: async (res) => res.status === 401,
  },
  {
    name: "webhook endpoint reachable",
    request: () =>
      fetch(`${BASE_URL}/api/v1/purchase/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    expect: async (res) => res.status === 400,
  },
];

const run = async () => {
  let failures = 0;

  for (const test of tests) {
    try {
      const res = await test.request();
      const ok = await test.expect(res);
      if (!ok) {
        failures += 1;
        console.error(`[FAIL] ${test.name} -> status ${res.status}`);
      } else {
        console.log(`[PASS] ${test.name}`);
      }
    } catch (error) {
      failures += 1;
      console.error(`[FAIL] ${test.name} -> ${error.message}`);
    }
  }

  if (failures > 0) {
    console.error(`Smoke tests failed: ${failures}`);
    process.exit(1);
  }

  console.log("Smoke tests passed.");
};

run();
