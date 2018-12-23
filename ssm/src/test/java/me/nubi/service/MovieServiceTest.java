package me.nubi.service;

import com.alibaba.fastjson.JSON;
import me.nubi.config.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Application.class}, properties = {"application.properties"})
public class MovieServiceTest {

    @Autowired
    private MovieService movieService;
    private static Logger logger = LoggerFactory.getLogger(MovieService.class);

    @Test
    public void test_getMovieList () {
        List<String> list = movieService.getMovieList();
        logger.info(JSON.toJSONString(list));
    }
}
