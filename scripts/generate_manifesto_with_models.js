const fs = require('fs');
const path = require('path');

const models = JSON.parse(fs.readFileSync('/home/evabot/models_catalog.json', 'utf8'));

// Format context window nicely
function formatContext(tokens) {
  if (tokens >= 2000000) return '2M токенов (~1.5 млн слов)';
  if (tokens >= 1000000) return '1M токенов (~750k слов)';
  if (tokens >= 500000) return '512k токенов';
  if (tokens >= 200000) return '200k токенов';
  if (tokens >= 128000) return '128k токенов';
  if (tokens >= 64000) return '64k токенов';
  if (tokens >= 32000) return '32k токенов';
  return `${tokens} токенов`;
}

// Map provider color scheme
function getProviderClass(provider) {
  const p = (provider || '').toLowerCase();
  if (p.includes('google')) return 'provider-google';
  if (p.includes('anthropic')) return 'provider-anthropic';
  if (p.includes('deepseek')) return 'provider-deepseek';
  if (p.includes('meta')) return 'provider-meta';
  if (p.includes('mistral')) return 'provider-mistral';
  if (p.includes('openai')) return 'provider-openai';
  if (p.includes('omniroute')) return 'provider-omniroute';
  return 'provider-default';
}

console.log(`Loaded ${models.length} models for manifesto.`);
