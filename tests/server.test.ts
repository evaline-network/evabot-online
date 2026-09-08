/**
 * server.test.ts — Server HTTP API tests.
 *
 * Hermetic: the /api/chat LLM call is mocked by stubbing
 * UniversalLlmClient.prototype.generateContent (same pattern as
 * tests/routers.test.ts) so the suite never hits the live Google API.
 */

import { createServer } from '../src/server/server.js';
import { UniversalLlmClient } from '../src/core/UniversalLlmClient.js';

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

  // Mock the LLM layer (no live network) — mirrors tests/routers.test.ts.
  const proto: any = UniversalLlmClient.prototype;
  const origGenerate = proto.generateContent;
  const origStream = proto.streamContent;
  proto.generateContent = async function (
    _model: string,
    _messages: any[],
    _options: any = {}
  ): Promise<string> {
    return 'MOCK-LLM-REPLY';
  };
  proto.streamContent = async function (
    _model: string,
    _messages: any[],
    onChunk: (c: string) => void,
    _options: any = {}
  ): Promise<string> {
    onChunk('MOCK-LLM-REPLY');
    return 'MOCK-LLM-REPLY';
  };

  const server = createServer();
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const address = server.address() as any;
  const testPort = address.port;

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
    // Should be 401 if no server key, 200 with the mocked LLM reply otherwise
    assert(chatRes.status === 401 || chatRes.status === 200, `/api/chat handles key check gracefully (status ${chatRes.status})`);

  } catch (err: any) {
    console.error(`  ✗ Server test error: ${err.message}`);
    passed = false;
  } finally {
    proto.generateContent = origGenerate;
    proto.streamContent = origStream;
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }

  return passed;
}
