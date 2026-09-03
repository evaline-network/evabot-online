import { StateStore } from '../core/StateStore.js';
export class AccountingPlugin {
    id = 'accounting';
    name = 'Expenses & Accounting Plugin';
    version = '1.0.0';
    screenId = 'tab-costs';
    tabTitle = {
        en: '[3] ACCOUNTING',
        uk: '[3] ВИТРАТИ ТА БУХГАЛТЕРІЯ',
        ru: '[3] РАСХОДЫ И БУХГАЛТЕРИЯ'
    };
    init(manager) { }
    render(lang) {
        const entries = StateStore.getInstance().getAccountingEntries();
        let rowsHtml = '';
        entries.forEach(e => {
            const sign = e.type === 'INCOME' ? '+' : '';
            rowsHtml += `
        <tr>
          <td>${e.date}</td>
          <td>${e.category}</td>
          <td>${e.description}</td>
          <td>${sign}$${e.amountUsd.toFixed(2)}</td>
          <td>${sign}€${e.amountEur.toFixed(2)}</td>
          <td>${e.type}</td>
        </tr>
      `;
        });
        return `
      <fieldset>
        <legend><b>// SCREEN 3: EXPENSES & ACCOUNTING LEDGER (USD $ / EUR € ONLY)</b></legend>

        <details class="app-acc" open>
          <summary>► [SECTION 3.1] FINANCIAL OVERVIEW & BALANCES</summary>
          <table border="1" width="100%" cellpadding="6">
            <tr>
              <td width="25%"><b>TOTAL OPEX:</b> ~$315.00 – $345.00 / mo (~€291.00 – €319.00 / mo)</td>
              <td width="25%"><b>ALWAYS FREE SAVINGS:</b> $0.00 / mo (€0.00 / mo)</td>
              <td width="25%"><b>LOAD BALANCER SAVINGS:</b> ~$28.50 – $35.00 / mo saved</td>
              <td width="25%"><b>GOOGLE AI PRO RATE:</b> $20.00 / mo (€18.50 / mo)</td>
            </tr>
          </table>
        </details>

        <br>

        <details class="app-acc" open>
          <summary>► [SECTION 3.2] GCP INFRASTRUCTURE COST BREAKDOWN</summary>
          <table border="1" width="100%" cellpadding="6">
            <thead>
              <tr>
                <th>COMPONENT</th>
                <th>RESOURCE TYPE</th>
                <th>PRICING TIER</th>
                <th>HOURLY COST</th>
                <th>MONTHLY COST (USD $)</th>
                <th>MONTHLY COST (EUR €)</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>evaline-micro-vm</td>
                <td>Compute Engine e2-micro (Iowa)</td>
                <td>GCP Always Free Tier</td>
                <td>$0.0000 / hr</td>
                <td>$0.00 / mo</td>
                <td>€0.00 / mo</td>
                <td>[FREE TIER] ACTIVE</td>
              </tr>
              <tr>
                <td>evaline boot disk</td>
                <td>Standard HDD 20 GB</td>
                <td>GCP Always Free (up to 30GB)</td>
                <td>$0.0000 / hr</td>
                <td>$0.00 / mo</td>
                <td>€0.00 / mo</td>
                <td>[FREE TIER] ACTIVE</td>
              </tr>
              <tr>
                <td>evabot-agent-vm</td>
                <td>c3-standard-8 (Frankfurt)</td>
                <td>On-Demand Compute Tier</td>
                <td>~$0.42 / hr</td>
                <td>~$300.00 / mo</td>
                <td>~€277.00 / mo</td>
                <td>[ACTIVE] PAID ON-DEMAND</td>
              </tr>
              <tr>
                <td>evabot-agent-data</td>
                <td>50 GB NVMe Storage Disk</td>
                <td>Zonal SSD Storage Tier</td>
                <td>~$0.007 / hr</td>
                <td>~$5.00 / mo</td>
                <td>~€4.60 / mo</td>
                <td>[ACTIVE] PAID ON-DEMAND</td>
              </tr>
              <tr>
                <td>Google AI Pro</td>
                <td>Gemini 2.0 / 1.5 Pro Subscription</td>
                <td>Monthly Fixed Rate</td>
                <td>N/A</td>
                <td>$20.00 / mo</td>
                <td>€18.50 / mo</td>
                <td>[ACTIVE] SUBSCRIPTION</td>
              </tr>
            </tbody>
          </table>
        </details>

        <br>

        <details class="app-acc" open>
          <summary>► [SECTION 3.3] P&L TRANSACTION LEDGER & ADD ENTRY FORM</summary>
          <table border="1" width="100%" cellpadding="6" id="accounting-ledger-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>CATEGORY</th>
                <th>DESCRIPTION</th>
                <th>AMOUNT (USD $)</th>
                <th>AMOUNT (EUR €)</th>
                <th>TYPE</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <br>
          <fieldset>
            <legend><b>ADD NEW LEDGER TRANSACTION ENTRY</b></legend>
            <form onsubmit="window.evaApp.addAccountingEntry(event)">
              <label for="acc-date">DATE:</label>
              <input type="date" id="acc-date" required>
              &nbsp;
              <label for="acc-category">CATEGORY:</label>
              <select id="acc-category">
                <option value="Infrastructure">Infrastructure</option>
                <option value="Software / AI">Software / AI</option>
                <option value="Services / Consulting">Services / Consulting</option>
                <option value="Operations">Operations</option>
              </select>
              &nbsp;
              <label for="acc-desc">DESCRIPTION:</label>
              <input type="text" id="acc-desc" required placeholder="Description...">
              &nbsp;
              <label for="acc-amount">AMOUNT (USD $):</label>
              <input type="number" step="0.01" id="acc-amount" required placeholder="100.00">
              &nbsp;
              <label for="acc-type">TYPE:</label>
              <select id="acc-type">
                <option value="EXPENSE">EXPENSE</option>
                <option value="INCOME">INCOME</option>
              </select>
              &nbsp;
              <button type="submit">ADD RECORD</button>
            </form>
          </fieldset>
        </details>
      </fieldset>
    `;
    }
}
