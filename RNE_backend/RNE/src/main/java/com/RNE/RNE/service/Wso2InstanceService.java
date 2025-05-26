package com.RNE.RNE.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.RNE.RNE.model.Wso2Instance;
import com.RNE.RNE.repository.Wso2InstanceRepository;

@Service
public class Wso2InstanceService {
    @Autowired
    private  Wso2InstanceRepository repo;

    public void addInstance(Wso2Instance instance) {
        repo.save(instance);
    }
    public void deleteInstance(Long id) {
        repo.deleteById(id);
    }
    public List<Wso2Instance> getAllInstances() {
        return repo.findAll();
    }
}
