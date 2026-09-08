import { SubagentEngine, assignModels, SUBAGENT_ROLES } from '../src/core/SubagentEngine.js';
import { UniversalLlmClient } from '../src/core/UniversalLlmClient.js';
import { ModelRegistry } from '../src/models/ModelRegistry.js';

export async function runSubagentEngineTests(): Promise<boolean> {
  console.log('\n--- Running SubagentEngine Tests (/subagent, TASK-325) ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // parseArgs
  assert(SubagentEngine.parseArgs('сделай X').agentCount === 3, 'default agent count = 3');
  assert(SubagentEngine.parseArgs('2 задача Y').agentCount === 2, 'explicit count parsed');
  assert(SubagentEngine.parseArgs('2 задача Y').task === 'задача Y', 'task parsed after count');
  assert(SubagentEngine.parseArgs('9 x').agentCount === 3, 'out-of-range count falls back to default');

  // fleet + role integrity: ONLY-FREE, registry-valid
  assert(SUBAGENT_ROLES.length === 4 && SUBAGENT_ROLES[3].id === 'researcher', '4 role personas defined');
  const models = assignModels(4);
  assert(models.length === 4 && new Set(models).size === 4, '4 agents get 4 DISTINCT models');
  for (const id of models) {
    const info = ModelRegistry.getModelById(id);
    assert(Boolean(info) && info!.pricing.freeTierStatus === '100% Free Quota Available', `fleet model free + registered: ${id}`);
    assert(!id.includes('gemini-3') && !id.includes('gemini-2') || id.includes(':free') || id.startsWith('omni/'), `no our-account Gemini in fleet: ${id}`);
  }

  // run(): parallel batch with mocked client — all succeed, synthesis called
  const calls: Array<{ model: string; msgs: number }> = [];
  const origGenerate = UniversalLlmClient.prototype.generateContent;
  UniversalLlmClient.prototype.generateContent = async function (model: string, messages: any) {
    calls.push({ model, msgs: messages.length });
    return `[mock:${model}] answer`;
  };
  try {
    const engine = new SubagentEngine('test-key-123456');
    const run = await engine.run('спроектируй кэш', 3);
    assert(run.results.length === 3, 'run returns 3 results');
    assert(run.results.every((r) => r.ok), 'all mocked agents ok');
    assert(run.results[0].role.title === 'Analyst' && run.results[2].role.title === 'Critic', 'roles sliced in order');
    assert(calls.length === 4, '3 agents + 1 synthesis call');
    assert(run.synthesis.includes('mock'), 'synthesis produced');
    const formatted = SubagentEngine.format(run);
    assert(formatted.includes('SUB-AGENTS') && formatted.includes('СИНТЕЗ'), 'format renders board');
    assert(!formatted.includes('🟢') && !formatted.includes('🔴'), 'output emoji-free (locale policy)');

    // all-fail path
    UniversalLlmClient.prototype.generateContent = async function () { throw new Error('boom'); };
    const failRun = await engine.run('task', 2);
    assert(failRun.results.every((r) => !r.ok), 'all-fail reported per agent');
    assert(failRun.synthesis.includes('[X] All sub-agents failed'), 'all-fail synthesis message');
  } finally {
    UniversalLlmClient.prototype.generateContent = origGenerate;
  }

  console.log(passed ? '  SubagentEngine: ALL PASS' : '  SubagentEngine: FAILURES');
  return passed;
}
