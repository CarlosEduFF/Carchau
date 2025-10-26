package com.carchau.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
@SecurityScheme(name = "cookieAuth", // nome do esquema de segurança
                type = SecuritySchemeType.APIKEY, // tipo apiKey
                in = SecuritySchemeIn.COOKIE, // usar o cookie
                paramName = "auth_token" // nome do cookie que contem o JWT
)
public class SwaggerConfig {
        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("API Carchau")
                                                .description("""
                                                                Essa API foi desenvolvida para o gerenciamento de Den\u00fancias e valida\u00e7\u00e3o de CNH do Projeto Carchau.""")
                                                .version("1.0"));
        }
        // http://localhost:8080/swagger-ui.html
}