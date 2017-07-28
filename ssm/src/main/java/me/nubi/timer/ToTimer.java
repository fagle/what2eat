package me.nubi.timer;

import java.util.Date;

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

	
	
	
	
	
	
}
