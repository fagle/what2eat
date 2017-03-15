package com.frost;

import org.hibernate.SessionFactory;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by fagle on 2017/3/15.
 */
public class SpringTest {
    @Test
    public void springTest() {
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");
        ctx.getEnvironment().setActiveProfiles("production");
        ctx.refresh();
        SessionFactory service = (SessionFactory) ctx.getBean("sessionFactory");
        System.out.println(service.getClass());


        ctx.destroy();
    }
}
