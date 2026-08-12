package br.com.neki.gerenciador_eventos.controller;

import br.com.neki.gerenciador_eventos.dto.LoginRequestDTO;
import br.com.neki.gerenciador_eventos.dto.LoginResponseDTO;
import br.com.neki.gerenciador_eventos.dto.RegisterRequestDTO;
import br.com.neki.gerenciador_eventos.entity.Admin;
import br.com.neki.gerenciador_eventos.repository.AdminRepository;
import br.com.neki.gerenciador_eventos.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body) {
        Optional<Admin> admin = adminRepository.findByEmail(body.email());

        if (admin.isPresent() && passwordEncoder.matches(body.senha(), admin.get().getSenha())) {
            String token = tokenService.generateToken(admin.get());

            return ResponseEntity.ok(new LoginResponseDTO(admin.get().getId(), admin.get().getNome(), token));
        }
        return ResponseEntity.status(401).body("E-mail ou senha incorretos.");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO body) {
        Optional<Admin> adminExistente = adminRepository.findByEmail(body.email());
        if (adminExistente.isPresent()) {
            return ResponseEntity.badRequest().body("E-mail já está em uso.");
        }

        Admin novoAdmin = new Admin();
        novoAdmin.setNome(body.nome());
        novoAdmin.setEmail(body.email());

        novoAdmin.setSenha(passwordEncoder.encode(body.senha()));

        adminRepository.save(novoAdmin);

        return ResponseEntity.status(201).body("Administrador cadastrado com sucesso.");
    }
}
