package me.nubi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Component
public class MovieService {

    @Value("${movie.path}")
    private String path;

    public void setPath(String path) {
        this.path = path;
    }

    private static Logger logger = LoggerFactory.getLogger(MovieService.class);
    public File getAMovie() {
        File f = new File(path);
        File[] listFiles = f.listFiles();
        try {
            if (listFiles != null) {
                for (File a : listFiles)
                    logger.info(a.getName());
                logger.info("你好呀");
            }
        } catch (Exception e) {
            logger.error("", e);
        }

        if (listFiles != null) {
            if (listFiles.length > 0)
                return listFiles[0];
        }
        return null;
    }

    public List<String> getMovieList() {
        return new ArrayList<>();
    }
}
