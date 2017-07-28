package me.nubi.core.shiro.cache;

import me.nubi.core.shiro.session.ShiroSessionRepository;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.Collection;

/**
 * Created by fagle on 2017/7/5.
 */
public class EhcacheShiroSessionRepository implements ShiroSessionRepository {

    @Autowired
    private SessionDAO sessionDAO;

    @Override
    public void saveSession(Session session) {
        Session s = sessionDAO.readSession(session.getId());
        if (null == s)
            sessionDAO.create(session);
        else
            sessionDAO.update(session);
    }

    @Override
    public void deleteSession(Serializable sessionId) {
        Session s = sessionDAO.readSession(sessionId);
        sessionDAO.delete(s);
    }

    @Override
    public Session getSession(Serializable sessionId) {
        return sessionDAO.readSession(sessionId);
    }

    @Override
    public Collection<Session> getAllSessions() {
        return sessionDAO.getActiveSessions();
    }
}
