package com.frost.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Created by fagle on 2017/3/23.
 */
@Configuration
@Profile("product")
public class ProductAppConfig {

    @Bean
    public AppConfig appConfig(){
        AppConfig appConfig = new AppConfig();
        String cmdUpdateServerCfg = getClass().getClassLoader().getResource("/update-server-txt.sh").getPath();
        appConfig.setCmdUpdateServerCfg(cmdUpdateServerCfg);
        return appConfig;
    }
}
