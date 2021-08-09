import { ReactElement, useRef, useEffect, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Session } from 'openvidu-browser';

import { ChatInput, ChatBubble } from '@molecules';

import { Chat, ChatNormal } from '@types/chat-type';
import { useAuthState } from '@store';

interface ChatRoomProps {
  isRtc?: boolean;
  isConnectStomp?: boolean;
  session?: Session | undefined;
  messageList: Chat[] & ChatNormal[] & any;
  setMessageList: any; // TODO: 추후 타입 정의
  handleClickSend: (msg: string) => Promise<void>;
  roomId?: number;
}

const Wrapper = styled.div<{ disabled: boolean }>`
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .chat-container {
    padding: 10px;
    width: calc(100% - 20px);
    overflow-y: scroll;
    overflow-x: none;
  }
  .chat-input {
    padding: 0 10px;
    width: calc(100% - 20px);
  }

  ${({ disabled }) => disabled && 'pointer-events: none; opacity: 0.3;'}
`;

export default function ChatRoom({
  isRtc = false,
  isConnectStomp = false,
  session,
  messageList,
  setMessageList,
  handleClickSend,
  roomId,
}: ChatRoomProps): ReactElement {
  const {
    user: { id },
  } = useAuthState();

  const chatBoxRef: any = useRef<HTMLInputElement>(null);

  const handleScrollToEnd = () => {
    chatBoxRef.current.scrollTo({
      top: chatBoxRef.current.scrollHeight - chatBoxRef.current.clientHeight,
      left: 0,
    });
  };

  useEffect(() => {
    return () => setMessageList([]);
  }, []);

  useEffect(() => {
    handleScrollToEnd();

    const interval = setInterval(() => {
      setMessageList([...messageList]);
    }, 60000);

    return () => clearInterval(interval);
  }, [messageList]);

  useEffect(() => {
    if (isRtc) {
      const mySession = session;
      mySession.on('signal:chat', handleScrollToEnd);
    }
  }, [session]);

  // type 때문에 억지로 Promise 반환
  const sendMessage = async (msg: string) => {
    await handleClickSend(msg);
    handleScrollToEnd();
  };

  return (
    <Wrapper disabled={!isRtc && !isConnectStomp}>
      <div className="chat-container" ref={chatBoxRef}>
        {isRtc
          ? messageList?.map(
              (
                { nickname, profileSrc, createAt, message, connectionId }: Chat,
                index: number,
              ) => (
                <ChatBubble
                  key={index}
                  userName={nickname}
                  profileSrc={profileSrc ? profileSrc : '/profile.png'}
                  time={
                    DateTime.now().diff(createAt).toMillis() < 60000
                      ? 'just now'
                      : createAt.toRelative()
                  }
                  message={message}
                  isMe={connectionId === session.connection.connectionId}
                />
              ),
            )
          : messageList
              .slice(-30)
              ?.map(
                (
                  {
                    create_date_time,
                    message,
                    sender_id,
                    sender_name,
                    type,
                  }: ChatNormal,
                  index: number,
                ) => (
                  <ChatBubble
                    key={index}
                    userName={sender_name}
                    profileSrc="/profile.png"
                    time={
                      Number(DateTime.now()) -
                        Number(DateTime.fromISO(create_date_time)) <
                      60000
                        ? 'just now'
                        : DateTime.fromISO(create_date_time).toRelative()
                    }
                    message={message}
                    isMe={sender_id === id}
                    func={sendMessage}
                    type={type}
                    roomId={roomId}
                  />
                ),
              )}
      </div>
      <div className="chat-input">
        <ChatInput func={sendMessage} />
      </div>
    </Wrapper>
  );
}
