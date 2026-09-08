import { AutoModelRouter, analyzeTask, estimateTokens } from '../src/core/AutoModelRouter.js';
import { ModelRegistry } from '../src/models/ModelRegistry.js';
import { ModelCommand } from '../src/models/ModelRatings.js';
import { getBreaker } from '../src/core/Resilience.js';
import { ChatHistoryStore } from '../src/core/ChatHistoryStore.js';

export function runAutoModelRouterTests(): boolean {
  console.log('\n--- Running AutoModelRouter Tests (/auto, TASK-320) ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // estimateTokens
  assert(estimateTokens('') === 0, 'estimateTokens(empty) === 0');
  assert(estimateTokens('x'.repeat(400)) > 90, 'estimateTokens scales with length');

  // analyzeTask
  const light = analyzeTask({ message: 'Привет, как дела?' });
  assert(light.complexity === 'light', `light chat → light (got ${light.complexity})`);

  const code = analyzeTask({ message: 'Отрефактори этот class и почини race condition:\n```ts\nfunction f() {}\n```' });
  assert(code.complexity === 'code', `code message → code (got ${code.complexity})`);

  const reasoning = analyzeTask({ message: 'Почему strategy А лучше? Проанализируй trade-off архитектуры' });
  assert(reasoning.complexity === 'reasoning', `analysis → reasoning (got ${reasoning.complexity})`);

  // pick: only free models, real registry ids
  AutoModelRouter.setActive('test-auto', true);
  const d1 = AutoModelRouter.pick({ message: 'Привет! Как погода?' }, 'test-auto');
  assert(Boolean(d1.modelId), 'pick returns a model id');
  const info = ModelRegistry.getModelById(d1.modelId);
  assert(Boolean(info), `picked model exists in registry: ${d1.modelId}`);
  assert(info!.pricing.freeTierStatus === '100% Free Quota Available', `picked model is FREE: ${d1.modelId}`);
  assert(AutoModelRouter.getLastDecision('test-auto')?.modelId === d1.modelId, 'last decision cached per session');

  // big payload → disqualified narrow-context models, still free
  const big = 'x'.repeat(200_000);
  const d2 = AutoModelRouter.pick({ message: big }, 'test-auto');
  const info2 = ModelRegistry.getModelById(d2.modelId);
  assert(info2!.contextWindow >= 200_000, `large payload keeps large-window model (ctx=${info2!.contextWindow})`);
  assert(info2!.pricing.freeTierStatus === '100% Free Quota Available', 'large-payload pick is still FREE');

  // off
  AutoModelRouter.setActive('test-auto', false);
  assert(!AutoModelRouter.isActive('test-auto'), 'setActive(false) clears session');

  // TASK-333: /auto flag + last used model persist to session_state
  const store = ChatHistoryStore.getInstance();
  const persistSess = 'test-auto-persist';
  AutoModelRouter.setActive(persistSess, true);
  assert(store.getSessionState(persistSess).autoEnabled === true, 'setActive(true) persists auto_enabled=1 in session_state');
  AutoModelRouter.setActive(persistSess, false);
  assert(store.getSessionState(persistSess).autoEnabled === false, 'setActive(false) persists auto_enabled=0 in session_state');
  const dPersist = AutoModelRouter.pick({ message: 'Привет!' }, persistSess);
  assert(store.getSessionState(persistSess).lastModel === dPersist.modelId, `pick() persists lastModel to session_state (${dPersist.modelId})`);

  // open breaker → provider excluded
  const gBreaker = getBreaker('google');
  gBreaker.openThreshold = 1;
  gBreaker.recordFailure(new Error('test outage'));
  const d3 = AutoModelRouter.pick({ message: 'Привет!' }, 'test-auto-off');
  assert(d3.provider !== 'google' || gBreaker.getState() !== 'open', 'open breaker excludes provider');
  gBreaker.recordSuccess();
  gBreaker.openThreshold = 3;

  // /auto command surface
  const status = ModelCommand.execute('/auto');
  assert(status.includes('AUTO'), '/auto renders status');
  assert(ModelCommand.execute('/авто off').includes('выключен'), 'uk alias /авто works');
  const test = ModelCommand.execute('/auto test отрефактори класс с race condition');
  assert(test.includes('ВЫБРАНО'), '/auto test renders decision');
  const fleet = ModelCommand.execute('/auto fleet');
  assert(!fleet.includes('[MISSING]'), 'fleet contains only verified registry ids');

  // cleanup session_state rows created by this test run
  store.deleteSessionState(persistSess);
  store.deleteSessionState('test-auto');
  store.deleteSessionState('test-auto-off');

  return passed;
}
