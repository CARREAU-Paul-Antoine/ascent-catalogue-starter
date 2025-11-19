# JUSTIFICATION DE LA MISE EN CACHE DU CATALOGUE DE FORMATIONS

## Contexte

Pour optimiser les performances de l'API, il est nécessaire d'implémenter un mécanisme de mise en cache du catalogue complet des formations, afin d'éviter la lecture répétée du fichier JSON.

---

## Problèmes de l'approche synchrone classique

### 1. Modifications non prises en compte

Lorsque le fichier `formations.json` est modifié pendant que le serveur tourne, la solution synchrone de lecture unique au démarrage ne permet pas de recharger automatiquement les données mises à jour. Il faut redémarrer le serveur, ce qui impacte la disponibilité.

### 2. Blocage de l'Event Loop

La lecture synchrone avec `fs.readFileSync()` bloque l'Event Loop. Bien que ce blocage soit limité au démarrage, il peut ralentir la mise en route du serveur, surtout si le fichier est volumineux.

### 3. Absence de gestion des accès concurrents

Sans mécanisme gérant les accès concurrents, plusieurs requêtes simultanées peuvent causer des incohérences ou race conditions si le cache est modifié ou rechargé de manière incorrecte.

---

## Proposition d'une solution asynchrone et non bloquante

- Utiliser la lecture asynchrone `fs.readFile()` pour charger le fichier sans bloquer l'Event Loop.
- Charger le catalogue au démarrage du serveur avant de commencer à traiter les requêtes.
- Implémenter un mécanisme de **rechargement automatique du cache** via la surveillance du fichier avec `fs.watch` ou une relecture périodique.
- Garantir un remplacement atomique de la référence du cache pour éviter toute incohérence durant la mise à jour.
- Gérer correctement les accès concurrents au cache afin que toutes les requêtes reçoivent une version cohérente des données.
- Fournir des métriques de performance (temps de chargement, nombre de hits/misses au cache) pour monitorer l’efficacité et détecter d’éventuels problèmes.

---

## Gestion des race conditions

- La mise à jour du cache est réalisée uniquement **après** le chargement complet du fichier.
- La référence globale du cache est ensuite remplacée, garantissant que toute requête accédant au cache lira des données complètes et cohérentes.
- Si plusieurs rechargements sont provoqués simultanément, chacun est traité indépendamment, mais le dernier écrasera la valeur finale du cache.
- Pendant le chargement du nouveau cache, les requêtes continuent d'accéder au cache précédent sans blocage.

---

## Contraintes de performance respectées

- Aucun blocage de l'Event Loop en production.
- Accès concurrents sécurisés et fiables.
- Minimisation des lectures disque inutiles grâce à la surveillance du fichier.
- Transparence et monitoring par métriques intégrées.

---

## Conclusion

Cette solution asynchrone et non bloquante permet de remédier efficacement aux problèmes liés à la lecture synchrone initiale. Elle garantit la disponibilité et la cohérence des données tout en assurant une bonne performance et une facilité d'administration du cache.

---

