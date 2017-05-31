import org.junit.Assert;
import org.junit.Test;

import java.io.UnsupportedEncodingException;

/**
 * Created by Fagle on 2017/2/18 0018.
 */
public class BasicStringTest {
    @Test
    public void equalsTest() {
        String a="Hello World!";
        String b="Hello World!";
        String c=a;
        Assert.assertEquals(a, b);
        Assert.assertEquals(a, c);
        Assert.assertTrue(a == b);
        Assert.assertTrue(a == c);
        stringTest(a, b);

        b = "Hello World";
        b = b.concat("!");
        Assert.assertEquals(a, b);
        Assert.assertFalse(a == b);


        A a1 = new A("hello");
        A a2 = new A("hello");
        Assert.assertEquals(a1, a2);
        A a3 = a1;
        Assert.assertEquals(a1, a3);
        Assert.assertFalse( a1 == a2);
        Assert.assertTrue(a1 == a3);
    }

    private void stringTest(String a, String b) {
        String c=a;
        Assert.assertEquals(a, b);
        Assert.assertEquals(a, c);
        Assert.assertTrue(a == b);
        Assert.assertTrue(a == c);
    }

    private class A {
        private final String a;
        public A(String s) { a = s; }

        public String getA() {
            return a;
        }

        @Override
        public boolean equals(Object b) {
            if (b == a)
                return true;
            if (b == null)
                return false;
            if (b.getClass() != this.getClass())
                return false;
            A o = (A) b;
            return o.getA().equals(a);
        }
    }

    @Test
    public void arrayAddTest() {
        int[] a = new int[] {1, 2, 3};
        int[] b = new int[] {4, 5, 6};
        //int[] c= a+b; wrong!!
    }

    @Test
    public void encodeTest() {
        String a = "abd";
        try {
            String result = new String(a.getBytes("ISO-8859-1"), "GBK");
            System.out.println(result);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}
