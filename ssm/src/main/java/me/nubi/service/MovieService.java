package me.nubi.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class MovieService {

    @Value("${movie.path}")
    private String path;

    public void setPath(String path) {
        this.path = path;
    }

    public File getAMovie() {
        File f = new File(path);
        File[] listFiles = f.listFiles((dir, name) -> name.endsWith(".mp4"));
        try {
            if (listFiles != null) {
                for (File a : listFiles) {
                    if (!a.getName().endsWith(".mp4"))
                        continue;
                    log.info(a.getName());
                    //logger.info("你好呀");
                }
            }
        } catch (Exception e) {
            log.error("", e);
        }

        if (listFiles != null) {
            if (listFiles.length > 0)
                return listFiles[0];
        }
        return null;
    }

    public File getMovie(String fileName) {
        return new File(path + "/" + fileName);
    }

    public List<String> getMovieList() {
        if (!path.endsWith("\\")) {
            path = path + "\\";
        }
        List<String> fileNameList = new ArrayList<>();
        try {
            getMovieList(path, fileNameList);
        } catch (Exception e) {
            log.error("", e);
        }
        return fileNameList;
    }

    private void getMovieList(String filePath, List<String> fileList) {
        File f = new File(filePath);
        File[] mp4files = f.listFiles((dir, name) -> name.endsWith(".mp4"));
        if (mp4files != null) {
            List<File> list = Arrays.asList(mp4files);
            fileList.addAll(list.stream()
                    .map(video -> video.getPath().replace(this.path, "")
                            .replace("\\", "/"))
                    .collect(Collectors.toList()));
        }
        File[] dirs = f.listFiles((dir, name) -> dir.isDirectory());
        if (dirs != null) {
            for (File file : dirs) {
                getMovieList(file.getPath(), fileList);
            }
        }
    }
}
