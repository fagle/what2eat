package com.frost.ssh;

/**
 * Created by fagle on 2017/2/22.
 */

import com.jcraft.jsch.*;
import expect4j.Closure;
import expect4j.Expect4j;
import expect4j.ExpectState;
import expect4j.matches.EofMatch;
import expect4j.matches.Match;
import expect4j.matches.RegExpMatch;
import expect4j.matches.TimeoutMatch;
import org.apache.oro.text.regex.MalformedPatternException;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

public class Shell {

    private static org.slf4j.Logger log = LoggerFactory.getLogger(Shell.class);

    private Session session;
    private ChannelShell channel;
    private static Expect4j expect = null;
    private static final long defaultTimeOut = 1000;
    private StringBuffer buffer=new StringBuffer();

    public static final String BACKSLASH_R = "\r";
    public static final String BACKSLASH_N = "\n";
    public static final String COLON_CHAR = ":";
    public static String ENTER_CHARACTER = BACKSLASH_N;
    public static final int SSH_PORT = 22;

    //正则匹配，用于处理服务器返回的结果
    public static String[] linuxPromptRegEx = new String[] { "~]#", "~#", "#",
            ":~#", "/$", "$", ">" };

    public static String[] errorMsg=new String[]{"could not acquire the config lock "};

    //ssh服务器的ip地址
    private String ip;
    //ssh服务器的登入端口
    private int port;
    //ssh服务器的登入用户名
    private String user;
    //ssh服务器的登入密码
    private String password;
    private String privateKey;

    public Shell(String ip,int port,String user,String password, String privateKeyFile) {
        this.ip=ip;
        this.port=port;
        this.user=user;
        this.password=password;
        this.privateKey = privateKeyFile;
        expect = getExpect();
    }

    /**
     * 关闭SSH远程连接
     */
    public void disconnect(){
        if(channel!=null){
            channel.disconnect();
        }
        if(session!=null){
            session.disconnect();
        }
    }

    /**
     * 获取服务器返回的信息
     * @return 服务端的执行结果
     */
    public String getResponse(){
        return buffer.toString();
    }

    //获得Expect4j对象，该对象可以往SSH发送命令请求
    private Expect4j getExpect() {
        try {
            log.debug(String.format("Start logging to %s@%s:%s",user,ip,port));
            JSch jsch = new JSch();
            session = jsch.getSession(user, ip, port);
            if (password.isEmpty()) {
                jsch.addIdentity(privateKey);
                jsch.setKnownHosts("C:\\cygwin64\\home\\fagle\\.ssh\\known_hosts");
            }
            else
                session.setPassword(password);
            Hashtable<String, String> config = new Hashtable<String, String>();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            localUserInfo ui = new localUserInfo();
            session.setUserInfo(ui);
            session.connect();
            channel = (ChannelShell) session.openChannel("shell");

            Expect4j expect = new Expect4j(channel.getInputStream(), channel
                    .getOutputStream());
            channel.connect();
            log.debug(String.format("Logging to %s@%s:%s successfully!",user,ip,port));
            return expect;
        } catch (Exception ex) {
            log.error("Connect to "+ip+":"+port+"failed,please check your username and password!");
            ex.printStackTrace();
        }
        return null;
    }

