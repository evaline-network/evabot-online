import { createServer } from '../src/server/server.js';

export async function runServerTests(): Promise<boolean> {
  console.log('\n--- Running Server HTTP API Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  const server = createServer();
  const testPort = 3999;

  await new Promise<void>((resolve) => {
    server.listen(testPort, '127.0.0.1', () => resolve());
  });

  try {
    // Test /api/health
    const healthRes = await fetch(`http://127.0.0.1:${testPort}/api/health`);
    assert(healthRes.status === 200, '/api/health returns 200 OK');
    const healthJson: any = await healthRes.json();
    assert(healthJson.status === 'online', '/api/health status is online');
    assert(healthJson.availableModels >= 4, '/api/health reports models');

    // Test /api/models
    const modelsRes = await fetch(`http://127.0.0.1:${testPort}/api/models`);
    assert(modelsRes.status === 200, '/api/models returns 200 OK');
    const modelsJson: any = await modelsRes.json();
    assert(Array.isArray(modelsJson.models) && modelsJson.models.length >= 4, '/api/models lists array of models');

    // Test /api/chat error without API key
    const chatRes = await fetch(`http://127.0.0.1:${testPort}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' }),
    });
    // Should be 401 if no server key
    assert(chatRes.status === 401 || chatRes.status === 200, `/api/chat handles key check gracefully (status ${chatRes.status})`);

  } catch (err: any) {
    console.error(`  ✗ Server test error: ${err.message}`);
    passed = false;
  } finally {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }

  return passed;
}
