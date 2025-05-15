package com.dirac.rulesetservice.Service;

import com.azure.core.util.BinaryData;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.models.BlobItem;
import com.azure.storage.blob.models.ListBlobsOptions;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import com.dirac.rulesetservice.DTO.ResponseAzure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Slf4j
@Service
public class FileUtils {

    public static final String filePath = "Rulesets";
    private static final String SLASH_SYMBOL = "/";

    @Autowired
    private BlobContainerClient azureStorageClient;

    public ResponseAzure uploadFileInAzureStorage(MultipartFile fileContent) {

        if (fileContent.isEmpty())
            log.error("File content is NULL");

        BlobClient blobClient = null;
        String fullFilePath = filePath + File.separator + fileContent.getOriginalFilename();
        try {
            blobClient = azureStorageClient.getBlobClient(fullFilePath);
            blobClient.getBlockBlobClient().upload(new BufferedInputStream(fileContent.getInputStream()),
                    fileContent.getSize(), true);
            log.info(fileContent.getOriginalFilename() + " uploaded successfully into Azure File Storage");
        } catch (IOException e) {
            log.error("Exception occurred during file upload : " + e.getMessage() + " for "
                    + fileContent.getOriginalFilename());
        }

        String fileUrl = blobClient.getBlobUrl() + "?"
                + blobClient.generateSas(new BlobServiceSasSignatureValues(OffsetDateTime.now().plusDays(30),
                        new BlobSasPermission().setReadPermission(true)).setStartTime(OffsetDateTime.now()));
        String fileName = blobClient.getBlobName();

        return new ResponseAzure(fileName, fileUrl);

    }

    public InputStreamResource downloadFile(String fileName) {
        InputStream inputStream = null;
        try {
            // Construct the full file path in Azure Blob Storage
            String fullFilePath = filePath + "/" + fileName;
            log.info("filePath : " + filePath + "/" + fileName);

            BlobClient blobClient = azureStorageClient.getBlobClient(fullFilePath);

            if (!blobClient.exists())
                log.error("File does not exist in Azure Blob Storage.");

            BinaryData binaryData = blobClient.downloadContent();
            inputStream = binaryData.toStream();
        } catch (Exception e) {
            log.error("Exception occurred during file download : " + e.getMessage() + " for " + fileName);
        }
        if (inputStream == null) {
            throw new IllegalStateException("InputStream is null. File might not exist or could not be downloaded.");
        }
        return new InputStreamResource(inputStream);
    }

    /**
     * Downloads all files from Azure Folder Storage
     */
    public void downloadFolderFromAzureStorage(String folderPath, String destinationPath) {
        log.info("Downloading all files from folder " + folderPath);
        String[] blobNames;
        for (BlobItem blobItem : azureStorageClient.listBlobs(new ListBlobsOptions().setPrefix(folderPath), null)) {
            if (Optional.ofNullable(blobItem.getName()).isPresent()) {
                blobNames = blobItem.getName().split(SLASH_SYMBOL);
                azureStorageClient.getBlobClient(blobItem.getName()).downloadToFile(
                        destinationPath + File.separator + blobNames[blobNames.length - 1]);
            }
        }
        log.info("Completed Downloading all files from folder " + folderPath);
    }

    /**
     * Deletes File from Azure Storage
     */
    public void deleteFileFromAzureStorage(String filePath, String fileName) {
        log.info("Deleting file named: " + fileName + " from " + filePath);
        azureStorageClient.getBlobClient(filePath + File.separator + fileName).getBlockBlobClient().deleteIfExists();
        log.info("File deleted successfully from Azure File Storage");
    }

    /**
     * Calculates Folder size in Azure Storage
     */
    public long calculateFolderSizeInAzureStorage(String folderPath) {
        log.info("Calculating folder size of Azure Storage folder : " + folderPath);
        long folderSize = 0;
        for (BlobItem blobItem : azureStorageClient.listBlobs(new ListBlobsOptions().setPrefix(folderPath), null)) {
            if (Optional.ofNullable(blobItem.getName()).isPresent()) {
                folderSize += azureStorageClient.getBlobClient(blobItem.getName()).getProperties().getBlobSize();
            }
        }
        return folderSize;
    }

    /**
     * Gets the file names in a folder in Azure Storage
     */
    public List<String> getFileNamesInAzureStorage(String folderPath) {
        List<String> fileNames = new ArrayList<>();
        String[] blobNames;
        for (BlobItem blobItem : azureStorageClient.listBlobs(new ListBlobsOptions().setPrefix(folderPath), null)) {
            if (Optional.ofNullable(blobItem.getName()).isPresent()) {
                blobNames = blobItem.getName().split(SLASH_SYMBOL);
                fileNames.add(blobNames[blobNames.length - 1]);
            }
        }
        return fileNames;
    }

    /**
     * Zipped all the files iteratively for the given folder path.
     */
    public static void zipFile(File fileToZip, String fileName, ZipOutputStream zipOut) throws IOException {
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith(SLASH_SYMBOL)) {
                zipOut.putNextEntry(new ZipEntry(fileName));
                zipOut.closeEntry();
            } else {
                zipOut.putNextEntry(new ZipEntry(fileName + SLASH_SYMBOL));
                zipOut.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            for (File childFile : children) {
                zipFile(childFile, fileName + SLASH_SYMBOL + childFile.getName(), zipOut);
            }
            return;
        }
        FileInputStream fis = new FileInputStream(fileToZip);
        ZipEntry zipEntry = new ZipEntry(fileName);
        zipOut.putNextEntry(zipEntry);
        StreamUtils.copy(fis, zipOut);
        fis.close();
    }

}
