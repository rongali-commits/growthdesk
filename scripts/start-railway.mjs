import { writeFileSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';

// Wrangler reads bindings from the directory containing its configuration.
// Only the declared application values are written; nothing is logged.
const keys = ['GROWTHDESK_MODE', 'GROWTHDESK_ADMIN_KEY', 'GROWTHDESK_ORIGIN'];
const values = keys.filter(key => process.env[key]).map(key => `${key}=${JSON.stringify(process.env[key])}`).join('\n');
writeFileSync('dist/server/.dev.vars', values + '\n', { mode: 0o600 });
mkdirSync('/app/runtime', { recursive: true });
const child = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'dev', '--config', 'dist/server/wrangler.json', '--ip', '0.0.0.0', '--port', process.env.PORT || '3000', '--persist-to', '/app/runtime', '--log-level', 'error', '--show-interactive-dev-session=false'], { stdio: 'inherit' });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
