export interface Message {
  id?: string;
  text: string;
  senderId: string;
  timestamp: any; 
  isRead: boolean;
}