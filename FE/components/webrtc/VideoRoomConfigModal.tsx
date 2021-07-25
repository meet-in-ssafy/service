import { MouseEventHandler, ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalWrapper from '../organisms/Modal/ModalWrapper';
import { OpenVidu, StreamManager } from 'openvidu-browser';

import { Button, Label } from '@molecules';
import { Icon, Input } from '@atoms';
import { OpenViduVideoComponent } from 'components/webrtc';

import { LoggerUtil } from './util/LoggerUtil';
import { DevicesUtil } from './util/DeviceUtil';
import { Util } from './util/Util';
import { IDevice, CameraType } from './types/device-type';

interface VideoRoomConfigModalProps {
  OV: OpenVidu;
  sessionTitle: string;
  handlerClose: MouseEventHandler;
  // TODO: Button 컴포넌트 func 타입 변경 MouseEventHandler
  handlerJoin: any;
}

const SessionTitle = styled.span`
  ${({
  theme: {
    font: { n20m },
  },
}) => n20m}
  margin: 10px 0;
`;

const GridContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-areas:
		"header header"
		"camera config"
		"footer footer";

  .modal-header {
    grid-area: header;
    text-align: center;
    margin: 30px 10px 20px;
  }

  .self-video {
    grid-area: camera;
    width: 320px;
    height: 240px;
    margin: 10px;
  }

  .video-config {
    grid-area: config;
    width: 320px;
    height: 240px;
  }
  
  .modal-footer {
    grid-area: footer;
    text-align: center;
    margin: 20px 10px 30px;
  }
`;

const CloseBtn = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;

  i {
    font-size: 30px;
    cursor: pointer;
  }
`;

const IconsAndInputs = styled.div`
  display: grid;
  grid-template-columns: 60px auto;
  grid-template-rows: 1fr 1fr 1fr;
  align-items: center;

  input {
    margin: 0;
    width: 100%;
  }

  i {
    justify-self: center;
    font-size: 32px;
  }
`;

export default function VideoRoomConfigModal({
  OV,
  sessionTitle,
  handlerClose,
  handlerJoin,
}: VideoRoomConfigModalProps): ReactElement {
  let loggerUtil: LoggerUtil;
  let util: Util;
  let devicesUtil: DevicesUtil;

  const [cameras, setCameras] = useState<IDevice[]>();
  const [microphones, setMicrophones] = useState<IDevice[]>();
  const [camSelected, setCamSelected] = useState<IDevice>();
  const [micSelected, setMicSelected] = useState<IDevice>();
  const [streamManager, setStreamManager] = useState<StreamManager>();

  useEffect(() => {
    (async function init() {
      loggerUtil = new LoggerUtil();
      util = new Util();

      devicesUtil = new DevicesUtil(
        OV,
        loggerUtil,
        util
      );

      await devicesUtil.initDevices();
      setDevicesInfo();
    })();

  }, []);

  const setDevicesInfo = () => {
    const cams = devicesUtil.getCameras();
    const mics = devicesUtil.getMicrophones();
    setMicrophones([...mics]);
    setCameras([...cams]);
  }

  const handleCameraChange = () => {
    // TODO: 선택한 카메라 미리보기
  }

  return (
    <ModalWrapper modalName="videoConfigModal">
      <GridContainer>
        <div className="modal-header">
          <SessionTitle>
            {sessionTitle}
          </SessionTitle>
        </div>
        <CloseBtn onClick={handlerClose}>
          <Icon iconName="highlight_off" color="indianred" />
        </CloseBtn>

        <div className="self-video">
          {streamManager !== undefined && (
            <OpenViduVideoComponent streamManager={streamManager} />
          )}
        </div>

        <div className="video-config">
          <IconsAndInputs>
            <Icon iconName="account_circle" color="gray" />
            <Label text="Nickname">
              <Input
                type="text"
                value="meet-in-ssafy"
                width="230px"
                readOnly={true}
              />
            </Label>
            <Icon iconName="mic" color="gray" />
            <Label text="Microphone">
              <select>
                {microphones?.map((mic, i) => (
                  <option key={i} value={mic.label}>{mic.label}</option>
                ))}
              </select>
            </Label>
            <Icon iconName="videocam" color="gray" />
            <Label text="Camera">
              <select onChange={handleCameraChange}>
                {cameras?.map((cam, i) => (
                  <option key={i} value={cam.label}>{cam.label}</option>
                ))}
              </select>
            </Label>
          </IconsAndInputs>
        </div>
        <div className="modal-footer">
          <Button title="JOIN" func={handlerJoin} />
        </div>

      </GridContainer>
    </ModalWrapper>
  );
}