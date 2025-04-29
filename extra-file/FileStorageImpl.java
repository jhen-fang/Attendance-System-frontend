package com.tsmc.cloudnative.attendancesystemapi.service;

import com.tsmc.cloudnative.attendancesystemapi.dto.FileUploadResponseDTO;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageImpl implements FileStorage {

    @Override
    public FileUploadResponseDTO saveFile(MultipartFile file) throws IOException {
        // 假裝存檔成功
        return new FileUploadResponseDTO(file.getOriginalFilename(), "Saved successfully (mock)");
    }

    @Override
    public Resource getFileAsResource(String fileName, Authentication authentication) {
        // 假裝可以下載
        try {
            Path filePath = Paths.get("uploads").resolve(fileName).normalize();
            return new UrlResource(filePath.toUri());
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean deleteFile(String fileName) {
        // 假裝刪除成功
        return true;
    }
}
