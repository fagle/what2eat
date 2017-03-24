package com.frost.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.Profile;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by fagle on 2017/3/14.
 */
@Configuration
@Profile("dev")
@ImportResource("classpath:dev-properties.xml")
public class DevAppConfig {



    @Bean
    public AppConfig appConfig(){
        AppConfig appConfig = new AppConfig();
        return appConfig;
    }

}
