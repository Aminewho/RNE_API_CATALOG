package com.RNE.RNE.service;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.RNE.RNE.model.SignupRequest;
import com.RNE.RNE.model.User;
import com.RNE.RNE.model.Wallet;
import com.RNE.RNE.repository.SignupRequestRepository;
import com.RNE.RNE.repository.UserRepository;
import com.RNE.RNE.repository.WalletRepository;
@Service
public class AdminService {
    @Autowired
    private SignupRequestRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WalletRepository walletRepository;

  @Transactional
  public void approveSignupRequest(Long requestId, String username, String rawPassword) {
    SignupRequest request = repository.findById(requestId)
        .orElseThrow(() -> new RuntimeException("Signup request not found"));

    if (!"NEW".equalsIgnoreCase(request.getStatus().toString())) {
        throw new RuntimeException("Request already processed");
    }
    if (userRepository.findByUsername(username).isPresent()) {
        throw new RuntimeException("Username already taken");
    }

    // Create and fill user entity
    User user = new User();
    user.setUsername(username);
    
    // Encrypt the password
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    user.setPassword(encoder.encode(rawPassword));

    // Set fields from signup request
    user.setMatriculeFiscale(request.getMatriculeFiscale());
    user.setSecteurActivite(request.getSecteurActivite());
    user.setRaisonSociale(request.getRaisonSociale());
    user.setAdresse(request.getAdresse());

    user.setNomPremierResponsable(request.getNomPremierResponsable());
    user.setPrenomPremierResponsable(request.getPrenomPremierResponsable());
    user.setEmailPremierResponsable(request.getEmailPremierResponsable());
    user.setTelPremierResponsable(request.getTelPremierResponsable());

    user.setNomResponsableTechnique(request.getNomResponsableTechnique());
    user.setPrenomResponsableTechnique(request.getPrenomResponsableTechnique());
    user.setEmailResponsableTechnique(request.getEmailResponsableTechnique());
    user.setTelResponsableTechnique(request.getTelResponsableTechnique());

    user.setIpAutorisee(request.getIp());
    user.setTel(request.getTel());
    user.setEmail(request.getEmail());
    // Optional: set role if needed (default is ROLE_USER)
    user.setRole("USER");
    Wallet wallet = new Wallet();
    wallet.setUser(user);
    wallet.setBalance(BigDecimal.ZERO);
    walletRepository.save(wallet);
    userRepository.save(user);
    request.setStatus(SignupRequest.Status.ACCEPTED);
    repository.save(request);
}

}
