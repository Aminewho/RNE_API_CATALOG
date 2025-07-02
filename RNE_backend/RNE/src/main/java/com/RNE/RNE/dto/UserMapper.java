package com.RNE.RNE.dto;

import com.RNE.RNE.model.User;
public class UserMapper {
    public static UserDto toDTO(User user) {
        UserDto dto = new UserDto();
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setMatriculeFiscale(user.getMatriculeFiscale());
        dto.setSecteurActivite(user.getSecteurActivite());
        dto.setRaisonSociale(user.getRaisonSociale());
        dto.setAdresse(user.getAdresse());
        dto.setNomPremierResponsable(user.getNomPremierResponsable());
        dto.setPrenomPremierResponsable(user.getPrenomPremierResponsable());
        dto.setEmailPremierResponsable(user.getEmailPremierResponsable());
        dto.setTelPremierResponsable(user.getTelPremierResponsable());
        dto.setNomResponsableTechnique(user.getNomResponsableTechnique());
        dto.setPrenomResponsableTechnique(user.getPrenomResponsableTechnique());
        dto.setEmailResponsableTechnique(user.getEmailResponsableTechnique());
        dto.setTelResponsableTechnique(user.getTelResponsableTechnique());
        dto.setTel(user.getTel());
        dto.setEmail(user.getEmail());
        dto.setIpAutorisee(user.getIpAutorisee());
        if (user.getWallet() != null) {
            dto.setBalance(user.getWallet().getBalance());
        }

        return dto;
    }
}

