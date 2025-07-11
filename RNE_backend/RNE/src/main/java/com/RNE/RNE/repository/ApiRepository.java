package com.RNE.RNE.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.RNE.RNE.model.Api;
public interface ApiRepository extends JpaRepository<Api, String> {
    List<Api> findByInstanceId(Long instanceId);

    List<Api> findByPublishedTrue();
}