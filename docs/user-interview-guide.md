# Guide d'interviews utilisateurs — Tastemaker MVP

**Objectif** : valider le wedge « SC dig crate » avec 5 DJs/producteurs electro (persona Lea, voir [icp.md](./icp.md)).

**Durée** : 30–45 min (dont 10–15 min d'observation en silence pendant qu'ils diguent).

---

## Recrutement

- DJs club / producteurs electro, 2–4 h/semaine de digging
- Utilisent SoundCloud activement (likes, reposts, sets YouTube)
- Pas besoin qu'ils aient déjà utilisé Tastemaker — idéal : 2 nouveaux + 3 après 1 session produit

**Script d'invitation** :
> « Je construis un outil pour diguer le goût réel des artistes de référence sur SoundCloud — likes, reposts, preview 60s. J'aimerais observer une session de digging de 30 min et poser quelques questions. Pas de vente, juste apprendre. »

---

## Déroulé

### 1. Contexte (5 min)

1. Décris ta dernière session de digging — par où tu as commencé ?
2. Quel artiste de référence as-tu utilisé récemment ? Pourquoi lui ?
3. Quels outils ouvres-tu en parallèle ? (SC, YouTube, Beatport, 1001TL, notes…)
4. Qu'est-ce qui te fait perdre le plus de temps ?

### 2. Observation silencieuse (10–15 min)

Demande-leur de chercher **un artiste de leur choix** sur Tastemaker (ou Pegassi si pas d'idée).

**Observer sans intervenir** :

| Signal | Noter |
|--------|-------|
| Premier clic | SC crate, YouTube, Spotify, Last.fm ? |
| Preview | Utilisent-ils la preview in-app ? |
| Save | Cherchent-ils un moyen de sauver ? |
| Reposts tiers | Remarquent-ils les « Discovery repost » ? |
| Rabbit hole | Cliquent-ils « Dig their crate » ? |
| Friction | Confusion Spotify ? Section repliée trouvée ? |

### 3. Démo guidée si besoin (5 min)

Montrer uniquement si bloqués : filtre Discoveries, session crate, live sets repliés.

### 4. Test PMF — Sean Ellis (2 min)

> « Si Tastemaker disparaissait demain, à quel point seriez-vous déçu(e) ? »

- **Très déçu** → core user potentiel
- **Un peu déçu** → feature utile mais pas essentielle
- **Pas déçu** → hors ICP ou produit pas encore au bon endroit

Seuil PMF early-stage : **≥ 40 % « Très déçu »** sur les utilisateurs ayant fait une session qualifiée.

### 5. Clôture (5 min)

1. Qu'as-tu trouvé que tu n'aurais pas trouvé autrement ?
2. Qu'est-ce qui manque pour remplacer ton workflow actuel ?
3. Paierais-tu pour cet outil ? Combien / quel modèle ?
4. Recommanderais-tu à un pote DJ ?

---

## Grille de synthèse (par interview)

```
Interview #___  Date: ___
Nom / pseudo:
Profil: DJ club / producteur / les deux
Artiste testé:

Sean Ellis: [ ] Très déçu  [ ] Un peu  [ ] Pas déçu

Workflow observé:
- Wedge utilisé en premier:
- Preview utilisée: Oui / Non
- Tracks sauvées: ___
- Trail depth: ___

Top friction (1-3):
1.
2.
3.

Citation verbatim utile:

Action produit suggérée:
```

---

## Métriques PostHog à croiser

Après chaque session interview, vérifier dans PostHog :

- `discovery_session_qualified` déclenché ?
- `track_saved` (session crate)
- `trail_depth`
- Signaux : `liked`, `reposted`, `from_mix`, `similar`

---

## Critères de succès MVP (3 semaines)

| Critère | Cible |
|---------|-------|
| Interviews complétées | 5 |
| « Très déçu » | ≥ 2/5 (40 %) |
| Retour spontané sous 7 jours | ≥ 2 DJs |
| Session crate utilisée | ≥ 3/5 interviews |
