package me.nubi.controller;

import me.nubi.service.MovieService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRange;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;

    private static Logger logger = LoggerFactory.getLogger(MovieController.class);

    @ResponseBody()
    @RequestMapping("list")
    public Map list() {
        Map<String, Object> map = new HashMap<>();
        map.put("list", movieService.getMovieList());
        return map;
    }

    @RequestMapping("{name}")
    public void movie(@PathVariable("name") String name, HttpServletRequest request, HttpServletResponse response) {
        File file = movieService.getMovie(name);
        ServletServerHttpRequest req = new ServletServerHttpRequest(request);
        List<HttpRange> ranges = req.getHeaders().getRange();
        HttpRange range = ranges.size() > 0 ? ranges.get(0) : null;
        long start = 0;
        long fileLen = file.length();
        long end = fileLen -1;
        if (range != null) {
            start = range.getRangeStart(fileLen);
            end = range.getRangeEnd(fileLen);
        }
        response.setContentType("video/mp4; charset=utf-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Accept-Ranges", "bytes");
        FileInputStream fis = null;
        OutputStream os = null;
        try {
            //response.setHeader("Content-Disposition", "attachment;filename=" + new String(file.getName().getBytes(), "ISO8859-1"));
            if (start == 0) {
                response.setStatus(200);
            } else {
                response.setStatus(206);
            }
            response.setContentLength((int)(end - start + 1));
            response.setHeader("Content-Range", "bytes " + start +
                    "-" + end + "/" + fileLen);
            os = response.getOutputStream();
             fis = new FileInputStream(file);
            byte[] buf = new byte[1024];
            int len;
            long i = 0;
            fis.skip(start);
            while ((len = fis.read(buf)) > 0) {
                if (i + len > end)
                    len = (int) (end - i + 1);
                os.write(buf, 0, len);
                i += len;
                if (i > end)
                    break;
            }
            os.flush();
            os.close();
        } catch (IOException ie) {
            logger.debug(ie.getLocalizedMessage());

        } catch (Exception e) {
            logger.debug("", e);
        } finally {
            try {
                if (fis!=null)
                    fis.close();
            } catch (IOException e) {
                logger.error("", e);
            }
        }
    }


}
