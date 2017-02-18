package com.frost.action;

import com.opensymphony.xwork2.ActionSupport;
import org.apache.struts2.ServletActionContext;

import java.util.ArrayList;

import java.util.HashMap;
import java.util.Map;


/**
 * Created by fagle on 2016/7/13.
 */
public class ShopAction extends ActionSupport {
    static private ArrayList<String> shops=new ArrayList<String>(){{add("沙县小吃");
        add("黄焖鸡");
        add("衢府");
        add("高祖生煎");
        add("兰州拉面");
        add("余记烤饼");
        add("胖嫂牛肉面");
        add("雁之园");
        add("麦当劳");
        add("德克士");
        add("赛百味");
        add("千两");
        add("77好厨边");}};
    private String shop;
    private Map session;
    private Map request;
    private String resultShop;
    private String desc;
    private int id;
    private String name;
    static private Map<String, String> ip2name = new HashMap<String, String>();
    static private Map<String,String> chooseMap=new HashMap<String, String>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public static Map<String, String> getIp2name() {
        return ip2name;
    }

    public static void setIp2name(Map<String, String> ip2name) {
        ShopAction.ip2name = ip2name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public ShopAction() {
    }

    public Map getChooseMap() {
        return chooseMap;
    }

    public void setChooseMap(Map chooseMap) {
        this.chooseMap = chooseMap;
    }

    public Map getRequest() {
        return request;
    }

    public void setRequest(Map request) {
        this.request = request;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Map getSession() {
        return session;
    }

    public void setSession(Map session) {
        this.session = session;
    }

    public String getShop() {
        return shop;
    }

    public void setShop(String shop) {
        this.shop = shop;
    }

    public ArrayList<String> getShops() {
        return shops;
    }

    public void setShops(ArrayList<String> shops) {
        this.shops = shops;
    }

    public String getResultShop() {
        return resultShop;
    }

    public void setResultShop(String resultShop) {
        this.resultShop = resultShop;
    }

    @Override
    public String execute() {
        //session.put("shops", shops);
        return SUCCESS;
    }

    public String add() {
        if (shop!=null)
            System.out.println(shop);
        else
            return SUCCESS;
        if (shops!=null) {
            if (!shops.contains(shop)) {
                shops.add(shop);
            }
        }
        else
            shops.add(shop);
       // session.put("shops", shops);

        return SUCCESS;
    }
    public String rand() {
        String clientIp = ServletActionContext.getRequest().getRemoteAddr();
        int n = shops.size();
        if (n > 0) {
            double randret=Math.random();
            int index = (int)(randret*n) % n;
            resultShop = shops.get(index);
            desc="随机范围："+0+"-"+(n-1)+", 随机数："+ randret +",索引："+index+",您的IP：" + clientIp;
            chooseMap.put(clientIp, resultShop);
            if (!name.isEmpty())
                ip2name.put(clientIp, name);
        }

        return SUCCESS;
    }
    public String refresh() {
        return SUCCESS;
    }
    public String  delete() {
        if (id < shops.size())
            shops.remove(id);
        return SUCCESS;
    }
}
