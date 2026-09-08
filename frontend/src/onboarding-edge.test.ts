import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ONBOARDING_STEPS,
  OnboardingHandler,
  STORAGE_DONE,
  STORAGE_STEP,
} from './onboarding';
import type { OnboardingCtx, OnboardingView } from './onboarding';

function makeCtx(overrides: Partial<Record<keyof OnboardingCtx, unknown>> = {}): OnboardingCtx {
  return {
    getPersona: () => 'dual',
    setPersona: () => {},
    getLang: () => 'en',
    setLang: () => {},
    getMode: () => 'chat',
    setMode: () => {},
    getDb: () => 'hybrid',
    setDb: () => {},
    setConsiliumPreset: () => {},
    openDeckRow: () => {},
    startVoiceTest: () => {},
    onboardingReplay: () => {},
    version: () => 'test',
    ...overrides,
  } as OnboardingCtx;
}

function collect(): { views: OnboardingView[]; render: (v: OnboardingView) => void } {
  const views: OnboardingView[] = [];
  return { views, render: (v) => views.push(v) };
}

beforeEach(() => {
  OnboardingHandler.reset();
});

afterEach(() => {
  OnboardingHandler.reset();
  localStorage.removeItem('evabot_persona');
  localStorage.removeItem('evabot_lang');
  localStorage.removeItem('evabot_mode');
  localStorage.removeItem('evabot_model');
  localStorage.removeItem('evabot_db');
  localStorage.removeItem('evabot_consilium');
});

describe('OnboardingHandler stored-index recovery', () => {
  it('falls back to step 0 for corrupted, negative and out-of-range saved values', () => {
    for (const bad of ['not-a-number', '-1', '99', '999999']) {
      localStorage.setItem(STORAGE_STEP, bad);
      const { views, render } = collect();
      new OnboardingHandler(makeCtx(), render).start();
      expect(views[0].kind).toBe('step');
      if (views[0].kind === 'step') {
        expect(views[0].step).toBe(1);
        expect(views[0].title).toBe(ONBOARDING_STEPS[0].title);
      }
    }
  });

  it('truncates fractional saved values to a valid integer index', () => {
    localStorage.setItem(STORAGE_STEP, '3.7');
    const { views, render } = collect();
    new OnboardingHandler(makeCtx(), render).start();
    if (views[0].kind === 'step') {
      expect(views[0].step).toBe(4);
      expect(views[0].title).toBe(ONBOARDING_STEPS[3].title);
    }
  });

  it('resumes from a valid saved step index', () => {
    localStorage.setItem(STORAGE_STEP, '2');
    const { views, render } = collect();
    new OnboardingHandler(makeCtx(), render).start();
    expect(views).toHaveLength(1);
    if (views[0].kind === 'step') {
      expect(views[0].step).toBe(3);
      expect(views[0].title).toBe(ONBOARDING_STEPS[2].title);
    }
  });
});

describe('OnboardingHandler completion edge cases', () => {
  it('completes when the saved index points at the last step and next() is called', () => {
    const last = ONBOARDING_STEPS.length - 1;
    localStorage.setItem(STORAGE_STEP, String(last));
    const { views, render } = collect();
    const handler = new OnboardingHandler(makeCtx(), render);
    handler.start();
    expect(views[0].kind).toBe('step');
    handler.next();
    expect(views[1].kind).toBe('done');
    expect(localStorage.getItem(STORAGE_DONE)).toBe('1');
    expect(Number(localStorage.getItem(STORAGE_STEP))).toBe(ONBOARDING_STEPS.length);
    if (views[1].kind === 'done') {
      expect(views[1].ansi).toContain('ONBOARDING // COMPLETE');
      expect(views[1].actions.map((a) => a.label)).toContain('[REPLAY]');
    }
  });

  it('never advances past the final step', () => {
    localStorage.setItem(STORAGE_STEP, String(ONBOARDING_STEPS.length - 1));
    const { views, render } = collect();
    const handler = new OnboardingHandler(makeCtx(), render);
    handler.start();
    expect(views).toHaveLength(1);
    handler.next();
    expect(views).toHaveLength(2);
    expect(views[1].kind).toBe('done');
    handler.next();
    expect(views).toHaveLength(2);
  });
});

