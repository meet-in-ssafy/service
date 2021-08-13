import { ReactElement, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import CountUp from 'react-countup';

import { Text } from '@atoms';
import {
  DashboardTable,
  TeamStatusBarChart,
} from '@molecules';

import { getChartData } from '@repository/adminRepository';

import {
  DUMMY_TABLE_COLUMNS,
  DUMMY_TABLE_DATA,
} from '@utils/dummy';

const COLOR_MAP = {
  COMPLETE: '#32CD32',
  NONE: '#FF8042',
  ONGOING: '#1E90FF',
};

const Wrapper = styled.div`
  i {
    cursor: pointer;
  }

  .team-status-chart {
    .chart-header {
      display: flex;
      align-items: center;
      margin: 20px 0;
      > div {
        margin-right: 10px;
      }
    }

    .chart-container {
      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: 1fr 3fr;

      .entire-chart {
        grid-row: 1 / 3;
        display: flex;
        justify-content: center;
      }

      .region-chart {
        grid-row: 1 / 2;
        grid-column: 2 / 3;

        display: flex;
        align-items: center;
        justify-content: center;

        > div {
          display: inline-block;
        }
      }

      .count-up-container {
        grid-row: 2 / 3;
        grid-column: 2 / 3;

        display: flex;
        gap: 100px;
        align-items: center;
        justify-content: center;
        position: relative;

        .count-up {
          > div {
            text-align: center;
          }

          .countup-ongoing {
            font-size: 52px;
            color: gainsboro;
            letter-spacing: -3px;
          }

          .countup-complete {
            font-size: 82px;
          }

          .tooltiptext {
            visibility: hidden;
            width: 60px;
            background-color: #3848a0;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;

            font-size: 12px;

            position: absolute;
            z-index: 1;
            bottom: 70%;
            margin-left: 75px;

            opacity: 0;
            transition: opacity 1s;

            ::after {
              content: '';
              position: absolute;
              top: 100%;
              left: 50%;
              margin-left: -5px;
              border-width: 5px;
              border-style: solid;
              border-color: black transparent transparent transparent;
            }
          }

          :hover .tooltiptext {
            visibility: visible;
            opacity: 1;
          }
        }
      }
    }
  }
`;

const TableWrapper = styled.div`
  margin-top: 30px;

  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid black;
  }

  table {
    border-spacing: 0;
    border: 1px solid gainsboro;

    th {
      border-bottom: 1px solid black;
    }

    tr:hover {
      td {
        background-color: #fafafa !important;
      }
    }

    th,
    td {
      margin: 0;
      padding: 10px;
      border-bottom: 1px solid gainsboro;
      border-right: 1px solid gainsboro;
      vertical-align: middle;

      // Each cell should grow equally
      width: 1%;
      &.collapse {
        width: 0.0000000001%;
      }
    }
  }
`;

interface AdminDashboardProps {
  projectId: number;
}

interface DashboardData {
  title: string;
  data: any;
}

interface DataItem {
  name: string;
  value: any;
}

export default function AdminDashboard({
  projectId,
}: AdminDashboardProps): ReactElement {
  const [regionTeamData, setRegionTeamData] = useState<any[]>();
  const [trackTeamData, setTrackTeamData] = useState<any[]>([]);

  // init data
  useEffect(() => {
    if (projectId) {
      getChartData({ projectId }).then(({ data: { data } }: any) => {
        const regionData = data.region
          .sort((a: DashboardData, b: DashboardData) =>
            a.title === '전국' ? -1 : 1,
          )
          .map(({ title, data }: DashboardData) => ({
            name: title,
            미소속: data.before,
            진행중: data.doing,
            완료: data.after,
          }));
        const trackData = data.track.map(({ title, data }: DashboardData) => ({
          title,
          data: [
            { name: '완료', value: data.afterTeam },
            { name: '진행중', value: data.doingTeam },
          ],
        }));

        setRegionTeamData(regionData);
        setTrackTeamData(trackData);
      });
    }
  }, []);

  const tableData = useMemo(() => {
    // TODO: 팀 테이블 정보 서버에서 받기
    return DUMMY_TABLE_DATA;
  }, []);

  const tableColumns = useMemo(() => {
    // TODO: 팀 테이블 칼럼 정보 서버에서 받기?
    const data = DUMMY_TABLE_COLUMNS.map((col) => {
      if (col.accessor === 'region') {
        return {
          ...col,
        };
      } else {
        return col;
      }
    });
    return data;
  }, []);

  return (
    <Wrapper>
      <div className="team-status-chart">
        <div className="chart-header">
          <Text text="팀 구성 현황" fontSetting="n26b" />
        </div>
        <div className="chart-container">
          {regionTeamData && regionTeamData.length > 0 && (
            <>
              <div className="entire-chart">
                <TeamStatusBarChart
                  data={regionTeamData.slice(0, 1)}
                  width={300}
                  height={500}
                  color={{
                    미소속: COLOR_MAP.NONE,
                    진행중: COLOR_MAP.ONGOING,
                    완료: COLOR_MAP.COMPLETE,
                  }}
                  legend={false}
                />
              </div>

              <div className="region-chart">
                <TeamStatusBarChart
                  data={regionTeamData.slice(1)}
                  width={800}
                  height={300}
                  color={{
                    미소속: COLOR_MAP.NONE,
                    진행중: COLOR_MAP.ONGOING,
                    완료: COLOR_MAP.COMPLETE,
                  }}
                />
              </div>
            </>
          )}

          <div className="count-up-container">
            {trackTeamData && trackTeamData.length > 0 && (
              <>
                {trackTeamData.map((each: any, idx: number) => (
                  <div key={idx} className="count-up">
                    <CountUp
                      end={
                        each.data.find(({ name }: DataItem) => name === '완료')
                          .value
                      }
                      duration={4}
                      useEasing
                      className="countup-complete"
                    />
                    <span className="countup-ongoing">
                      {' + '}
                      <CountUp
                        end={
                          each.data.find(
                            ({ name }: DataItem) => name === '진행중',
                          ).value
                        }
                        duration={4}
                        useEasing
                      />
                    </span>

                    <Text text={each.title} fontSetting="n16m" />
                    <span className="tooltiptext">
                      진행중
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <TableWrapper>
          <DashboardTable data={tableData} columns={tableColumns} />
        </TableWrapper>
      </div>
    </Wrapper>
  );
}
