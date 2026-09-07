import { ConsiliumEngine, ConsiliumParticipant } from './src/core/ConsiliumEngine.js';
import { CORPORATE_ROLES } from './src/core/CorporateRoles.js';
import fs from 'node:fs';

async function runTestConsilium() {
  console.log('=== Starting Real EvaLine Consilium Test ===\n');

  const engine = new ConsiliumEngine();

  const participants: ConsiliumParticipant[] = [
    {
      id: 'agent-adam',
      model: 'gemini-2.5-flash',
      roleId: 'adam',
      name: CORPORATE_ROLES.adam.name,
      title: CORPORATE_ROLES.adam.title,
      systemPrompt: CORPORATE_ROLES.adam.systemPrompt,
      temperature: 0.2,
    },
    {
      id: 'agent-eva',
      model: 'gemini-2.5-flash',
      roleId: 'eva',
      name: CORPORATE_ROLES.eva.name,
      title: CORPORATE_ROLES.eva.title,
      systemPrompt: CORPORATE_ROLES.eva.systemPrompt,
      temperature: 0.3,
    },
    {
      id: 'agent-architect',
      model: 'gemini-2.5-pro',
      roleId: 'architect',
      name: CORPORATE_ROLES.architect.name,
      title: CORPORATE_ROLES.architect.title,
      systemPrompt: CORPORATE_ROLES.architect.systemPrompt,
      temperature: 0.2,
    },
  ];

  const prompt = 'Детальний аналіз компанії EvaLine (evaline.com.ua): де знаходиться виробництво, які потужності, основні лінійки продукції B2B/B2C, експорт до ЄС, переваги матеріалу ЕВА над гумою та ПВХ, сертифікація та стійкість під час війни.';

  const result = await engine.run({
    mode: 'consilium',
    prompt,
    participants,
    rounds: 2,
    synthesizerModel: 'gemini-2.5-pro',
    useKnowledgeBase: true,
    onProgress: (ev) => {
      console.log(`[PROGRESS] ${ev.type}: ${ev.message || ''}`);
    },
  });

  console.log('\n================ CONSILIUM EXECUTION COMPLETE ================');
  console.log(`Mode: ${result.mode}`);
  console.log(`Total Rounds: ${result.totalRounds}`);
  console.log(`Total Turns: ${result.turns.length}`);
  console.log(`Duration: ${(result.durationMs / 1000).toFixed(1)}s`);
  console.log(`KB Context Included: ${result.knowledgeBaseContextIncluded}`);

  fs.writeFileSync('/var/www/evabot-backend/consilium-result.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('Result saved to /var/www/evabot-backend/consilium-result.json');
}

runTestConsilium().catch((err) => {
  console.error('Consilium failed:', err);
  process.exit(1);
});
