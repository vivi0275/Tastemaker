# Bench interne — 3 artistes de référence

Tests API automatisés (session dev) pour valider le dig crate, filtres et reposts tierces avant tests utilisateurs réels.

Date : 2026-06-24

## Méthode

- Service : [`server/services/soundcloud.js`](../server/services/soundcloud.js)
- Résolution manuelle du profil SC quand statut `ambiguous`

## Résultats

| Artiste recherché | Statut | Profil résolu | Total | Likes | Reposts | Reposts tierces |
|-------------------|--------|---------------|-------|-------|---------|-----------------|
| Pegassi | ambiguous → résolu (id 28594890) | Pegassi | 86 | 50 | 36 | 36 |
| Fred again.. | ambiguous | — | — | — | — | — |
| Kaytranada | ambiguous | — | — | — | — | — |

### Observations Pegassi

- **P1 validé** : 86 signaux agrégés vs scroll profil SC.
- **P6 validé** : 36/36 reposts détectés comme tierces (`thirdPartyDiscovery`) — highlight UI pertinent.
- **Gap** : noms ambigus fréquents sur artistes mainstream → le picker SC reste critique (prévoir dans tests utilisateurs).

## Checklist UX (à valider manuellement en UI)

- [ ] Filtre Likes affiche ~50 pistes pour Pegassi
- [ ] Filtre Reposts affiche ~36 pistes
- [ ] Cartes « Discovery repost » visibles en orange
- [ ] Preview unique (une seule à la fois)
- [ ] Dig deeper → % match visible → Dig their crate

## Prochaine étape

Compléter avec 5 testeurs réels via [`user-test-protocol.md`](./user-test-protocol.md).
