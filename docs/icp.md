# ICP — DJs & Producteurs

Document de référence pour le positionnement produit de **Tastemaker**.

## Persona primaire

**Nom** : Lea, 26 ans — DJ club & productrice électro  
**Contexte** : Prépare des sets et des tracks en s'inspirant d'artistes de référence (scène locale + internationale). Passe 2–4 h/semaine à « diguer » de nouveaux sons.

**Citation** : *« Je connais l'artiste X. Je veux voir ce qu'il écoute vraiment sur SoundCloud, préécouter vite, et enchaîner vers des artistes connexes sans ouvrir six onglets. »*

### Jobs-to-be-done

| Job | Situation | Résultat attendu |
|-----|-----------|------------------|
| **Diguer le goût réel** | Avant un set ou une session prod | Liste de likes/reposts SC d'un artiste de référence, triable |
| **Pré-écouter** | Avant d'ouvrir SC ou d'acheter | 30–60 s de preview in-app, sans quitter le flow |
| **Rabbit hole** | Après avoir trouvé un bon signal | Enchaîner artiste → artiste via similarité + leur crate SC |
| **Éviter la confusion** | Quand Spotify affiche le catalogue | Comprendre que ce n'est pas leurs likes privés |

### Comportement de sourcing

1. Choisir un artiste de référence (set entendu, repost repéré, reco d'un pote DJ)
2. Ouvrir son profil SC → scroller likes/reposts (lent, mal organisé)
3. Pré-écouter les pistes prometteuses
4. Noter / sauver les pépites (SC playlist, Beatport, téléchargement promo)
5. Chercher des artistes connexes et recommencer

**Outils actuels** : SoundCloud, Spotify (référence), Beatport/Bandcamp (achat), promos email/Dropbox, parfois Mixcloud, 1001Tracklists (sets live).

---

## Segment secondaire

**Marc, 24 ans — producteur hip-hop / trap**  
Même flow, angle « références d'écoute » plutôt que « préparation de set ». Moins sensible au BPM/key en V1, plus aux reposts (signal social fort).

---

## Anti-personas (hors scope V1)

| Segment | Pourquoi hors scope |
|---------|---------------------|
| **Fan passif** | Veut écouter, pas diguer — Spotify/Apple suffisent |
| **DJ mainstream / wedding** | Sourcing via charts et pools, pas SC likes |
| **A&R / label** | Veille multi-artistes, export, alertes → nécessite comptes + DB |
| **Acheteur Beatport-only** | Workflow achat, pas découverte de goût artiste |

---

## Fit produit

| Besoin ICP | Tastemaker aujourd'hui |
|------------|------------------------|
| Likes + reposts SC agrégés | Oui — « Their dig crate » |
| Filtre Likes / Reposts | Oui |
| Highlight reposts tierces | Oui |
| Preview 30–60 s | Oui |
| Rabbit hole multi-artistes | Oui — trail + reposts SC + Last.fm |
| Sauvegarde session | Oui — « My dig session » (localStorage) |
| Sets YouTube → tracklist SC | Oui — « Live sets » (bonus) |
| Spotify goût privé | Non — et ne pas promettre |
| Promos privées | Non |
| Import Rekordbox | Non |

---

## North Star

**`discovery_session_qualified`** — première preview SC ou clic externe après une recherche, par session navigateur.

Indicateurs secondaires : `track_saved`, `trail_depth` ≥ 2, `preview_started` vs `outbound_click` par signal (`liked` / `reposted` / `from_mix`).

---

## Value proposition

**EN** : *Dig your reference artists' real SoundCloud crate. Preview in 60s. Save gems. Rabbit-hole deeper.*

**FR** : *Creusez le dig crate SoundCloud de vos artistes de référence. Préécoutez en 60 secondes. Sauvez vos pépites. Enchaînez vers les artistes connexes.*

**Sous-titre** : *Likes et reposts réels — pas le catalogue Spotify. Sets YouTube en bonus.*
