package me.nubi.controller;

import me.nubi.service.MovieService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * Created by fagle on 2017/7/17.
 */
@Controller
@RequestMapping("/")
public class DefaultController {

    @Autowired
    private MovieService movieService;

    private static Logger logger = LoggerFactory.getLogger(DefaultController.class);

    @RequestMapping("/")
    public String index(Map<String, Object> model) {
        try {
            model.put("file", movieService.getAMovie().getName());
        } catch (Exception e) {
            logger.error("", e);
        }
        return "movie-list";
    }


}
