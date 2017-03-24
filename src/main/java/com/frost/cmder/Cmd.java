package com.frost.cmder;

/**
 * Created by fagle on 2017/3/13.
 */
public class Cmd{

    public void execCommand(String[] arstringCommand) {
        for (int i = 0; i < arstringCommand.length; i++) {
            System.out.print(arstringCommand[i] + " ");
        }
        try {
            Runtime.getRuntime().exec(arstringCommand);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    public void execCommand(String arstringCommand) {

    }

    public void cmd(){

    }

    public static void main(String[] args){
        String cmd =  "cmd /k start test.bat";
        try {
            Runtime.getRuntime().exec(cmd);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}