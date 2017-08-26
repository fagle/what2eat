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
import java.util.List;

@Controller
@RequestMapping("/movie")
public class MovieController {
    @Autowired
    private MovieService movieService;

    private static Logger logger = LoggerFactory.getLogger(MovieController.class);

    @RequestMapping("{name}")
    public void movie(@PathVariable("name") String name, HttpServletRequest request, HttpServletResponse response) {
        File file = movieService.getAMovie();
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
            OutputStream os = response.getOutputStream();
            FileInputStream fis = new FileInputStream(file);
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
            fis.close();
        } catch (IOException ie) {
            logger.debug(ie.getLocalizedMessage());
        } catch (Exception e) {
            logger.debug("", e);
        }
    }

    @ResponseBody
    public List list() {
        return movieService.getMovieList();
    }
}
