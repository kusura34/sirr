export interface Message {
  text: string;
  timestamp: Date;
  isMine: boolean; // true, если отправили вы
  isRead: boolean;
}