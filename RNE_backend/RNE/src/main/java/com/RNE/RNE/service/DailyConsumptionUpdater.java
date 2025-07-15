package com.RNE.RNE.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

import com.RNE.RNE.model.Consumption;
import com.RNE.RNE.model.Subscription;
import com.RNE.RNE.model.SubscriptionStatus;
import com.RNE.RNE.repository.ConsumptionRepository;
import com.RNE.RNE.repository.SubscriptionRepository;

@EnableScheduling
@Service
@RequiredArgsConstructor
public class DailyConsumptionUpdater {

     private final SubscriptionRepository subscriptionRepo;
     private final ConsumptionRepository consumptionRepo;
     private final UsageService usageService;
    
    @Transactional
    @Scheduled(cron = "40 59 23 * * *", zone = "Africa/Tunis")
    public void updateDailyUsage() {
        ZoneId zone = ZoneId.of("Africa/Tunis");
        LocalDate today = LocalDate.now(zone);
        ZonedDateTime now = ZonedDateTime.now(zone);
        List<Subscription> activeSubs =subscriptionRepo.findActiveOrExpiredToday(today.atTime(0, 0, 0), today.atTime(23, 59, 59));
        for (Subscription sub : activeSubs) {
            System.out.println("[!] Updating daily consumption for subscription:" + sub.getApi().getName() + " for date: " + today);
            int requestCount = 0;
            requestCount= usageService.getUsedRequestsForSubscriptionToday(sub);
            int dbCount = consumptionRepo.totalBeforeToday(sub, today);
            sub.setUsedRequests(requestCount+ dbCount);
            if(sub.getUsedRequests() == sub.getAllowedRequests()) {
                sub.setStatus(SubscriptionStatus.EXPIRED);
                sub.setExpirationDate(now.toLocalDateTime());
            }
            Consumption consumption =new Consumption(sub, today, 0);
            consumption.setRequests(requestCount);
            consumptionRepo.save(consumption);
            subscriptionRepo.save(sub);
        }
        System.out.println("[✓] Daily consumption updated at " + now);
    }
}

//cette classe met ajour tout les aboonement actifs ou qui ont expiré aujourd'hui en ajoutant la consommation du jour à la consommation totale de l'abonnement 
//en ajoutant une ligne a la table qui contient  date et nombre de requêtes utilisées par abbonement
// Elle utilise la méthode getUsedRequestsForSubscriptionToday de la classe UsageService pour obtenir le nombre de requêtes utilisées aujourd'hui pour chaque abonnement actif ou expiré. Elle utilise également la méthode totalBeforeToday de la classe ConsumptionRepository pour obtenir le nombre de requêtes utilisées avant aujourd'hui pour chaque abonnement. Enfin, elle met à jour la consommation quotidienne dans la base de données et change le statut de l'abonnement si nécessaire.
