---
trigger: always_on
---
# Remote Execution Policy for EvaBot Cluster

All build, test, lint, and runtime commands for EvaBot must run exclusively on the remote GCP compute node `evabot-agent-vm` (`100.66.98.4`) under the `evabot` user.

## Execution Routing Rules
1. **Never run builds locally**: Do not run `npm run build`, `tsc`, or `esbuild` on the local laptop or on `evaline-micro-vm`. Run:
   ```bash
   ssh evabot-agent-vm "cd /var/www/evabot-backend && npm run build"
   ```
2. **Never run tests locally**: Run test suites on the compute node:
   ```bash
   ssh evabot-agent-vm "cd /var/www/evabot-backend && npm test"
   ```
3. **Backend Service Control**:
   ```bash
   ssh evabot-agent-vm "sudo systemctl restart evabot-brain.service"
   ```
4. **Deploy Static Frontend to Micro-Server**:
   Trigger the server-to-server sync:
   ```bash
   ssh evabot-agent-vm "cd /var/www/evabot-backend && ./deploy-sync.sh"
   ```
