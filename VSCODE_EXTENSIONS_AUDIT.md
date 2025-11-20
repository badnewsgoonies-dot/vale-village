# VS Code Extensions Audit - Vale Chronicles
*Generated: November 19, 2025*

## Summary
- **Total Extensions:** 77
- **Essential (Keep):** 16
- **Review (Azure/Docker):** 9
- **Safe to Remove:** 52

---

## ✅ KEEP - Essential for Development

### Core Development
```
dbaeumer.vscode-eslint
esbenp.prettier-vscode
editorconfig.editorconfig
ms-vscode.powershell
```

### TypeScript/JavaScript
```
christian-kohler.npm-intellisense
wix.vscode-import-cost
```

### Git & GitHub
```
eamodio.gitlens
mhutchie.git-graph
github.vscode-pull-request-github
github.copilot
github.copilot-chat
```

### Testing
```
hbenl.vscode-test-explorer
```

### Documentation
```
davidanson.vscode-markdownlint
```

### Utilities
```
usernamehw.errorlens
wayou.vscode-todo-highlight
```

---

## ⚠️ REVIEW - Depends on Your Workflow

### Azure (Keep if deploying to Azure)
```
ms-azuretools.vscode-azure-github-copilot
ms-azuretools.azure-dev
ms-azuretools.vscode-azure-mcp-server
ms-azuretools.vscode-cosmosdb  # YOU HAVE COSMOSDB INSTRUCTIONS!
```

### Containers (Keep if using Docker)
```
ms-azuretools.vscode-docker
docker.docker
ms-azuretools.vscode-containers
```

### Browser DevTools (Pick ONE)
```
ms-edgedevtools.vscode-edge-devtools  # OR
firefox-devtools.vscode-firefox-debug
```

---

## ❌ REMOVE - Not Needed for This Project

### Python (No Python in project)
```bash
code --uninstall-extension ms-python.python
code --uninstall-extension ms-python.debugpy
code --uninstall-extension ms-python.vscode-pylance
code --uninstall-extension ms-python.vscode-python-envs
```

### Other Languages
```bash
code --uninstall-extension bmewburn.vscode-intelephense-client  # PHP
code --uninstall-extension xdebug.php-debug                     # PHP
code --uninstall-extension jjkim.gdscript                       # Godot
code --uninstall-extension dotjoshjohnson.xml                   # XML
```

### Redundant AI Tools
```bash
code --uninstall-extension openai.chatgpt
code --uninstall-extension anthropic.claude-code
code --uninstall-extension ms-windows-ai-studio.windows-ai-studio
code --uninstall-extension teamsdevapp.vscode-ai-foundry
```

### Remote Development (Unless actively using)
```bash
code --uninstall-extension ms-vscode-remote.remote-containers
code --uninstall-extension ms-vscode-remote.remote-ssh
code --uninstall-extension ms-vscode-remote.remote-ssh-edit
code --uninstall-extension ms-vscode-remote.remote-wsl
code --uninstall-extension ms-vscode-remote.remote-repositories
code --uninstall-extension ms-vscode.remote-explorer
code --uninstall-extension ms-vscode.remote-server
code --uninstall-extension github.remotehub
code --uninstall-extension github.codespaces
code --uninstall-extension ms-vscode.azure-repos
```

### Unused Azure Services
```bash
code --uninstall-extension ms-azuretools.vscode-azureappservice
code --uninstall-extension ms-azuretools.vscode-azurecontainerapps
code --uninstall-extension ms-azuretools.vscode-azurefunctions
code --uninstall-extension ms-azuretools.vscode-azureresourcegroups
code --uninstall-extension ms-azuretools.vscode-azurestaticwebapps
code --uninstall-extension ms-azuretools.vscode-azurestorage
code --uninstall-extension ms-azuretools.vscode-azurevirtualmachines
code --uninstall-extension ms-kubernetes-tools.vscode-kubernetes-tools
code --uninstall-extension ms-azure-load-testing.microsoft-testing
```

### Miscellaneous
```bash
code --uninstall-extension artdiniz.strike-vscode
code --uninstall-extension codespaces-contrib.codeswing
code --uninstall-extension codexbuild.codex-build
code --uninstall-extension formulahendry.code-runner
code --uninstall-extension frenco.vscode-vercel
code --uninstall-extension github.vscode-github-actions
code --uninstall-extension hediet.vscode-drawio
code --uninstall-extension mechatroner.rainbow-csv
code --uninstall-extension ms-vscode.test-adapter-converter
code --uninstall-extension ms-vscode.vscode-github-issue-notebooks
code --uninstall-extension ms-vscode.vscode-node-azure-pack
code --uninstall-extension ms-vscode.vscode-speech
code --uninstall-extension redhat.vscode-yaml
code --uninstall-extension ritwickdey.liveserver  # Using Vite instead
code --uninstall-extension tyriar.luna-paint
```

