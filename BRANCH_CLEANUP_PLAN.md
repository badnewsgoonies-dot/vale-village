# Branch Cleanup Plan

## Branches to Delete (Already Merged)
```bash
git push origin --delete fix-battle-end-Zqd4i
```

## Stale AI Branches (No recent activity, should review and delete)

### Claude Branches (14+ days old)
```bash
# These branches are from early November and appear abandoned:
git push origin --delete claude/add-demo-mode-011CUtmy8Mbz3C7Q37qL3uJV
git push origin --delete claude/fix-game-bugs-011CUueR1Yd6Hk5LFobwzVtw  
git push origin --delete claude/vale-chronicles-system-audit-011CUu68TnF6rncoAbr4dUs9
git push origin --delete claude/check-merge-errors-011CUvwJs9fgmWdpv8MDbYQa
git push origin --delete claude/fix-camera-system-white-screens-011CUw658ix2V3LV77xmxCPA
git push origin --delete claude/fix-dialogue-screen-hooks-011CUwCLa646uxLcARYkNV8i
git push origin --delete claude/fix-battle-screen-flashing-011CUwFGfaBuoCfcQu5SrWcR
git push origin --delete claude/audit-sprites-directories-011CUwofdbVYrwD6RdcBBJeC
git push origin --delete claude/unlock-all-abilities-011CUwpYvrErwAF9WmKKXFgo
```

### Cursor Branches (10+ days old)
```bash
git push origin --delete cursor/fetch-and-process-cursor-agent-data-0c57
git push origin --delete cursor/troubleshoot-vitest-no-test-suite-found-2662
```

## Branches to Keep (Have unmerged commits)
- `claude/document-game-mechanics-01K8iEwM1vNj3nCzkoeY7bpS` - Has 1 commit about game mechanics guide
- `claude/phase-3-ability-djinn-wiring-01NrvXr6zytJeFyLXzTxrD7w` - May have important ability system work
- `claude/vale-chronicles-battle-ui-01Vz5EB8zK5Q8xU5fpJjsvZE` - Battle UI improvements
- `claude/remove-flee-polish-battle-ui-013NzsN8HatQL6NSK7Qt4JrY` - Battle polish
- `claude/save-load-system-011CV65Fszedtuw9M91nCGyi` - Save system implementation

## Recommended Actions

1. **Review branches marked "to keep"** - Check if their changes are still needed
2. **Delete all merged branches** immediately
3. **Clean up AI-generated branch names** going forward
4. **Use semantic branch names** like:
   - `feature/battle-queue-system`
   - `fix/sprite-loading-error`
   - `docs/gameplay-guide`

## Command to see branch activity
```bash
# See last commit date for all remote branches
git for-each-ref --sort=committerdate refs/remotes --format='%(committerdate:short) %(refname:short)'
```