import { ConsiliumEngine, ConsiliumRunOptions, ConsiliumProgressEvent, ConsiliumParticipant } from '../src/core/ConsiliumEngine.js';
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

  // Participant Bounds: 3 to 10 Validation
  // Case A: 0 participants -> auto-expands to 3
  const bounded0 = engine.validateConsiliumParticipants([]);
  assert(bounded0.length === 3, '0 participants auto-expanded to minimum 3 participants');
  assert(bounded0[0].roleId === 'architect', 'Auto-expanded participant 1 assigned architect role');
  assert(bounded0[1].roleId === 'devops', 'Auto-expanded participant 2 assigned devops role');
  assert(bounded0[2].roleId === 'security_auditor', 'Auto-expanded participant 3 assigned security_auditor role');

  // Case B: 1 participant -> auto-expands to 3
  const bounded1 = engine.validateConsiliumParticipants([
    { id: 'solo', model: 'gemini-2.5-flash', name: 'Lead Dev', roleId: 'architect' },
  ]);
  assert(bounded1.length === 3, '1 participant auto-expanded to 3 participants');
  assert(bounded1[0].id === 'solo', 'Original participant preserved at index 0');

  // Case C: 2 participants -> auto-expands to 3
  const bounded2 = engine.validateConsiliumParticipants([
    { id: 'p1', model: 'gemini-2.5-flash', name: 'P1' },
    { id: 'p2', model: 'gemini-2.5-pro', name: 'P2' },
  ]);
  assert(bounded2.length === 3, '2 participants auto-expanded to 3 participants');

  // Case D: Exactly 3 participants -> preserved
  const bounded3 = engine.validateConsiliumParticipants(participants);
  assert(bounded3.length === 3, 'Exactly 3 participants preserved without modification');

  // Case E: 5 participants -> preserved
  const list5: ConsiliumParticipant[] = Array.from({ length: 5 }, (_, i) => ({
    id: `agent-${i + 1}`,
    model: 'gemini-2.5-flash',
    name: `Agent ${i + 1}`,
  }));
  const bounded5 = engine.validateConsiliumParticipants(list5);
  assert(bounded5.length === 5, '5 participants preserved correctly');

  // Case F: Exactly 10 participants -> preserved
  const list10: ConsiliumParticipant[] = Array.from({ length: 10 }, (_, i) => ({
    id: `agent-${i + 1}`,
    model: 'gemini-2.5-flash',
    name: `Agent ${i + 1}`,
  }));
  const bounded10 = engine.validateConsiliumParticipants(list10);
  assert(bounded10.length === 10, '10 participants preserved at upper boundary');

  // Case G: 12 participants -> clamped to 10
  const list12: ConsiliumParticipant[] = Array.from({ length: 12 }, (_, i) => ({
    id: `agent-${i + 1}`,
    model: 'gemini-2.5-flash',
    name: `Agent ${i + 1}`,
  }));
  const bounded12 = engine.validateConsiliumParticipants(list12);
  assert(bounded12.length === 10, '12 participants correctly clamped to maximum 10');
  assert(bounded12[9].id === 'agent-10', '10th participant preserved, 11th and 12th discarded');

  // Case H: 15 participants -> clamped to 10
  const list15: ConsiliumParticipant[] = Array.from({ length: 15 }, (_, i) => ({
    id: `agent-${i + 1}`,
    model: 'gemini-2.5-flash',
    name: `Agent ${i + 1}`,
  }));
  const bounded15 = engine.validateConsiliumParticipants(list15);
  assert(bounded15.length === 10, '15 participants correctly clamped to maximum 10');

  // 2. Mock MockClient to test all 4 modes end-to-end
  let mockCallCount = 0;
  (engine as any).client = {
    generateContent: async (model: string, messages: any[], options: any) => {
      mockCallCount++;
      return `[Mock Response from ${model}] Argument round verified. Budget: $1000 or €920.`;
    },
  };

  // ============================================================================
  // 2. Mode 1: Solo Mode Tests (1 user prompt -> 1 model response)
  // ============================================================================
  mockCallCount = 0;
  const soloEvents: ConsiliumProgressEvent[] = [];
  const soloResult = await engine.run({
    mode: 'solo',
    prompt: 'What is the optimal latency target?',
    models: ['gemini-2.5-flash'],
    onProgress: (ev) => soloEvents.push(ev),
  });

  assert(soloResult.mode === 'solo', 'Solo mode returns correct mode');
  assert(soloResult.turns.length === 1, 'Solo mode produces exactly 1 turn');
  assert(soloResult.participants.length === 1, 'Solo mode has exactly 1 participant');
  assert(soloResult.turns[0].content.includes('Mock Response'), 'Solo turn contains generated response');
  assert(soloResult.turns[0].durationMs >= 0, 'Solo turn contains execution duration');
  assert(soloResult.totalRounds === 1, 'Solo mode total rounds is 1');
  assert(soloEvents.some((e) => e.type === 'turn_start'), 'Solo emits turn_start event');
  assert(soloEvents.some((e) => e.type === 'turn_complete'), 'Solo emits turn_complete event');

  // Solo with explicit participant configuration
  const soloCustomResult = await engine.run({
    mode: 'solo',
    prompt: 'Audit infrastructure security policy',
    participants: [
      { id: 'solo-sec', model: 'gemini-2.5-pro', name: 'Chief Security Officer', roleId: 'security_auditor' },
    ],
  });
  assert(soloCustomResult.participants[0].name === 'Chief Security Officer', 'Solo preserves custom participant name');
  assert(soloCustomResult.turns[0].role === CORPORATE_ROLES.security_auditor.title, 'Solo reflects corporate role title');

  // Solo error resilience test
  const errorEngine = new ConsiliumEngine();
  (errorEngine as any).client = {
    generateContent: async () => {
      throw new Error('API Rate limit exceeded (429)');
    },
  };
  const soloErrorResult = await errorEngine.run({
    mode: 'solo',
    prompt: 'Test failure handling',
    models: ['gemini-2.5-flash'],
  });
  assert(soloErrorResult.turns.length === 1, 'Solo returns turn even on LLM failure');
  assert(soloErrorResult.turns[0].content.includes('Error querying model'), 'Solo captures error message gracefully in turn content');

  // ============================================================================
  // 3. Mode 2: Broadcast Mode Tests (1 prompt -> all selected models in parallel)
  // ============================================================================
  mockCallCount = 0;
  const broadcastEvents: ConsiliumProgressEvent[] = [];
  const broadcastResult = await engine.run({
    mode: 'broadcast',
    prompt: 'Review database partitioning strategy',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'omniroute/deepseek-r1', 'opencode/go-coder-32b'],
    onProgress: (ev) => broadcastEvents.push(ev),
  });

  assert(broadcastResult.mode === 'broadcast', 'Broadcast mode returns correct mode');
  assert(broadcastResult.turns.length === 4, 'Broadcast mode returns turns from all 4 models in parallel');
  assert(broadcastResult.participants.length === 4, 'Broadcast preserves all 4 participants');
  assert(broadcastEvents.length > 0, 'Broadcast emits progress events');
  assert(broadcastEvents.some((e) => e.type === 'round_complete'), 'Broadcast emits round_complete event');
  assert(broadcastEvents.filter((e) => e.type === 'turn_complete').length === 4, 'Broadcast emits turn_complete for every participant');

  // Broadcast error resilience: 1 model fails, 2 succeed
  (engine as any).client = {
    generateContent: async (model: string) => {
      if (model === 'failing-model') {
        throw new Error('Connection timeout to upstream');
      }
      return `[Response from ${model}] Verified. Cost: $0.10.`;
    },
  };
  const broadcastResilientResult = await engine.run({
    mode: 'broadcast',
    prompt: 'Verify partial failure handling',
    models: ['gemini-2.5-flash', 'failing-model', 'gemini-2.5-pro'],
  });
  assert(broadcastResilientResult.turns.length === 3, 'Broadcast produces turns for all models despite 1 failure');
  assert(broadcastResilientResult.turns[0].content.includes('[Response from gemini-2.5-flash]'), 'First model succeeds in broadcast');
  assert(broadcastResilientResult.turns[1].content.includes('Error querying model failing-model'), 'Failed model captured gracefully');
  assert(broadcastResilientResult.turns[2].content.includes('[Response from gemini-2.5-pro]'), 'Third model succeeds in broadcast');

  // Reset standard mock
  (engine as any).client = {
    generateContent: async (model: string) => {
      mockCallCount++;
      return `[Mock Response from ${model}] Argument round verified. Budget: $1000 or €920.`;
    },
  };

  // ============================================================================
  // 4. Mode 3: Dialogue Mode Tests (2 models exchange arguments turn-by-turn)
  // ============================================================================
  // Dialogue 1 round (2 turns + synthesis)
  mockCallCount = 0;
  const dialogueEvents1: ConsiliumProgressEvent[] = [];
  const dialogueResult1 = await engine.run({
    mode: 'dialogue',
    prompt: 'Rust vs Go for high-throughput edge service',
    rounds: 1,
    participants: [
      { id: 'pro', model: 'gemini-2.5-pro', name: 'Lead Architect', roleId: 'architect' },
      { id: 'sec', model: 'gemini-2.5-flash', name: 'Security Auditor', roleId: 'security_auditor' },
    ],
    onProgress: (ev) => dialogueEvents1.push(ev),
  });

  assert(dialogueResult1.mode === 'dialogue', 'Dialogue 1 round returns correct mode');
  assert(dialogueResult1.turns.length === 2, 'Dialogue 1 round produces exactly 2 turns (1 per model)');
  assert(dialogueResult1.totalRounds === 1, 'Dialogue 1 round records totalRounds = 1');
  assert(Boolean(dialogueResult1.synthesis), 'Dialogue 1 round produces executive synthesis');
  assert(dialogueEvents1.some((e) => e.type === 'synthesis_start'), 'Dialogue emits synthesis_start event');
  assert(dialogueEvents1.some((e) => e.type === 'synthesis_complete'), 'Dialogue emits synthesis_complete event');

  // Dialogue 2 rounds (4 turns + synthesis)
  mockCallCount = 0;
  const dialogueResult2 = await engine.run({
    mode: 'dialogue',
    prompt: 'Monolith vs Microservices for EvaLine core',
    rounds: 2,
    participants: [
      { id: 'pro', model: 'gemini-2.5-pro', name: 'Architect', roleId: 'architect' },
      { id: 'sec', model: 'gemini-2.5-flash', name: 'Security', roleId: 'security_auditor' },
    ],
  });

  assert(dialogueResult2.mode === 'dialogue', 'Dialogue mode returns correct mode');
  assert(dialogueResult2.turns.length === 4, `Dialogue produces 4 turns across 2 rounds (got ${dialogueResult2.turns.length})`);
  assert(dialogueResult2.totalRounds === 2, 'Dialogue records total rounds count = 2');
  assert(dialogueResult2.turns[0].participantId === 'pro', 'Turn 1 is participant 1');
  assert(dialogueResult2.turns[1].participantId === 'sec', 'Turn 2 is participant 2');
  assert(dialogueResult2.turns[2].participantId === 'pro', 'Turn 3 is participant 1 (round 2)');
  assert(dialogueResult2.turns[3].participantId === 'sec', 'Turn 4 is participant 2 (round 2)');

  // Dialogue 3 rounds (6 turns + synthesis)
  const dialogueResult3 = await engine.run({
    mode: 'dialogue',
    prompt: 'Kubernetes vs Serverless for EvaBot worker nodes',
    rounds: 3,
    models: ['gemini-2.5-pro', 'gemini-2.5-flash'],
  });
  assert(dialogueResult3.turns.length === 6, 'Dialogue 3 rounds produces exactly 6 turns');
  assert(dialogueResult3.totalRounds === 3, 'Dialogue 3 rounds records totalRounds = 3');

  // Dialogue participant fallback (only 1 participant given -> auto-populates challenger)
  const dialogueFallbackResult = await engine.run({
    mode: 'dialogue',
    prompt: 'Single participant fallback verification',
    participants: [
      { id: 'solo-arguer', model: 'gemini-2.5-pro', name: 'Proponent' },
    ],
  });
  assert(dialogueFallbackResult.participants.length === 2, 'Dialogue auto-populates second participant when only 1 provided');
  assert(dialogueFallbackResult.turns.length === 4, 'Dialogue fallback executes full 2-round debate');

  // Dialogue error resilience test (turn error & synthesis error handled gracefully)
  const dialogueErrorEngine = new ConsiliumEngine();
  (dialogueErrorEngine as any).client = {
    generateContent: async (model: string, messages: any[]) => {
      const isSynth = messages.some((m) => m.content && m.content.includes('Senior Technical Arbiter'));
      if (isSynth) {
        throw new Error('Synthesis model unavailable');
      }
      if (model.includes('failing')) {
        throw new Error('Model inference crash');
      }
      return `Valid dialogue turn from ${model}`;
    },
  };
  const dialogueErrorResult = await dialogueErrorEngine.run({
    mode: 'dialogue',
    prompt: 'Test dialogue error resilience',
    rounds: 1,
    participants: [
      { id: 'p1', model: 'failing-model', name: 'P1' },
      { id: 'p2', model: 'gemini-2.5-flash', name: 'P2' },
    ],
  });
  assert(dialogueErrorResult.turns.length === 2, 'Dialogue returns turns despite turn error');
  assert(dialogueErrorResult.turns[0].content.includes('Error generating argument'), 'P1 error captured in turn content');
  assert(dialogueErrorResult.turns[1].content.includes('Valid dialogue turn'), 'P2 completes successfully');
  assert(dialogueErrorResult.synthesis?.includes('Dialogue synthesis generation error'), 'Synthesis failure captured gracefully without crash');

  // ============================================================================
  // 5. Mode 4: Consilium Mode Tests (3 to 10+ models with consensus synthesis)
  // ============================================================================
  // Consilium 3 models, 1 round (3 turns + 1 synthesis)
  mockCallCount = 0;
  const consiliumEvents: ConsiliumProgressEvent[] = [];
  const consiliumResult = await engine.run({
    mode: 'consilium',
    prompt: 'EvaLine Q4 Infrastructure Migration Roadmap',
    rounds: 1,
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'omniroute/gpt-4o'],
    synthesizerModel: 'gemini-2.5-pro',
    useKnowledgeBase: true,
    onProgress: (ev) => consiliumEvents.push(ev),
  });

  assert(consiliumResult.mode === 'consilium', 'Consilium mode returns correct mode');
  assert(consiliumResult.turns.length === 3, 'Consilium executes round turns for all 3 participants');
  assert(Boolean(consiliumResult.synthesis), 'Consilium produces final consensus synthesis');
  assert(consiliumResult.knowledgeBaseContextIncluded === true, 'Consilium includes hybrid knowledge base context');
  assert(consiliumEvents.some((e) => e.type === 'round_complete'), 'Consilium emits round_complete event');
  assert(consiliumEvents.some((e) => e.type === 'synthesis_start'), 'Consilium emits synthesis_start event');
  assert(consiliumEvents.some((e) => e.type === 'synthesis_complete'), 'Consilium emits synthesis_complete event');

  // Consilium 3 models, 2 rounds (3 R1 turns + 3 R2 turns = 6 turns + 1 synthesis)
  const consilium2RoundsResult = await engine.run({
    mode: 'consilium',
    prompt: 'Zero-Trust Architecture Rollout for Banking Gateway',
    rounds: 2,
    models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'omniroute/claude-3.5-sonnet'],
  });
  assert(consilium2RoundsResult.turns.length === 6, 'Consilium 2 rounds produces 6 turns (3 agents * 2 rounds)');
  assert(consilium2RoundsResult.totalRounds === 2, 'Consilium 2 rounds records totalRounds = 2');
  assert(consilium2RoundsResult.turns.filter((t) => t.round === 1).length === 3, 'Consilium has 3 turns in round 1');
  assert(consilium2RoundsResult.turns.filter((t) => t.round === 2).length === 3, 'Consilium has 3 turns in round 2');

  // Consilium 5 models, 1 round
  const consilium5Result = await engine.run({
    mode: 'consilium',
    prompt: 'Multi-Region Distributed Database Architecture',
    rounds: 1,
    models: [
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'omniroute/deepseek-r1',
      'opencode/go-coder-32b',
      'deepseek/deepseek-r1:free',
    ],
  });
  assert(consilium5Result.participants.length === 5, 'Consilium executes with 5 participants');
  assert(consilium5Result.turns.length === 5, 'Consilium 5 agents produces 5 turns');

  // Consilium 10 models (maximum supported active participants)
  const models10 = [
    'gemini-3.8-flash',
    'gemini-3.1-pro',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemma-2-27b-it',
    'claude-3.7-sonnet',
    'llama-3.3-70b-instruct',
    'mistral-large-2411',
    'deepseek-r1',
    'command-r-plus',
  ];
  const consilium10Result = await engine.run({
    mode: 'consilium',
    prompt: 'Corporate AI Governance Framework 2026',
    rounds: 1,
    models: models10,
  });
  assert(consilium10Result.participants.length === 10, 'Consilium executes with exactly 10 participants');
  assert(consilium10Result.turns.length === 10, 'Consilium 10 agents produces 10 turns');

  // Consilium bounds enforcement: 12 models passed -> clamped to 10 participants
  const models12 = [
    ...models10,
    'omniroute/deepseek-r1',
    'opencode/go-fast',
  ];
  const consilium12Result = await engine.run({
    mode: 'consilium',
    prompt: 'High-Volume Payment Gateway Scalability',
    rounds: 1,
    models: models12,
  });
  assert(consilium12Result.participants.length === 10, 'Consilium strictly clamps 12 models to 10 participants');
  assert(consilium12Result.turns.length === 10, 'Consilium with 12 models produces turns for strictly 10 participants');

  // Consilium bounds enforcement: empty models/participants -> auto-expands to 3 participants
  const consiliumEmptyResult = await engine.run({
    mode: 'consilium',
    prompt: 'Automatic expansion test',
    rounds: 1,
    models: [],
  });
  assert(consiliumEmptyResult.participants.length === 3, 'Consilium with empty models auto-expands to 3 participants');
  assert(consiliumEmptyResult.turns.length === 3, 'Consilium produces 3 turns for auto-expanded participants');

  // Consilium error resilience test (participant error in round 1 & 2 + synthesis failure)
  const consiliumErrorEngine = new ConsiliumEngine();
  (consiliumErrorEngine as any).client = {
    generateContent: async (model: string, messages: any[]) => {
      const isSynth = messages.some((m) => m.content && m.content.includes('EvaLine Supreme Technical Council'));
      if (isSynth) {
        throw new Error('Consensus synthesis LLM failed');
      }
      if (model === 'failing-agent') {
        throw new Error('Agent LLM generation failed');
      }
      return `Valid consilium stance from ${model}`;
    },
  };
  const consiliumErrorResult = await consiliumErrorEngine.run({
    mode: 'consilium',
    prompt: 'Verify consilium partial failure resilience',
    rounds: 2,
    models: ['failing-agent', 'gemini-2.5-flash', 'gemini-2.5-pro'],
  });
  assert(consiliumErrorResult.turns.length === 6, 'Consilium returns 6 turns across 2 rounds despite 1 failing agent');
  assert(consiliumErrorResult.turns[0].content.includes('Perspective unavailable due to query error'), 'R1 error captured in turn content');
  assert(consiliumErrorResult.turns[3].content.includes('Deliberation note unavailable'), 'R2 error captured in turn content');
  assert(consiliumErrorResult.turns[1].content.includes('Valid consilium stance'), 'Other agents continue in R1');
  assert(consiliumErrorResult.turns[4].content.includes('Valid consilium stance'), 'Other agents continue in R2');
  assert(consiliumErrorResult.synthesis?.includes('Consilium consensus synthesis generation error'), 'Consensus synthesis error handled gracefully');

  return passed;
}
