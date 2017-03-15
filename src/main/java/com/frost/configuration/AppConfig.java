package com.frost.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by fagle on 2017/3/14.
 */
@Configuration
@Profile("production")
public class AppConfig {

    public class CMD
    {
        public static final String UPDATE_SERVER_CFG = "update-server-cfg";
        public static final String RESTART_SERVER = "restart-server";
    }
    @Bean

    public Map<String, String> devCmdMap() {
        Map<String, String> map = new HashMap<>();
        map.put(CMD.UPDATE_SERVER_CFG, "");
        return map;
    }

    @Bean
    public Map<String, String> productionCmdMap(){
        Map<String, String> map = new HashMap<>();
        return map;
    }

}
