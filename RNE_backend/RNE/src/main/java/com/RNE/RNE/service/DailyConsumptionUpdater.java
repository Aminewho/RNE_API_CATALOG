

//cette classe met ajour tout les aboonement actifs ou qui ont expiré aujourd'hui en ajoutant la consommation du jour à la consommation totale de l'abonnement 
//en ajoutant une ligne a la table qui contient  date et nombre de requêtes utilisées par abbonement
// Elle utilise la méthode getUsedRequestsForSubscriptionToday de la classe UsageService pour obtenir le nombre de requêtes utilisées aujourd'hui pour chaque abonnement actif ou expiré. Elle utilise également la méthode totalBeforeToday de la classe ConsumptionRepository pour obtenir le nombre de requêtes utilisées avant aujourd'hui pour chaque abonnement. Enfin, elle met à jour la consommation quotidienne dans la base de données et change le statut de l'abonnement si nécessaire.
