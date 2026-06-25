# Revue analytics PostHog — Tastemaker

Période analysée : **14 derniers jours** (2026-06-10 → 2026-06-24)  
Projet : posthog-orange-clock (id 334058)

## North Star & événements produit

| Événement | Total 14j | Interprétation |
|-----------|-----------|----------------|
| `discovery_session_qualified` | **0** | North Star — aucune session qualifiée |
| `search_completed` | **0** | Pas de recherches trackées |
| `preview_started` | **0** | Pas de previews |
| `outbound_click` | **0** | Pas de clics externes |
| `trail_extended` | **0** | Pas de rabbit hole |

| Événement | Total 30j |
|-----------|-----------|
| `$pageview` | **1** |

## Conclusions

1. **Instrumentation en place** dans [`client/src/analytics.js`](../client/src/analytics.js) mais **pas encore de trafic produit significatif** sur les events custom.
2. La North Star ne peut pas être interprétée tant que `VITE_POSTHOG_KEY` n’est pas configurée en prod (Vercel) ou que les utilisateurs n’ont pas encore utilisé l’app déployée.
3. **Ratio cible** (quand données disponibles) :
   - `discovery_session_qualified` / `search_completed` ≥ **40 %** = digging qui accroche
   - `trail_extended` avec `depth` ≥ 2 = rabbit hole réussi
   - `preview_started` vs `outbound_click` par `signal` (`liked` vs `reposted`)

## Actions recommandées

1. Vérifier `VITE_POSTHOG_KEY` et `VITE_POSTHOG_HOST` dans les **Environment Variables Vercel**.
2. Redéployer après ajout des clés.
3. Créer un dashboard PostHog avec :
   - North Star (`discovery_session_qualified`) — tendance journalière
   - Funnel : `search_completed` → `preview_started` OR `outbound_click`
   - Breakdown `preview_started` par propriété `signal`
   - Médiane `depth` sur `trail_extended`
4. Revoir ce document après **2 semaines** de trafic réel post-déploiement analytics.

## Liens

- [Data management — Events](https://us.posthog.com/project/334058/data-management/events)
- [Insights — New trend](https://us.posthog.com/project/334058/insights/new)
