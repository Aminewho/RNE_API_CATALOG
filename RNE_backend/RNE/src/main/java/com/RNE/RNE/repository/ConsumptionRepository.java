package com.RNE.RNE.repository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.RNE.RNE.model.Consumption;
import com.RNE.RNE.model.Subscription;

public interface ConsumptionRepository
        extends JpaRepository<Consumption, Long> {

    @Query("""
       select coalesce(sum(c.requests),0)
       from Consumption c
       where c.subscription = :sub
    """)
    int totalBySubscription(@Param("sub") Subscription sub);

    @Query("""
       select coalesce(sum(c.requests),0)
       from Consumption c
       where c.subscription = :sub and c.day < :today
    """)
    int totalBeforeToday(@Param("sub") Subscription sub,
                         @Param("today") LocalDate today);
                         
                         /**
 * All APPROVED subscriptions
 * plus EXPIRED subscriptions whose expirationDate falls on the given day
 */
@Query("""
   select s
   from   Subscription s
   where  s.status = 'APPROVED'
      or ( s.status = 'EXPIRED'
           and s.expirationDate >= :start
           and s.expirationDate <  :end )
""")
List<Subscription> findActiveOrExpiredToday(@Param("start") LocalDateTime start,
                                            @Param("end")   LocalDateTime end);
    Optional<Consumption> findBySubscriptionAndDay(Subscription subscription, LocalDate day);

}
