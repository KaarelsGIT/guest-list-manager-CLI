export interface AppMessage {
  type: 'success' | 'warning' | 'error' | 'info';
  text: string;
  duration?: number;
  modal?: boolean;
}
