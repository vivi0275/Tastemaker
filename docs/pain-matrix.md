# Matrice Pain Points × Recommandations × Faisabilité

Référence produit pour l'ICP DJs & producteurs. Statut mis à jour à l'implémentation du plan ICP.

| ID | Pain point | Impact ICP | Recommandation | Faisabilité | Statut |
|----|------------|------------|----------------|-------------|--------|
| P1 | SC enterre le signal de goût (likes/reposts mal exposés) | Critique | Agrégation « dig crate » + filtres Likes/Reposts/Tous | Faisable | **Livré** |
| P1b | Tri chronologique des likes | Moyen | `likedAt` si API SC expose `created_at` | À vérifier | **Partiel** — champ ajouté si dispo |
| P2 | Confusion catalogue Spotify vs goût perso | Élevé | Sections séparées + copy « Not their private likes » | Faisable | **Livré** |
| P2b | Morceaux playlists Spotify (403 dev) | Moyen | Spotify Extended Quota ou retrait promesse | Phase 2 | En attente |
| P3 | Tab fatigue (SC + Spotify + Last.fm) | Élevé | Hub unifié + trail | Fait | **Livré** |
| P3b | Trails partageables URL | Moyen | `?q=&trail=` stateless | Phase 2 | Planifié |
| P4 | Pré-écoute avant investissement temps | Critique | Preview 30–60 s + lecteur unique | Faisable | **Livré** |
| P5 | Rabbit hole vers prochain artiste | Élevé | % match visible + CTA « Dig their crate » | Faisable | **Livré** |
| P6 | Signal gros → petit (repost découverte) | Moyen-élevé | Filtre Reposts + highlight tierce | Faisable | **Livré** |
| P7 | Sauvegarde post-dig | Moyen | Export « Copy dig list » | Phase 2 | Planifié |
| P8 | BPM / key | Moyen (DJs club) | MusicBrainz / tags SC | Phase 3 | Planifié |
| P9 | Mixcloud, Bandcamp, promos | Variable | Mixcloud API ; reste hors scope | Phase 3 / Non | Planifié |

## Validation utilisateur

Utiliser [`user-test-protocol.md`](./user-test-protocol.md) avec 5 DJs/producteurs. Colonnes à remplir après chaque session :

| Testeur | Segment | Artistes testés | Pain confirmé | Gap noté | Verdict |
|---------|---------|-----------------|---------------|----------|---------|
| _à remplir_ | DJ / Prod | 3 noms | P1, P4… | | |

### Questions de validation (CPO)

1. *Raconte ta dernière session de digging — où as-tu abandonné ?*
2. *Qu'est-ce qui te ferait dire « très déçu » si Tastemaker disparaissait ?*
3. *Repost ou like — lequel tu chasses en premier ?*
4. *Après avoir trouvé un son, qu'est-ce que tu fais dans les 5 min ?*

## Métriques PostHog

Voir [`analytics-review.md`](./analytics-review.md) pour le snapshot des métriques North Star (14j : 0 events custom, 1 pageview — clés prod à vérifier).

## Bench interne

Voir [`user-test-bench-results.md`](./user-test-bench-results.md) — Pegassi : 86 tracks, 36 reposts tierces détectés.
