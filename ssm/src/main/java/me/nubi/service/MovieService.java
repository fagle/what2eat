package me.nubi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
        File[] listFiles = f.listFiles((dir, name) -> name.endsWith(".mp4"));
        try {
            if (listFiles != null) {
                for (File a : listFiles) {
                    if (!a.getName().endsWith(".mp4"))
                        continue;
                    logger.info(a.getName());
                    //logger.info("你好呀");
                }
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

    public File getMovie(String fileName) {
        return new File(path + "/"  + fileName);
    }

    public List<String> getMovieList() {
        File f = new File(path);
        File[] listFiles = f.listFiles((dir, name) -> name.endsWith(".mp4"));
        List<String> fileNameList = new ArrayList<>();
        try {
            if (listFiles != null) {
                for (File a : listFiles) {
                    if (a.length() > Integer.MAX_VALUE)
                        continue;
                    fileNameList.add(a.getName());
                }
            }
            listFiles =  f.listFiles();
            if (listFiles != null) {
                for (File file :listFiles) {
                    if (file.isDirectory()) {
                        getMovieList(file.getPath(), fileNameList);
                    }

                }
            }

        } catch (Exception e) {
            logger.error("", e);
        }
        return fileNameList;
    }

    private void getMovieList(String relative_path, List<String> fileList) {
        logger.info(relative_path);
        File f = new File(relative_path);
        File[] mp4files = f.listFiles((dir, name) -> name.endsWith(".mp4"));
        if (mp4files != null) {
            List<File> list = Arrays.asList(mp4files);
            fileList.addAll(list.stream().filter(o->o.length() < Integer.MAX_VALUE).map(o -> f.getName() + "/" + o.getName()).collect(Collectors.toList()));
        }
    }
}
