package me.nubi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by fagle on 2017/7/17.
 */
@Controller("/")
public class DefaultController {

    @RequestMapping("/")
    public String index() {
        return "movie";
    }
}
