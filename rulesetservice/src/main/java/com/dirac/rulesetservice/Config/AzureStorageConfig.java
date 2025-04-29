package com.dirac.rulesetservice.Config;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.common.StorageSharedKeyCredential;

@Configuration
public class AzureStorageConfig {

    @Value("${azure.storage.account-name}")
    private String accountName;

    @Value("${azure.storage.account-key}")
    private String accountKey;

    @Value("${azure.storage.blob-endpoint}")
    private String accountEndpoint;

    @Value("${azure.storage.container-name}")
    private String containerName;


    @Bean(name = "azureStorageClient")
    public BlobContainerClient azureStorageClient() {
        return new BlobServiceClientBuilder().endpoint(String.format(Locale.ROOT, accountEndpoint, accountName))
                .credential(new StorageSharedKeyCredential(accountName, accountKey)).buildClient()
                .getBlobContainerClient(containerName);
    }
}
