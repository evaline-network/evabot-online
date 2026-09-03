import { IEvaBotPlugin } from '../plugins/IEvaBotPlugin.js';
import { Language } from '../core/Types.js';

export class TelemetryPlugin implements IEvaBotPlugin {
  public id = 'telemetry';
  public name = 'Server Telemetry Plugin';
  public version = '1.0.0';
  public screenId = 'tab-telemetry';
  public tabTitle: Record<Language, string> = {
    en: '[2] TELEMETRY',
    uk: '[2] ТЕЛЕМЕТРІЯ',
    ru: '[2] ТЕЛЕМЕТРИЯ'
  };

  public init(manager: any): void {}

  public render(lang: Language): string {
    return `
      <fieldset>
        <legend><b>// SCREEN 2: PHYSICAL & VIRTUAL SERVER TELEMETRY</b></legend>
        
        <details class="app-acc" open>
          <summary>► [NODE 1] PRIMARY COMPUTE NODE: evabot-agent-vm (FRANKFURT c3-standard-8)</summary>
          <p><b>LOCATION:</b> Frankfurt europe-west3-a | <b>IP:</b> 34.179.253.183 (VPC 10.156.0.2)</p>
          <table border="1" width="100%" cellpadding="6">
            <thead>
              <tr>
                <th>RESOURCE</th>
                <th>HARDWARE SPECIFICATION</th>
                <th>CURRENT LOAD</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CPU Cores</td>
                <td>8 vCPU (Intel Sapphire Rapids @ 3.40GHz)</td>
                <td>3.2% load (0.28, 0.35, 0.42)</td>
                <td>[ONLINE] HEALTHY</td>
              </tr>
              <tr>
                <td>System Memory</td>
                <td>32 GB DDR5 RAM</td>
                <td>5.8 GB / 32 GB (18.1% used)</td>
                <td>[ONLINE] HEALTHY</td>
              </tr>
              <tr>
                <td>Persistent Storage</td>
                <td>50 GB NVMe SSD (/mnt/disks/evabot-agent-data)</td>
                <td>12.4 GB / 50 GB (24.8% used)</td>
                <td>[ONLINE] HEALTHY</td>
              </tr>
            </tbody>
          </table>
        </details>

        <br>

        <details class="app-acc" open>
          <summary>► [NODE 2] EDGE SENTINEL NODE: evaline-micro-vm (IOWA e2-micro ALWAYS FREE)</summary>
          <p><b>LOCATION:</b> Iowa us-central1-a | <b>IP:</b> 136.114.26.252 (VPC 10.128.0.2)</p>
          <table border="1" width="100%" cellpadding="6">
            <thead>
              <tr>
                <th>RESOURCE</th>
                <th>HARDWARE SPECIFICATION</th>
                <th>CURRENT LOAD</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CPU Cores</td>
                <td>2 vCPU burstable (AMD EPYC / Intel Xeon)</td>
                <td>1.4% load (0.08, 0.12, 0.15)</td>
                <td>[ONLINE] ALWAYS FREE ($0/mo)</td>
              </tr>
              <tr>
                <td>System Memory</td>
                <td>1 GB RAM</td>
                <td>412 MB / 1 GB (41.2% used)</td>
                <td>[ONLINE] HEALTHY</td>
              </tr>
              <tr>
                <td>Boot Disk</td>
                <td>20 GB Standard HDD (Debian 13 Trixie)</td>
                <td>4.8 GB / 20 GB (24.0% used)</td>
                <td>[ONLINE] HEALTHY</td>
              </tr>
            </tbody>
          </table>
        </details>
      </fieldset>
    `;
  }
}
