import { CORPORATE_ROLES, KnowledgeBaseConnector } from '../src/core/CorporateRoles.js';

export async function runRolesTests(): Promise<boolean> {
  console.log('\n--- Running Corporate Roles & Knowledge Base Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // 1. Verify Presets exist
  const roleKeys = Object.keys(CORPORATE_ROLES);
  assert(roleKeys.length >= 4, `At least 4 corporate roles configured (found ${roleKeys.length})`);
  assert('architect' in CORPORATE_ROLES, 'Corporate role "architect" is present');
  assert('devops' in CORPORATE_ROLES, 'Corporate role "devops" is present');
  assert('security_auditor' in CORPORATE_ROLES, 'Corporate role "security_auditor" is present');
  assert('general_assistant' in CORPORATE_ROLES, 'Corporate role "general_assistant" is present');

  // 2. Validate role schemas and currency compliance
  for (const [key, role] of Object.entries(CORPORATE_ROLES)) {
    assert(Boolean(role.id && role.name && role.title && role.department), `Role ${key} has identity metadata`);
    assert(Boolean(role.preferredModel), `Role ${key} specifies a preferred model`);
    assert(role.suggestedTemperature >= 0 && role.suggestedTemperature <= 1, `Role ${key} has valid suggested temperature`);
    assert(['public', 'internal', 'confidential', 'restricted'].includes(role.knowledgeAccessLevel), `Role ${key} has valid access level`);

    // Strict Currency and Geography checks
    const prompt = role.systemPrompt;
    const hasRub = prompt.includes('RUB') || prompt.includes('₽');
    assert(!hasRub, `Role ${key} system prompt contains NO rubles (RUB / ₽)`);
  }

  // 3. KnowledgeBaseConnector Tests
  const kb = new KnowledgeBaseConnector();
  const allDocs = kb.listAllDocuments();
  assert(allDocs.length >= 4, `Knowledge base contains indexed company documents (found ${allDocs.length})`);

  // Search by keyword
  const archDocs = await kb.search('microservices architecture');
  assert(archDocs.length > 0, 'Knowledge base search returns relevant architecture documents');
  assert(archDocs[0].category === 'architecture', 'Top search match matches category architecture');

  // Filter by category
  const secDocs = await kb.search('security', { category: 'security' });
  assert(secDocs.length > 0, 'Knowledge base search filters by category');
  assert(secDocs.every(d => d.category === 'security'), 'All returned docs belong to security category');

  // Document formatting
  const formatted = kb.formatContextForPrompt(archDocs);
  assert(formatted.includes('EVALINE HYBRID DATABASE CONTEXT'), 'Context formatter formats documents with header');
  assert(formatted.includes('doc-arch-001') || formatted.includes('EvaLine Core Microservices'), 'Context formatter contains document title or content');

  // Retrieval by ID
  const docById = await kb.getDocumentById('doc-db-004');
  assert(docById !== null && docById.id === 'doc-db-004', 'KnowledgeBaseConnector retrieves document by exact ID');

  return passed;
}
