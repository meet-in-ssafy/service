import { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Text, Icon } from '@atoms';
import { ReactTable, Button } from '@molecules';
import { AdminUserManageModal, AdminUserImportModal } from '@organisms';
import { getProjectUserTableData } from '@repository/adminRepository';
import { ModalWrapper } from '@organisms';
import { Project } from '@utils/type';

import AdminProjectUserDeleteModal from './AdminProjectUserDeleteModal';
import AdminProjectUserAddModal from './AdminProjectUserAddModal';

const Wrapper = styled.div`
  i {
    cursor: pointer;
  }

  .manage-header {
    display: flex;
    align-items: center;
    margin: 20px 0;
    justify-content: space-between;

    > div {
      display: inline-flex;
      align-items: center;
      > i {
        font-size: 30px;
      }
      > div {
        margin-right: 10px;
      }
    }

    .manage-header-import {
      > button {
        padding: 0 10px;
        box-shadow: none;
      }
    }
  }

  .region-btns {
    margin-bottom: 20px;
  }
`;

interface UserDataRow {
  completeYn: string | null;
  major: string;
  name: string;
  region: string;
  regist: string;
  role: string;
  studentClass: string;
  studentNumber: string;
  teamId: number | null;
  teamName: string | null;
}

interface AdminUserManageProps {
  project: Project;
}

export default function AdminProjectUserManage({
  project,
}: AdminUserManageProps) {
  const [teamStatusTableData, setTeamStatusTableData] = useState<UserDataRow[]>(
    [],
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editTarget, setEditTarget] = useState<UserDataRow>();

  useEffect(() => {
    getProjectUserTableData({
      projectId: project.id,
    }).then(({ data: { data } }) => {
      setTeamStatusTableData(data);
    });
  }, [project]);

  const handleSelectedRow = (row: { type: string; data: UserDataRow }) => {
    if (row.type === 'delete') {
      setShowDeleteModal(true);
      setEditTarget(row.data);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditTarget(undefined);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setEditTarget(undefined);
  };

  const deleteUser = () => {
    // TODO: 사용자 삭제 API 호출 후 사용자 목록 리렌더링
    console.log('DELETE USER');
    console.log(editTarget);

    closeDeleteModal();
  };

  const addUser = () => {
    // TODO: 사용자 추가 API 호출 후 사용자 목록 리렌더링
    console.log('ADD USER');
    console.log(editTarget);

    closeAddModal();
  };

  return (
    <Wrapper>
      <div className="manage-header">
        <div>
          <Text text="프로젝트 참여 교육생 목록" fontSetting="n26b" />
          <Icon iconName="add_box" func={() => setShowAddModal(true)} />
          <Icon
            iconName="settings_applications"
            func={() => setEditable(!editable)}
          />
        </div>

        <div className="manage-header-import">
          <Button
            title="import"
            func={() => setShowImportModal(true)}
            width="auto"
          />
        </div>
      </div>
      <ReactTable
        data={teamStatusTableData}
        columns={ADMIN_USER_TABLE_COLUMNS}
        selectable={{
          selectable: editable,
          type: { edit: false, delete: true },
        }}
        onSelectRow={handleSelectedRow}
        pagination={false}
      />

      {showImportModal && (
        <AdminUserImportModal
          handleClickClose={() => setShowImportModal(false)}
        />
      )}

      {showDeleteModal && editTarget && (
        <AdminProjectUserDeleteModal
          studnetName={editTarget.name}
          handleClickClose={closeDeleteModal}
          handleClickDelete={deleteUser}
        />
      )}

      {showAddModal && (
        <AdminProjectUserAddModal
          handleClickClose={closeAddModal}
          handleClickAdd={addUser}
        />
      )}
    </Wrapper>
  );
}

const ADMIN_USER_TABLE_COLUMNS = [
  {
    Header: '학번',
    accessor: 'studentNumber',
    disableGroupBy: true,
  },
  {
    Header: '이름',
    accessor: 'name',
    disableGroupBy: true,
  },
  {
    Header: '지역',
    accessor: 'region',
  },
  {
    Header: '반',
    accessor: 'studentClass',
  },
  {
    Header: '팀 유무',
    accessor: 'teamYn',
  },
  {
    Header: '팀 식별자',
    accessor: 'teamId',
  },
  {
    Header: '리더 여부',
    accessor: 'leaderYn',
  },
  {
    Header: '전공/비전공',
    accessor: 'major',
  },
  {
    Header: '희망 포지션',
    accessor: 'position',
  },
];