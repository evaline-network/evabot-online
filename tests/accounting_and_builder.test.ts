import { AccountingEngine } from '../src/core/AccountingEngine.js';
import { AgentBuilder } from '../src/core/AgentBuilder.js';
import { ModelCommand } from '../src/models/ModelRatings.js';

export function runAccountingAndBuilderTests(): boolean {
  console.log('\n--- Running AccountingEngine & AgentBuilder Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // 1. AccountingEngine Tests
  const monthlyInfra = AccountingEngine.getTotalMonthlyInfraCost();
  assert(monthlyInfra > 200, `Total monthly infra cost is realistic ($${monthlyInfra.toFixed(2)})`);

  const hourlyInfra = AccountingEngine.getTotalHourlyInfraCost();
  assert(hourlyInfra > 0.25, `Total hourly infra cost is calculated ($${hourlyInfra.toFixed(4)}/h)`);

  const freeRec = AccountingEngine.recordUsage('gemini-3.8-flash', 50000, 10000);
  assert(freeRec.costUSD === 0, 'Gemini 3.8 Flash free token cost is exactly $0.00');
  assert(freeRec.savedUSD > 0, `Free fleet usage calculates savings ($${freeRec.savedUSD.toFixed(4)})`);

  const paidRec = AccountingEngine.recordUsage('claude-3-7-sonnet', 50000, 10000);
  assert(paidRec.costUSD > 0, `Paid model usage calculates real cost ($${paidRec.costUSD.toFixed(4)})`);

  const summary = AccountingEngine.getUsageSummary();
  assert(summary.totalCalls >= 2, `Usage summary tracks total calls (${summary.totalCalls})`);
  assert(summary.totalTokens >= 120000, `Usage summary tracks total tokens (${summary.totalTokens})`);

  const freeUnitCost = AccountingEngine.calculateAgentUnitCost('Lead Architect', 'gemini-3.8-flash');
  assert(freeUnitCost.isFree === true, 'Gemini 3.8 Flash agent is marked free');
  assert(freeUnitCost.typicalTaskCostUSD === 0, 'Free agent task cost is $0.00');

  const costReport = AccountingEngine.formatCostReport();
  assert(costReport.includes('ФИНАНСОВЫЙ ОТЧЕТ И КАЛЬКУЛЯТОР СЕБЕСТОИМОСТИ'), 'Cost report contains header');
  assert(costReport.includes('evabot-agent-vm'), 'Cost report itemizes evabot-agent-vm');
  assert(costReport.includes('evaline-micro-vm'), 'Cost report itemizes evaline-micro-vm');

  // 2. AgentBuilder Tests
  const freeCompany = AgentBuilder.buildFreeCompany();
  assert(freeCompany.roster.length === 10, `Free company has exactly 10 agents (found ${freeCompany.roster.length})`);
  assert(freeCompany.roster.every(a => a.isFree), 'All 10 agents in Free Company use 100% free models');
  assert(freeCompany.roster[0].roleId === 'ceo_architect', 'Free company #1 is CEO & System Architect');
  assert(freeCompany.roster[0].assignedModelId === 'gemini-3.8-flash', 'CEO model is gemini-3.8-flash');

  const paidCompany = AgentBuilder.buildPaidCompany();
  assert(paidCompany.roster.length === 10, `Paid company has exactly 10 agents (found ${paidCompany.roster.length})`);
  assert(paidCompany.roster[0].assignedModelId === 'claude-3-7-sonnet', 'Paid company #1 is claude-3-7-sonnet');

  const freeRosterReport = AgentBuilder.formatCompanyReport(freeCompany);
  assert(freeRosterReport.includes('КОНСТРУКТОР АГЕНТОВ'), 'Company report renders header');
  assert(freeRosterReport.includes('CEO & System Architect'), 'Company report lists roles');

  // 3. Command Integration
  const costCmd = ModelCommand.execute('/cost');
  assert(costCmd.includes('COST LEDGER'), 'Command /cost executes AccountingEngine');

  const companyCmd = ModelCommand.execute('/company free');
  assert(companyCmd.toUpperCase().includes('EVALINE AUTONOMOUS AI ENTERPRISE'), 'Command /company free executes AgentBuilder');

  const infoCmd = ModelCommand.execute('/info gemini-3.8-flash');
  assert(infoCmd.includes('ТЕХНИЧЕСКИЙ ПАСПОРТ МОДЕЛИ: GEMINI 3.8 FLASH'), 'Command /info returns model passport');
  assert(infoCmd.includes('1,048,576 токенов'), 'Model passport has context info');

  return passed;
}
