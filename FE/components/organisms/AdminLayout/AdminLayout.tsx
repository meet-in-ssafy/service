import { ReactElement, useState, useEffect } from 'react';
import styled from 'styled-components';

import {
  AdminMenuSidebarLeft,
  AdminTeamManage,
  AdminUserManage,
} from '@organisms';
import { Text } from '@atoms';
import { Project } from '@utils/type';
import { ADMIN_MENU_CONTENT } from '@utils/constants';
import { AdminProjectManage } from '@organisms';
import { AdminDashboard } from '@organisms';
import { getAdminProject } from '@repository/adminRepository';
import { DateTime } from 'luxon';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;

  .sidebar {
    flex: 0 0 200px;
  }

  .content {
    flex: auto;
    margin: 30px;
  }
`;

const defaultSelectedMenu = 2;

export default function AdminLayout(): ReactElement {
  const [selectedMenu, setSelectedMenu] = useState(defaultSelectedMenu);
  const [selectedProject, setSelectedProject] = useState<number>();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChangeMenu = (menuIndex: number) => {
    setSelectedMenu(menuIndex);
  };

  const handleChangeProject = (projectId: number) => {
    setSelectedProject(projectId);
  };

  const fetchProjects = () => {
    getAdminProject().then(({ data: { data } }) => {
      setProjects(
        data.map((p: any) => ({
          ...p,
          activeDate: p.activeDate
            ? DateTime.fromISO(p.activeDate).toFormat('yyyy-MM-dd')
            : null,
          startDate: p.startDate
            ? DateTime.fromISO(p.startDate).toFormat('yyyy-MM-dd')
            : null,
          endDate: p.endDate
            ? DateTime.fromISO(p.endDate).toFormat('yyyy-MM-dd')
            : null,
          name: `${p.stage.codeName} ${p.project.codeName} 프로젝트`,
        })),
      );
      setSelectedProject(data[data.length - 1].id);
    });
  };

  return (
    <Wrapper>
      {projects ? (
        <>
          <div className="sidebar">
            <AdminMenuSidebarLeft
              onChangeMenu={handleChangeMenu}
              onChangeProject={handleChangeProject}
              projects={projects}
              defaultSelectedMenu={defaultSelectedMenu}
            />
          </div>
          <div className="content">
            {
              {
                [ADMIN_MENU_CONTENT[0].id]: <div>전체 교육생 목록</div>,
                [ADMIN_MENU_CONTENT[1].id]: (
                  <AdminProjectManage
                    projects={projects}
                    fetchProjects={fetchProjects}
                  />
                ),
                [ADMIN_MENU_CONTENT[2].id]: selectedProject && (
                  <AdminDashboard projectId={selectedProject} />
                ),
                [ADMIN_MENU_CONTENT[3].id]: selectedProject && (
                  <AdminUserManage projectId={selectedProject} />
                ),
                [ADMIN_MENU_CONTENT[4].id]: selectedProject && (
                  <AdminTeamManage projectId={selectedProject} />
                ),
                [ADMIN_MENU_CONTENT[5].id]: <div>공지사항 관리</div>,
              }[ADMIN_MENU_CONTENT[selectedMenu].id]
            }
          </div>
        </>
      ) : (
        <div>
          <Text text="프로젝트를 가져오는데 실패했습니다." fontSetting="n20m" />
        </div>
      )}
    </Wrapper>
  );
}
