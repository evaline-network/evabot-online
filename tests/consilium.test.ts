import { ConsiliumEngine, ConsiliumRunOptions, ConsiliumProgressEvent } from '../src/core/ConsiliumEngine.js';
import { CORPORATE_ROLES } from '../src/core/CorporateRoles.js';

export async function runConsiliumTests(): Promise<boolean> {
  console.log('\n--- Running ConsiliumEngine & Multi-Agent Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  const engine = new ConsiliumEngine();

  // 1. Participant Resolution Tests
  const participants = (engine as any).resolveParticipants({
    mode: 'broadcast',
    prompt: 'Evaluate cloud architecture',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'omniroute/gpt-4o'],
  });

  assert(participants.length === 3, 'Resolves participant list for 3 models');
  assert(participants[0].model === 'gemini-2.5-flash', 'Participant 1 model mapped correctly');
  assert(Boolean(participants[0].roleId), 'Participant 1 has assigned corporate role');
  assert(Boolean(participants[0].systemPrompt), 'Participant 1 has inherited role system prompt');

  // Explicit role assignment
  const customParticipants = (engine as any).resolveParticipants({
    mode: 'dialogue',
    prompt: 'Architecture review',
    participants: [
      { id: 'p1', model: 'gemini-2.5-flash', roleId: 'architect' },
      { id: 'p2', model: 'gemini-2.5-pro', roleId: 'security_auditor' },
    ],
  });

  assert(customParticipants.length === 2, 'Resolves explicit participants');
  assert(customParticipants[0].name === CORPORATE_ROLES.architect.name, 'Enriches participant with architect role name');
  assert(customParticipants[1].name === CORPORATE_ROLES.security_auditor.name, 'Enriches participant with security auditor role name');

  // 2. Mock MockClient to test all 4 modes end-to-end
  let mockCallCount = 0;
  (engine as any).client = {
    generateContent: async (model: string, messages: any[], options: any) => {
      mockCallCount++;
      return `[Mock Response from ${model}] Argument round verified. Budget: $1000 or €920.`;
    },
  };

  // Test Solo Mode
  mockCallCount = 0;
  const soloResult = await engine.run({
    mode: 'solo',
    prompt: 'What is the optimal latency target?',
    models: ['gemini-2.5-flash'],
  });

  assert(soloResult.mode === 'solo', 'Solo mode returns correct mode');
  assert(soloResult.turns.length === 1, 'Solo mode produces exactly 1 turn');
  assert(soloResult.turns[0].content.includes('Mock Response'), 'Solo turn contains generated response');
  assert(soloResult.turns[0].durationMs >= 0, 'Solo turn contains execution duration');

  // Test Broadcast Mode
  mockCallCount = 0;
  const broadcastEvents: ConsiliumProgressEvent[] = [];
  const broadcastResult = await engine.run({
    mode: 'broadcast',
    prompt: 'Review database partitioning strategy',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
    onProgress: (ev) => broadcastEvents.push(ev),
  });

  assert(broadcastResult.mode === 'broadcast', 'Broadcast mode returns correct mode');
  assert(broadcastResult.turns.length === 2, 'Broadcast mode returns turns from all models');
  assert(broadcastEvents.length > 0, 'Broadcast emits progress events');

  // Test Dialogue Mode (2 Models over 2 rounds)
  mockCallCount = 0;
  const dialogueResult = await engine.run({
    mode: 'dialogue',
    prompt: 'Monolith vs Microservices for EvaLine core',
    rounds: 2,
    participants: [
      { id: 'pro', model: 'gemini-2.5-pro', name: 'Architect', roleId: 'architect' },
      { id: 'sec', model: 'gemini-2.5-flash', name: 'Security', roleId: 'security_auditor' },
    ],
  });

  assert(dialogueResult.mode === 'dialogue', 'Dialogue mode returns correct mode');
  // 2 rounds * 2 participants = 4 turns
  assert(dialogueResult.turns.length === 4, `Dialogue produces 4 turns across 2 rounds (got ${dialogueResult.turns.length})`);
  assert(dialogueResult.totalRounds === 2, 'Dialogue records total rounds count');

  // Test Consilium Mode (3 Models with Synthesis)
  mockCallCount = 0;
  const consiliumResult = await engine.run({
    mode: 'consilium',
    prompt: 'EvaLine Q4 Infrastructure Migration Roadmap',
    rounds: 1,
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'omniroute/gpt-4o'],
    synthesizerModel: 'gemini-2.5-pro',
    useKnowledgeBase: true,
  });

  assert(consiliumResult.mode === 'consilium', 'Consilium mode returns correct mode');
  assert(consiliumResult.turns.length === 3, 'Consilium executes round turns for all participants');
  assert(Boolean(consiliumResult.synthesis), 'Consilium produces final consensus synthesis');
  assert(consiliumResult.knowledgeBaseContextIncluded === true, 'Consilium includes hybrid knowledge base context');

  return passed;
}
