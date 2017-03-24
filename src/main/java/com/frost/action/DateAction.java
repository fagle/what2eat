package com.frost.action;

import com.frost.configuration.AppConfig;
import com.frost.ssh.Exec;
import com.frost.ssh.Shell;
import com.opensymphony.xwork2.ActionSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.springframework.beans.factory.config.ConfigurableBeanFactory.SCOPE_PROTOTYPE;

/**
 * Created by fagle on 2017/2/22.
 */
@Component
@Scope(SCOPE_PROTOTYPE)
public class DateAction extends ActionSupport {
    private String serverDate;
    private static DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static Logger log = LoggerFactory.getLogger(DateAction.class);
    private String result;
    private String now = sdf.format(new Date());

    private String user = "dev";
    private String host = "203.66.32.48";
    private int port = 20460;

    private String cmdLoggerFile = "";
    private AppConfig appConfig;
    private String privateFile;
    private int offset;

    public String getServerDate() {
        return serverDate;
    }

    public void setServerDate(String serverDate) {
        this.serverDate = serverDate;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    @Resource
    public void setAppConfig(AppConfig appConfig) {
        this.appConfig = appConfig;
        this.privateFile = appConfig.getPrivateFile();
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getNow() {
        return now;
    }

    public String getCmdLoggerFile() {
        return cmdLoggerFile;
    }

    @Override
    public String execute() {
        String cmd = "echo sudo date -s '2017-03-10 11:55:00' +'%Y-%m-%d %H:%M:%S'; ls --color=never";
        cmd = "date +'%Y-%m-%d %H:%M:%S'";
        Shell shell = new Shell(host, port, user, "", privateFile);
       /* if (shell.executeCommands(new String[] {cmd}) )
            try {
                result = shell.getResponse();
            } catch (Exception e) {
                e.printStackTrace();
            }*/
        result =  Exec.executeCmd(user, host, privateFile, cmd);
        log.info("execute result: {}", result);
        serverDate = result.replaceAll("\n", "");
        return SUCCESS;
    }

    public String input() {

        try {
            Date date = sdf.parse(serverDate);
            if (date.getTime() > 0) {
                log.info("input date time: {}", serverDate);
                String cmd = "sudo date -s '" + serverDate + "' +'%Y-%m-%d %H:%M:%S'";
                result = Exec.executeCmd(user, host, privateFile, cmd);
                result = result.replaceAll("\n", "");
            }
        } catch (Exception e) {
            log.error("{}", e);
        }
        return SUCCESS;
    }

    public String restartServer() {
        return SUCCESS;
    }

    public String updateServerCfg() {
        new Thread(() -> {
            try {
                String cmdstring = appConfig.getCmdUpdateServerCfg();

                log.info("current path: {}", cmdstring);
                Process proc = Runtime.getRuntime().exec(cmdstring);
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(proc.getInputStream(), "GBK"));
                char[] chars = new char[1024];
                StringBuffer buffer = new StringBuffer(1024);
                int count=0;
                while ( (count = bufferedReader.read(chars)) != -1) {
                    buffer.append(chars, 0, count);
                }
                bufferedReader.close();
                result = buffer.toString();
                proc.waitFor(); //阻塞，直到上述命令执行完
            } catch (Exception e) {
                log.error("{}", e);
            }
        }).start();
        return SUCCESS;
    }

    public String requestLog() {
        String logPath = getClass().getClassLoader().getResource("/").getPath() +"update_srv_cfg.log";
        try {
            InputStreamReader reader = new InputStreamReader(new FileInputStream(logPath), "UTF-8");
            char[] chars = new char[1024];
            int i = 0;
            StringBuffer sb = new StringBuffer();
            while ((i = reader.read(chars, 0, 1024)) != -1) {
                sb.append(chars, 0, i);
            }
            result = sb.toString().substring(offset);
            reader.close();
        } catch (FileNotFoundException fnf){
            log.info("file not found");
        } catch (Exception e) {
           log.error("{}", e);
        }
        return SUCCESS;
    }

    public String startServer() {
        return SUCCESS;
    }
}
