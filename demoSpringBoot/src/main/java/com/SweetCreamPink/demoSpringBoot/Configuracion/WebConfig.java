package com.SweetCreamPink.demoSpringBoot.Configuracion;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${uploads.directory}")
    private String directorioUploads;

    @Value("${catalog.assets.directory:}")
    private String catalogAssetsDirectory;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadsPath = directorioUploads.endsWith("/")
                ? directorioUploads
                : directorioUploads + "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsPath);

        if (catalogAssetsDirectory != null && !catalogAssetsDirectory.isBlank()) {
            String catalogPath = catalogAssetsDirectory.endsWith("/")
                    ? catalogAssetsDirectory
                    : catalogAssetsDirectory + "/";
            registry.addResourceHandler("/uploads/productos/**")
                    .addResourceLocations("file:" + catalogPath);
        }
    }
}
