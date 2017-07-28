package me.nubi.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import me.nubi.model.UPermission;
import me.nubi.core.mybatis.page.Pagination;
import me.nubi.bo.UPermissionBo;

public interface PermissionService {

	int deleteByPrimaryKey(Long id);

	UPermission insert(UPermission record);

    UPermission insertSelective(UPermission record);

    UPermission selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(UPermission record);

    int updateByPrimaryKey(UPermission record);

	Map<String, Object> deletePermissionById(String ids);

	Pagination<UPermission> findPage(Map<String, Object> resultMap, Integer pageNo,
                                     Integer pageSize);
	List<UPermissionBo> selectPermissionById(Long id);

	Map<String, Object> addPermission2Role(Long roleId, String ids);

	Map<String, Object> deleteByRids(String roleIds);
	//根据用户ID查询权限（permission），放入到Authorization里。
	Set<String> findPermissionByUserId(Long userId);
}