### Optional
```bash
code --uninstall-extension vscodevim.vim  # Keep if you use Vim keybindings
```

---

## 🚀 Quick Cleanup Script

Run this to remove all non-essential extensions at once:

```bash
#!/bin/bash
# Save as: cleanup-extensions.sh

# Python
code --uninstall-extension ms-python.python
code --uninstall-extension ms-python.debugpy
code --uninstall-extension ms-python.vscode-pylance
code --uninstall-extension ms-python.vscode-python-envs

# PHP
code --uninstall-extension bmewburn.vscode-intelephense-client
code --uninstall-extension xdebug.php-debug

# Other Languages
code --uninstall-extension jjkim.gdscript
code --uninstall-extension dotjoshjohnson.xml

# Redundant AI
code --uninstall-extension openai.chatgpt
code --uninstall-extension anthropic.claude-code
code --uninstall-extension ms-windows-ai-studio.windows-ai-studio
code --uninstall-extension teamsdevapp.vscode-ai-foundry

# Remote Dev
code --uninstall-extension ms-vscode-remote.remote-containers
code --uninstall-extension ms-vscode-remote.remote-ssh
code --uninstall-extension ms-vscode-remote.remote-ssh-edit
code --uninstall-extension ms-vscode-remote.remote-wsl
code --uninstall-extension ms-vscode-remote.remote-repositories
code --uninstall-extension ms-vscode.remote-explorer
code --uninstall-extension ms-vscode.remote-server
code --uninstall-extension github.remotehub
code --uninstall-extension github.codespaces
code --uninstall-extension ms-vscode.azure-repos

# Unused Azure
code --uninstall-extension ms-azuretools.vscode-azureappservice
code --uninstall-extension ms-azuretools.vscode-azurecontainerapps
code --uninstall-extension ms-azuretools.vscode-azurefunctions
code --uninstall-extension ms-azuretools.vscode-azureresourcegroups
code --uninstall-extension ms-azuretools.vscode-azurestaticwebapps
code --uninstall-extension ms-azuretools.vscode-azurestorage
code --uninstall-extension ms-azuretools.vscode-azurevirtualmachines
code --uninstall-extension ms-kubernetes-tools.vscode-kubernetes-tools
code --uninstall-extension ms-azure-load-testing.microsoft-testing

# Misc
code --uninstall-extension artdiniz.strike-vscode
code --uninstall-extension codespaces-contrib.codeswing
code --uninstall-extension codexbuild.codex-build
code --uninstall-extension formulahendry.code-runner
code --uninstall-extension frenco.vscode-vercel
code --uninstall-extension github.vscode-github-actions
code --uninstall-extension hediet.vscode-drawio
code --uninstall-extension mechatroner.rainbow-csv
code --uninstall-extension ms-vscode.test-adapter-converter
code --uninstall-extension ms-vscode.vscode-github-issue-notebooks
code --uninstall-extension ms-vscode.vscode-node-azure-pack
code --uninstall-extension ms-vscode.vscode-speech
code --uninstall-extension redhat.vscode-yaml
code --uninstall-extension ritwickdey.liveserver
code --uninstall-extension tyriar.luna-paint

echo "✅ Cleanup complete!"
```

---

## 💡 Notes

1. **CosmosDB Extension**: You have Azure CosmosDB instructions in your workspace, so keep the CosmosDB extension if you're using it.

2. **Docker/Containers**: Only keep if you're containerizing your app.

3. **Azure Tools**: Since you have Azure-related instruction files, you might be deploying to Azure. Keep the core Azure tools but remove service-specific ones you're not using.

4. **Browser DevTools**: Pick Edge OR Firefox tools, not both.

5. **Performance Impact**: Removing 50+ extensions will significantly improve VS Code startup time and reduce memory usage.

---

## 📊 Your Project Tech Stack

**Confirmed from project:**
- TypeScript ✅
- React ✅
- Vite ✅
- Vitest (Testing) ✅
- Playwright (E2E) ✅
- ESLint ✅
- Zod (Validation) ✅
- Zustand (State) ✅
- Framer Motion (Animation) ✅

**NOT using:**
- Python ❌
- PHP ❌
- Godot ❌
- XML ❌
- Remote development ❌
- Kubernetes ❌
