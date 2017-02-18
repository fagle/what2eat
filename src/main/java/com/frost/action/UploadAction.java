package com.frost.action;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.SessionAware;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
/**
 * Created by fagle on 2016/3/23.
 */
/**
 * 获取Android端上传过来的信息
 *
 * @author Administrator
 *
 */
@SuppressWarnings("serial")
public class UploadAction extends ActionSupport implements SessionAware {
    // 上传文件域
    private File file;
    // 上传文件类型
    private String fileContentType;
    // 封装上传文件名
    private String fileFileName;
    // 接受依赖注入的属性
    private String savePath;
    private String username;
    private String password;
    private Map<String, Object> session;
    private  FTPClient ftp;
    private String ftpAddr;

    @Override
    public String execute() {
        FileOutputStream fos = null;
        FileInputStream fis = null;
        int retcode= 0;
        String url = "";
        try {
            System.out.println("获取Android端传过来的普通信息：");
            System.out.println("用户名："+getUsername());
            System.out.println("密码："+getPassword());
            System.out.println("获取Android端传过来的文件信息：");
            System.out.println("文件存放目录: "+getSavePath());
            System.out.println("文件名称: "+ fileFileName);
            System.out.println("文件大小: "+file.length());
            System.out.println("文件类型: "+ getFileContentType());

            String name = getFileFileName();
            //fos = new FileOutputStream(getSavePath() + "/" + name);
            fis = new FileInputStream(getFile());
            /*byte[] buffer = new byte[1024];
            int len = 0;
            while ((len = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
            }*/
            //fis.close();
            //fis = null;
            //fos.close();
            //fos = null;
            if (connect("/image", ftpAddr, 2222, "user", "1234")) {
                System.out.println("ftp 连接成功。");
            }
            ftp.storeFile(name, fis);
            ftp.disconnect();
            System.out.println("文件上传成功");
            retcode = 1;
            url = name;
        }
        catch (UnknownHostException e) {
            System.out.println("Ftp域名解析失败");
            retcode = -1;
            e.printStackTrace();
        }
        catch (Exception e) {
            System.out.println("文件上传失败");
            e.printStackTrace();
        } finally {
            close(fos, fis);
        }
        session.put("retcode", Integer.toString(retcode));
        session.put("url", url);
        return SUCCESS;
    }

    /**
     * 文件存放目录
     *
     * @return
     */
    public String getSavePath() throws Exception{
        return ServletActionContext.getServletContext().getRealPath(savePath);
    }

    public void setSavePath(String savePath) {
        this.savePath = savePath;
    }



    public String getFileContentType() {
        return fileContentType;
    }

    public void setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
    }

    public String getFileFileName() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String date = sdf.format(System.currentTimeMillis());
        return date + ".jpg";
    }

    public void setFileFileName(String fileFileName) {
        this.fileFileName = fileFileName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public String getFtpAddr() {
        return ftpAddr;
    }

    public void setFtpAddr(String ftpAddr) {
        this.ftpAddr = ftpAddr;
    }

    private void close(FileOutputStream fos, FileInputStream fis) {
        if (fis != null) {
            try {
                fis.close();
                fis=null;
            } catch (IOException e) {
                System.out.println("FileInputStream关闭失败");
                e.printStackTrace();
            }
        }
        if (fos != null) {
            try {
                fos.close();
                fis=null;
            } catch (IOException e) {
                System.out.println("FileOutputStream关闭失败");
                e.printStackTrace();
            }
        }
    }


    @Override
    public void setSession(Map<String, Object> map) {
        this.session = map;
    }

    /**
     *
     * @param path 上传到ftp服务器哪个路径下
     * @param addr 地址
     * @param port 端口号
     * @param username 用户名
     * @param password 密码
     * @return
     * @throws Exception
     */
    private  boolean connect(String path,String addr,int port,String username,String password) throws Exception {
        boolean result = false;
        ftp = new FTPClient();
        int reply;
        ftp.connect(addr,port);
        ftp.login(username,password);
        ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
        reply = ftp.getReplyCode();
        if (!FTPReply.isPositiveCompletion(reply)) {
            ftp.disconnect();
            return result;
        }
        ftp.changeWorkingDirectory(path);
        ftp.enterLocalPassiveMode();
        result = true;
        return result;
    }
    /**
     *
     * @param file 上传的文件或文件夹
     * @throws Exception
     */
    private void upload(File file) throws Exception{
        if(file.isDirectory()){
            ftp.makeDirectory(file.getName());
            ftp.changeWorkingDirectory(file.getName());
            String[] files = file.list();
            for (int i = 0; i < files.length; i++) {
                File file1 = new File(file.getPath()+"\\"+files[i] );
                if(file1.isDirectory()){
                    upload(file1);
                    ftp.changeToParentDirectory();
                }else{
                    File file2 = new File(file.getPath()+"\\"+files[i]);
                    FileInputStream input = new FileInputStream(file2);
                    ftp.storeFile(file2.getName(), input);
                    input.close();
                }
            }
        }else{
            File file2 = new File(file.getPath());
            FileInputStream input = new FileInputStream(file2);
            ftp.storeFile(file2.getName(), input);
            input.close();
        }
    }
}