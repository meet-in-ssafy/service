import { DateTime } from 'luxon';

export interface Chat {
  nickname: string;
  message: string;
  profileSrc: string;
  createAt: DateTime;
  connectionId: string | undefined;
}

export interface ChatNormal {
  create_date_time?: string;
  message?: string;
  sender_id?: string | number;
  sender_name?: string | number;
}