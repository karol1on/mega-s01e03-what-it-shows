<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // One row per problem a merged ticket really holds. `issues`: cause → its issue number in `repo`.
  let { ticket, repo, issues }: { ticket: number; repo: string; issues: Record<string, number> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  // Counted the desk's way: by tenant and channel. Reports the desk read as a one-day move stay
  // counted where they are filed, and get their own row as `shift`.
  const groups = $derived(groupByCause(merged, tenantOf));
  const shift = $derived(groups.reduce((n, g) => n + readAs(g, notes.oneDayMove), 0));
  const tags = (g: { taggedAs: Record<string, number> }) =>
    Object.entries(g.taggedAs)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, n]) => `${tag} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length + (shift ? 1 : 0)}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>intake tagged as</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td class="tags">{tags(g)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if issues[g.cause]}<a href="https://github.com/{repo}/issues/{issues[g.cause]}">#{issues[g.cause]}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
    {#if shift}
      <tr>
        <td><code>shift</code></td>
        <td>{shift}</td>
        <td class="tags">read by the desk as a one-day move; also counted under <code>parser</code></td>
        <td></td>
        <td></td>
        <td>{#if issues.shift}<a href="https://github.com/{repo}/issues/{issues.shift}">#{issues.shift}</a>{:else}none yet{/if}</td>
      </tr>
    {/if}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
</style>