    /**
     * 执行配置命令
     * @param commands 要执行的命令，为字符数组
     * @return 执行是否成功
     */
    public boolean executeCommands(String[] commands) {
        //如果expect返回为0，说明登入没有成功
        if(expect==null){
            return false;
        }

        log.debug("----------Running commands are listed as follows:----------");
        for(String command:commands){
            log.debug(command);
        }
        log.debug("----------End----------");

        Closure closure = new Closure() {
            public void run(ExpectState expectState) throws Exception {
                buffer.append(expectState.getBuffer());// buffer is string
                // buffer for appending
                // output of executed
                // command
                expectState.exp_continue();

            }
        };
        List<Match> lstPattern = new ArrayList<Match>();
        String[] regEx = linuxPromptRegEx;
        if (regEx != null && regEx.length > 0) {
            synchronized (regEx) {
                for (String regexElement : regEx) {// list of regx like, :>, />
                    // etc. it is possible
                    // command prompts of your
                    // remote machine
                    try {
                        RegExpMatch mat = new RegExpMatch(regexElement, closure);
                        lstPattern.add(mat);
                    } catch (MalformedPatternException e) {
                        return false;
                    } catch (Exception e) {
                        return false;
                    }
                }
                lstPattern.add(new EofMatch(new Closure() { // should cause
                    // entire page to be
                    // collected
                    public void run(ExpectState state) {
                    }
                }));
                lstPattern.add(new TimeoutMatch(defaultTimeOut, new Closure() {
                    public void run(ExpectState state) {
                    }
                }));
            }
        }
        try {
            boolean isSuccess = true;
            for (String strCmd : commands){
                isSuccess = execute(lstPattern, strCmd);
            }
            //防止最后一个命令执行不了
            isSuccess = expect.expect(lstPattern) >= 0;

            //找不到错误信息标示成功
            String response=buffer.toString().toLowerCase();
            for(String msg:errorMsg){
                if(response.indexOf(msg)>-1){
                    return false;
                }
            }

            return isSuccess;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    /***执行命令
     *
     * @param objPattern 匹配执行结果
     * @param strCommandPattern 待执行的命令
     * @return 是否执行成功
     */
    private boolean execute(List<Match> objPattern, String strCommandPattern) {
        try {
            if (expect.expect(objPattern) >= 0) {
                expect.send(strCommandPattern);
                expect.send("\n");
                return true;
            }
            return false;
        } catch (MalformedPatternException ex) {
            return false;
        } catch (Exception ex) {
            return false;
        }
    }


    //登入SSH时的控制信息
    //设置不提示输入密码、不显示登入信息等
    public static class localUserInfo implements UserInfo {
        String passwd;

        public String getPassword() {
            return passwd;
        }

        public boolean promptYesNo(String str) {
            return true;
        }

        public String getPassphrase() {
            return null;
        }

        public boolean promptPassphrase(String message) {
            return true;
        }

        public boolean promptPassword(String message) {
            return true;
        }

        public void showMessage(String message) {

        }
    }


    /**
     * 利用JSch包实现远程主机SHELL命令执行
     * @param ip 主机IP
     * @param user 主机登陆用户名
     * @param psw  主机登陆密码
     * @param port 主机ssh2登陆端口，如果取默认值，传-1
     * @param privateKey 密钥文件路径
     * @param passphrase 密钥的密码
     */
    public static void sshShell(String ip, String user, String psw
            ,int port ,String privateKey ,String passphrase) throws Exception{
        Session session = null;
        Channel channel = null;


        JSch jsch = new JSch();
        jsch.setKnownHosts("C:\\cygwin64\\home\\fagle\\.ssh\\known_hosts");
        //设置密钥和密码
        if (privateKey != null && !"".equals(privateKey)) {
            if (passphrase != null && "".equals(passphrase)) {
                //设置带口令的密钥
                jsch.addIdentity(privateKey, passphrase);
            } else {
                //设置不带口令的密钥
                jsch.addIdentity(privateKey);
            }
        }

        if(port <=0){
            //连接服务器，采用默认端口
            session = jsch.getSession(user, ip);
        }else{
            //采用指定的端口连接服务器
            session = jsch.getSession(user, ip ,port);
        }

        //如果服务器连接不上，则抛出异常
        if (session == null) {
            throw new Exception("session is null");
        }

        //设置登陆主机的密码
        //session.setPassword(psw);//设置密码
        //设置第一次登陆的时候提示，可选值：(ask | yes | no)
        //session.setConfig("StrictHostKeyChecking", "no");
        //设置登陆超时时间
        session.connect(30000);

        try {
            //创建ssh通信通道
            channel = (Channel) session.openChannel("shell");
            channel.connect(1000);

            //获取输入流和输出流
            InputStream instream = channel.getInputStream();
            OutputStream outstream = channel.getOutputStream();
            OutputStreamWriter writer = new OutputStreamWriter(outstream);

            //发送需要执行的SHELL命令，需要用\n结尾，表示回车
            String shellCommand = "ls \n";
            writer.write(shellCommand);
            writer.flush();
            Thread.sleep(3000);

            //获取命令执行的结果
            if (instream.available() > 0) {
                byte[] data = new byte[instream.available()];
                int nLen = instream.read(data);

                if (nLen < 0) {
                    throw new Exception("network error.");
                }

                //转换输出结果并打印出来
                String temp = new String(data, 0, nLen,"UTF-8");
                System.out.println(temp);
            }
            outstream.close();
            instream.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            session.disconnect();
            channel.disconnect();
        }
    }

    public static void main(String[] args) {
        String ip = "192.168.11.226";
        int port = 22;
        String user ="fagle";
        String password = "";
        String cmds[] = {"pwd","ifconfig"};
        /*Shell ssh = new Shell(ip,port,user,password);
        ssh.executeCommands(cmd);
        System.out.println(ssh.getResponse());
        ssh.disconnect();*/
        try {
            //sshShell("203.66.32.48", "dev", "", 20460, "C:\\cygwin64\\home\\fagle\\.ssh\\id_rsa", "");
            String cmd = "echo date -s '2017-03-08 15:18:00' +\"%Y-%m-%d %H:%M:%S\"\n";
            Shell shell = new Shell("203.66.32.48", 20460, "dev", "", "C:\\cygwin64\\home\\fagle\\.ssh\\id_rsa");
            String result = "";
            if (shell.executeCommands(new String[] {cmd}) )
                result = shell.getResponse();
            log.info("execute result: {}", result);
            shell.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}