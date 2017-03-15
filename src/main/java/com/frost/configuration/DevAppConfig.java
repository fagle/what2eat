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

    public class Cmd
    {
        public static final String updateServerCfg = "update-server-cfg";
        public static final String restartServer = "restart-server";
    }
    @Bean
    @Profile("dev")
    public Cmd cmd() {
        return new Cmd();
    }

    @Bean
    @Profile("production")
    public Map<String, String> productionCmdMap(){
        Map<String, String> map = new HashMap<>();
        return map;
    }

}