describe('OnboardingHandler auto-skip chains', () => {
  it('skips every auto-configurable step when all settings exist', () => {
    localStorage.setItem('evabot_persona', 'eva');
    localStorage.setItem('evabot_lang', 'uk');
    localStorage.setItem('evabot_mode', 'consilium');
    localStorage.setItem('evabot_model', 'gemini-2.5-flash');
    localStorage.setItem('evabot_db', 'qdrant');
    localStorage.setItem('evabot_consilium', 'top10_paid');
    localStorage.setItem(STORAGE_STEP, '1');
    const { views, render } = collect();
    const handler = new OnboardingHandler(makeCtx(), render);
    handler.start();
    expect(views[0].kind).toBe('step');
    if (views[0].kind === 'step') {
      expect(views[0].title).toBe('VOICE LIVE-CHAT');
      expect(views[0].step).toBe(8);
      expect(views[0].actions.map((a) => a.label)).toEqual(['[TEST MIC →]']);
    }
  });

  it('skips only the configured prefix and stops at the first manual step', () => {
    localStorage.setItem('evabot_persona', 'adam');
    localStorage.setItem(STORAGE_STEP, '1');
    const { views, render } = collect();
    new OnboardingHandler(makeCtx(), render).start();
    if (views[0].kind === 'step') {
      expect(views[0].title).toBe('LANGUAGE');
      expect(views[0].step).toBe(3);
    }
  });

  it('shows the welcome step first even when later steps are configured', () => {
    localStorage.setItem('evabot_persona', 'adam');
    const { views, render } = collect();
    new OnboardingHandler(makeCtx(), render).start();
    if (views[0].kind === 'step') {
      expect(views[0].title).toBe('WELCOME & LOCALE');
      expect(views[0].step).toBe(1);
    }
  });
});

describe('ONBOARDING_STEPS spec invariants', () => {
  it('has unique keys and titles across all 10 steps', () => {
    expect(ONBOARDING_STEPS).toHaveLength(10);
    expect(new Set(ONBOARDING_STEPS.map((s) => s.key)).size).toBe(10);
    expect(new Set(ONBOARDING_STEPS.map((s) => s.title)).size).toBe(10);
  });

  it('every step yields body lines and at least one action', () => {
    const ctx = makeCtx();
    for (const step of ONBOARDING_STEPS) {
      const body = step.body(ctx);
      expect(body.length).toBeGreaterThan(0);
      for (const line of body) expect(typeof line).toBe('string');
      expect(step.actions(ctx).length).toBeGreaterThan(0);
      expect(typeof step.autoDone(ctx)).toBe('boolean');
    }
  });

  it('autoDone reacts to the matching localStorage key per step', () => {
    const ctx = makeCtx();
    const personaStep = ONBOARDING_STEPS.find((s) => s.key === 'persona');
    expect(personaStep?.autoDone(ctx)).toBe(false);
    localStorage.setItem('evabot_persona', 'adam');
    expect(personaStep?.autoDone(ctx)).toBe(true);
    const welcomeStep = ONBOARDING_STEPS.find((s) => s.key === 'welcome');
    expect(welcomeStep?.autoDone(ctx)).toBe(false);
  });

  it('ready step composes ctx state into its body text', () => {
    const ctx = makeCtx({
      getPersona: () => 'adam',
      getMode: () => 'consilium',
      getDb: () => 'postgres',
      getLang: () => 'ru',
      version: () => '5.5.5',
    });
    const readyStep = ONBOARDING_STEPS.find((s) => s.key === 'ready');
    const body = readyStep?.body(ctx) ?? [];
    const joined = body.join('\n');
    expect(joined).toContain('ADAM');
    expect(joined).toContain('CONSILIUM');
    expect(joined).toContain('POSTGRES');
    expect(joined).toContain('RU');
    expect(joined).toContain('v5.5.5');
  });
});
