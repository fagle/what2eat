package com.frost.configuration;


import java.io.File;
import java.net.URL;

/**
 * Created by fagle on 2017/3/14.
 */
public class AppConfig {
    public AppConfig() {
        URL url = getClass().getClassLoader().getResource("/update-server-txt.bat");
        if (url == null)
            CmdUpdateServerCfg = "";
        else {
            File file = new File(url.getFile());
            CmdUpdateServerCfg = "cmd /c start " + file.getPath();
        }
    }

    private String privateFile = "C:\\cygwin64\\home\\fagle\\.ssh\\id_rsa";
    private String CmdUpdateServerCfg;

    public String getPrivateFile() {
        return privateFile;
    }

    public String getCmdUpdateServerCfg() {
        return CmdUpdateServerCfg;
    }

    public void setCmdUpdateServerCfg(String cmdUpdateServerCfg) {
        CmdUpdateServerCfg = cmdUpdateServerCfg;
    }
}