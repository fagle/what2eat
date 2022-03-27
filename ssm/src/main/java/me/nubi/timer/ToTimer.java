package me.nubi.timer;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import me.nubi.service.RoleService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


/**
 * 定时任务恢复数据
 *
 */
@Component
public class ToTimer{

	public static final long TWO_HOURS_MILLS = 2 * 60 * 60 * 1000;

	@Resource
    RoleService roleService;
	@Scheduled(cron = "0/20 * * * * ? ")
	public void run() {
		/**
		 * 调用存储过程，重新创建表，插入初始化数据。
		 */
		roleService.initData();
		System.out.println(new Date().getTime());
	}


	@Scheduled(fixedRate = TWO_HOURS_MILLS)
	public void scanMoviesToDb() {

	}
	
	
	
	
	
}
