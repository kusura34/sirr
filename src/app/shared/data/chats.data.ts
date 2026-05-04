export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  online: boolean;
  timestamp: Date;
  unreadCount: number;
}

export const CHATS: ChatItem[] = [
  {
    id: "1",
    name: "Александр Иванов",
    lastMessage: "Привет!",
    avatar: "images/avatar-placeholder.jpg",
    online: true,
    timestamp: new Date(),
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Kusura IT",
    lastMessage: "Новый пост!",
    avatar: "images/avatar-placeholder.jpg",
    online: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    unreadCount: 0,
  },
];
