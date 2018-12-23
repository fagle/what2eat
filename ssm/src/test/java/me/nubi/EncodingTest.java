package me.nubi;

import me.nubi.utils.StringUtils;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EncodingTest {
    private static Logger logger = LoggerFactory.getLogger(EncodingTest.class);
    @Test
    public void testLogging() {
        logger.info("我能吞下玻璃而不伤身体。");

        StringUtils.isBlank("");
    }
}
