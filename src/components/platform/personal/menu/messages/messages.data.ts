export type MessageItem = {
  title: string;
  description: string;
};

// export async function getMessageItems(): Promise<MessageItem[]> {
export function getMessageItems() {
  return [
    {
      title: "Message 1",
      description: "Message Description",
    },
    {
      title: "Message 1",
      description: "Message Description",
    },
    {
      title: "Message 1",
      description: "Message Description",
    },
  ];
}
