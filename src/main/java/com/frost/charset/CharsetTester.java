package com.frost.charset;

import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.Set;
/**
 * @author justfly
 *
 */
public class CharsetTester {
    public static void main(String[] args) {
        Set names=Charset.availableCharsets().keySet();
        for (Iterator iter = names.iterator(); iter.hasNext();) {
            String charsetName = (String) iter.next();
            if(Charset.isSupported(charsetName)){
                System.out.println(charsetName);
            }
        }
    }
}