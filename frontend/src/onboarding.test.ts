import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ONBOARDING_STEPS,
  OnboardingHandler,
  STORAGE_DONE,
  STORAGE_STEP,
  type OnboardingCtx,
  type OnboardingView,
} from './onboarding';

function makeCtx(): OnboardingCtx {
  return {
    getPersona: vi.fn(() => 'eva'),
    setPersona: vi.fn(),
    getLang: vi.fn(() => 'en'),
    setLang: vi.fn(),
    getMode: vi.fn(() => 'chat'),
    setMode: vi.fn(),
    getDb: vi.fn(() => 'ephemeral'),
    setDb: vi.fn(),
    setConsiliumPreset: vi.fn(),
    openDeckRow: vi.fn(),
    startVoiceTest: vi.fn(),
    onboardingReplay: vi.fn(),
    version: vi.fn(() => '0.0.1'),
  };
}

function collectViews(views: OnboardingView[]): (view: OnboardingView) => void {
  return (view) => views.push(view);
}

beforeEach(() => {
  localStorage.clear();
});

describe('OnboardingHandler', () => {
  it('starts at the first step and renders it', () => {
    const views: OnboardingView[] = [];
    const handler = new OnboardingHandler(makeCtx(), collectViews(views));
    handler.start();

    expect(handler.getIndex()).toBe(0);
    expect(views).toHaveLength(1);
    expect(views[0].kind).toBe('step');
    if (views[0].kind === 'step') {
      expect(views[0].step).toBe(1);
      expect(views[0].total).toBe(ONBOARDING_STEPS.length);
      expect(views[0].title).toBe('WELCOME & LOCALE');
      expect(views[0].ansi).toContain('ONBOARDING // STEP 1/10');
    }
  });

  it('advances steps and persists progress in localStorage', () => {
    const views: OnboardingView[] = [];
    const handler = new OnboardingHandler(makeCtx(), collectViews(views));
    handler.start();
    handler.next();

    const second = views[1];
    expect(handler.getIndex()).toBe(1);
    expect(localStorage.getItem(STORAGE_STEP)).toBe('1');
    expect(second.kind).toBe('step');
    if (second.kind === 'step') {
      expect(second.step).toBe(2);
      expect(second.title).toBe('CO-PILOT PERSONA');
    }
  });

  it('skips steps already configured via localStorage', () => {
    localStorage.setItem('evabot_persona', 'eva');
    localStorage.setItem('evabot_lang', 'uk');

    const views: OnboardingView[] = [];
    const handler = new OnboardingHandler(makeCtx(), collectViews(views));
    handler.start();
    handler.next();

    expect(handler.getIndex()).toBe(3);
    const last = views[views.length - 1];
    expect(last.kind).toBe('step');
    if (last.kind === 'step') {
      expect(last.title).toBe('OPERATIONAL MODE');
    }
  });

  it('executes an action through the context', () => {
    const ctx = makeCtx();
    const handler = new OnboardingHandler(ctx, () => {});
    handler.start();

    const actions = ONBOARDING_STEPS[1].actions(ctx);
    actions[0].run(ctx);
    expect(ctx.setPersona).toHaveBeenCalledWith('eva');
  });

  it('completes after the last step and marks done', () => {
    const views: OnboardingView[] = [];
    const handler = new OnboardingHandler(makeCtx(), collectViews(views));
    handler.start();
    for (let i = 0; i < ONBOARDING_STEPS.length; i += 1) {
      handler.next();
    }

    const last = views[views.length - 1];
    expect(last.kind).toBe('done');
    expect(last.ansi).toContain('ONBOARDING // COMPLETE');
    expect(localStorage.getItem(STORAGE_DONE)).toBe('1');
    expect(localStorage.getItem(STORAGE_STEP)).toBe(String(ONBOARDING_STEPS.length));
  });

  it('isDone and reset manage the completion flag', () => {
    expect(OnboardingHandler.isDone()).toBe(false);
    localStorage.setItem(STORAGE_DONE, '1');
    expect(OnboardingHandler.isDone()).toBe(true);

    OnboardingHandler.reset();
    expect(localStorage.getItem(STORAGE_DONE)).toBeNull();
    expect(localStorage.getItem(STORAGE_STEP)).toBeNull();
  });
});
