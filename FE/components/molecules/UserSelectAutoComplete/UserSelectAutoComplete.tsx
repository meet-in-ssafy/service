import { ReactElement } from 'react';
import AsyncSelect from 'react-select/async';
import { getSearchUserListByNameAndEmail } from '@repository/filterRepository';
import { MemberOption } from '@utils/type';

const customStyles = {
  control: (base: any) => ({
    ...base,
    height: '45px',
  }),
  singleValue: (base: any) => ({
    ...base,
    height: '35px',
    lineHeight: '35px',
  }),
  menuList: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 101,
    marginTop: 0,
  }),
};

interface UserSelectAutoCompleteProps {
  handleChangeUserSelect: (newValue: MemberOption | null) => void;
  studentNumber: string;
  projectCode?: number;
}

export default function UserSelectAutoComplete({
  handleChangeUserSelect,
  studentNumber,
  projectCode = 101,
}: UserSelectAutoCompleteProps): ReactElement {
  const handleSelectChange = (newValue: MemberOption | null) => {
    handleChangeUserSelect(newValue);
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<MemberOption[]>((resolve) => {
      getSearchUserListByNameAndEmail(
        projectCode,
        studentNumber,
        inputValue,
      ).then(({ data: { data } }) => {
        resolve(
          data?.reduce(
            (acc, cur) => [
              ...acc,
              { ...cur, label: `${cur?.name}(${cur?.email})` },
            ],
            [],
          ),
        );
      });
    });

  return (
    <>
      <AsyncSelect
        cacheOptions
        loadOptions={promiseOptions}
        defaultOptions
        onChange={handleSelectChange}
        isClearable
        styles={customStyles}
      />
    </>
  );
}
