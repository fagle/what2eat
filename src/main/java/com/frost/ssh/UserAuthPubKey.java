package com.frost.ssh;

/**
 * Created by fagle on 2017/2/22.
 */
import com.jcraft.jsch.*;

import java.io.*;

public class UserAuthPubKey{
    public static void main(String[] arg){

        //sshShell("203.66.32.48", "dev", "", 20460, "C:\\cygwin64\\home\\fagle\\.ssh\\id_rsa", "");
        String pubkeyfile="C:\\cygwin64\\home\\fagle\\.ssh\\id_rsa";
        String passphrase="";
        String host="203.66.32.48", user="dev";

        try{
            JSch jsch=new JSch();
            jsch.addIdentity(pubkeyfile);
//   jsch.addIdentity(pubkeyfile, passphrase);
            jsch.setKnownHosts("C:\\cygwin64\\home\\fagle\\.ssh\\known_hosts");

            Session session=jsch.getSession(user, host, 20460);
            session.connect();

            Channel channel=session.openChannel("shell");

            OutputStream outputStream = channel.getOutputStream();
            //channel.setInputStream(System.in);
            //channel.setOutputStream(System.out);
            InputStream in = channel.getInputStream();
            InputStreamReader reader = new InputStreamReader(in);
            char[] buf=new char[1024];

            channel.connect();

            OutputStreamWriter writer = new OutputStreamWriter(outputStream);
            writer.write("echo date -s '2017-03-08 15:18:00' +\"%Y-%m-%d %H:%M:%S\" \n");
            writer.flush();
            Thread.sleep(5000);
            StringBuilder sb = new StringBuilder(1024);
            while (in.available() > 0) {
                int c = reader.read(buf);
                sb.append(buf, 0, c);
            }
            System.out.println(sb.toString().replaceAll("\r", ""));
            channel.disconnect();
            session.disconnect();
        }
        catch(Exception e){
            System.out.println(e); e.printStackTrace();
        }
    } //end of main
} //end of class