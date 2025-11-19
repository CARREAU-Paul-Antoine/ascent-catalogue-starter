

# Ascent Catalogue

## 1. Configuration et Démarrage

### Installation des dépendances



```
npm install
```

### Démarrage de l'application

```
npm start
```

Le serveur démarrera alors sur le port défini dans `config/network.js` (par défaut 4200).

---

## 2. Liste des Endpoints et leur fonctionnement

| Endpoint                              | Méthode | Description                                         | Paramètres Query                       |
|-------------------------------------|---------|---------------------------------------------------|--------------------------------------|
| `/formations`                       | GET     | Récupère toutes les formations                     | -                                    |
| `/formations/search`                | GET     | Recherche simple insensible à la casse et aux accents dans le titre des formations | `keyword` (string, optionnel)        |
| `/formations/advanced-search`       | GET     | Recherche avancée avec pagination, filtres multiples et tri | `keyword`, `niveau`, `prixMax`, `dureeMin`, `sort`, `order`, `page`, `limit` |

### Paramètres détaillés pour `/formations/advanced-search`

- `keyword` (string) : recherche dans les titres (insensible à la casse et aux accents)
- `niveau` (string) : filtre sur le niveau de la formation (Débutant, Intermédiaire, Avancé)
- `prixMax` (number) : prix maximum de la formation (>= 0)
- `dureeMin` (number) : durée minimum de la formation en jours (>= 0)
- `sort` (string) : champ de tri (`prix`, `duree`, `titre`)
- `order` (string) : ordre du tri (`asc` ou `desc`)
- `page` (number) : numéro de page (>= 1)
- `limit` (number) : nombre d’éléments par page (1-100)

---

## 3. Mécanisme de mise en cache utilisé

Afin d'optimiser les performances, un système de cache asynchrone est mis en place :

- Le fichier `formations.json` est chargé **une seule fois** au démarrage dans un cache en mémoire.
- Une surveillance via `fs.watch` détecte les modifications du fichier JSON et recharge automatiquement le cache sans bloquer l’Event Loop.
- Le cache est mis à jour de manière atomique, garantissant la cohérence des données même durant les accès concurrents.
- Le cache fournit des métriques (nombre de hits, nombre de misses, temps de chargement) pour le monitoring.
- Cette approche évite les lectures répétitives disque pour chaque requête, assurant ainsi une meilleure performance et disponibilité.
- En cas de modification du fichier en cours d'exécution, le cache est mis à jour sans besoin de redémarrer le serveur.

---

## Notes supplémentaires

- La recherche supporte une normalisation des chaines pour être insensible aux accents et à la casse.
- Une validation stricte des paramètres d'entrée est effectuée pour éviter les erreurs et vulnérabilités potentielles.
- Les erreurs sont gérées robustement via un middleware global de gestion des erreurs qui logge les erreurs de manière structurée et sécurisée.



