package com.industrial.brain.controller;

import com.industrial.brain.model.Document;
import com.industrial.brain.model.User;
import com.industrial.brain.repository.DocumentRepository;
import com.industrial.brain.repository.UserRepository;
import com.industrial.brain.service.CloudinaryService;
import com.industrial.brain.service.OcrService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final OcrService ocrService;

    public DocumentController(DocumentRepository documentRepository, UserRepository userRepository,
                              CloudinaryService cloudinaryService, OcrService ocrService) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.ocrService = ocrService;
    }

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file,
                                            @RequestParam(value = "department", defaultValue = "Operations") String department) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Uploaded file is empty");
        }

        try {
            // Get current user
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User currentUser = null;
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                currentUser = userRepository.findByUsername(username).orElse(null);
            }

            // Save basic metadata first
            String fileUrl = cloudinaryService.uploadFile(file);
            
            Document document = Document.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(getFileExtension(file.getOriginalFilename()))
                    .fileUrl(fileUrl)
                    .department(department)
                    .uploadedBy(currentUser)
                    .status("UPLOADED")
                    .build();

            Document savedDoc = documentRepository.save(document);

            // Execute OCR/Tika text extraction
            String text = ocrService.extractText(file);
            savedDoc.setExtractedText(text);
            savedDoc.setStatus("PROCESSED");
            documentRepository.save(savedDoc);

            return ResponseEntity.ok(savedDoc);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error parsing file: " + e.getMessage());
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "unknown";
        return filename.substring(filename.lastIndexOf(".") + 1).toUpperCase();
    }
}
