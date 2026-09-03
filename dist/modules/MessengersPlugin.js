export class MessengersPlugin {
    id = 'modules';
    name = 'Omnichannel Messengers Plugin';
    version = '1.0.0';
    screenId = 'tab-modules';
    tabTitle = {
        en: '[5] MESSENGERS',
        uk: '[5] МЕСЕНДЖЕРИ',
        ru: '[5] МЕССЕНДЖЕРЫ'
    };
    init(manager) { }
    render(lang) {
        return `
      <fieldset>
        <legend><b>// SCREEN 5: OMNICHANNEL MESSENGER GATEWAYS</b></legend>
        <table border="1" width="100%" cellpadding="6">
          <thead>
            <tr>
              <th>PLATFORM</th>
              <th>GATEWAY PROTOCOL</th>
              <th>WEBHOOK STATUS</th>
              <th>ACTIVE BOT ACCOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Telegram</b></td>
              <td>HTTPS Webhook / Bot API 7.0</td>
              <td>[ONLINE] https://evabot.online/api/telegram</td>
              <td>@evabot_online_bot</td>
            </tr>
            <tr>
              <td><b>WhatsApp</b></td>
              <td>Cloud API / Meta Business API</td>
              <td>[ONLINE] https://evabot.online/api/whatsapp</td>
              <td>+1 (555) EVABOT-AI</td>
            </tr>
            <tr>
              <td><b>Viber</b></td>
              <td>Viber REST Bot Gateway API</td>
              <td>[ONLINE] https://evabot.online/api/viber</td>
              <td>EvaBot Official</td>
            </tr>
            <tr>
              <td><b>Facebook Messenger</b></td>
              <td>Meta Graph API v20.0 Webhook</td>
              <td>[ONLINE] https://evabot.online/api/facebook</td>
              <td>EvaBot Ecosystem Page</td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    `;
    }
}
