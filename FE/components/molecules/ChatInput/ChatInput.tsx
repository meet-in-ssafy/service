import {
  ReactElement,
  useRef,
  useState,
  useEffect,
  KeyboardEvent,
} from 'react';
import styled from 'styled-components';
import { Button } from '@molecules';
import { Textarea, Text } from '@atoms';

interface ChatInputProps {
  func: (data: string) => Promise<void>;
}

const Wrapper = styled.div`
  ${({ theme: { flexCol } }) => flexCol()}

  .container {
    ${({ theme: { flexCol } }) => flexCol()}

    width: 100%;
    height: 100%;

    border-radius: 5px;
    border: 1px solid black;

    > textarea {
      width: calc(100% - 15px);

      padding: 5px 5px;

      white-space: pre;

      resize: none;
      border: none;
      outline: 0px none transparent;

      ${({
        theme: {
          font: { n12m },
        },
      }) => n12m}
    }
  }
  .bottom {
    position: relative;

    height: 20px;
    width: 100%;

    > div:first-child {
      position: absolute;
      right: 50px;
      bottom: 5px;
    }
    > button {
      position: absolute;
      right: 5px;
      bottom: 5px;

      height: 20px;

      > div {
        ${({
          theme: {
            font: { n10m },
          },
        }) => n10m}
      }

      box-shadow: none;
      border-radius: 5px;
    }
  }
`;

export default function ChatInput({ func }: ChatInputProps): ReactElement {
  const chatInputRef: any = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');

  const handleSend = async () => {
    if (message.length === 0) return;
    await func(message);
    setMessage('');
  };

  useEffect(() => {
    chatInputRef.current.focus();
  }, []);

  return (
    <Wrapper>
      <div className="container">
        <Textarea
          ref={chatInputRef}
          value={message}
          onKeyPress={(e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key == 'Enter' && e.shiftKey) {
              e.preventDefault();
              return setMessage((prev) => prev + '\n');
            }
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          onChange={({ target: { value } }: KeyboardEvent<HTMLDivElement>) =>
            setMessage(value)
          }
          maxLength={119}
          resize="none"
        />
        <div className="bottom">
          <Text
            text={message.length + ' / 120'}
            fontSetting="n12m"
            color="gray"
          />
          <Button title="전송" func={() => handleSend()} width="40px" />
        </div>
      </div>
    </Wrapper>
  );
}
