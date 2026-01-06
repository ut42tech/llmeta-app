import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MailIcon } from "lucide-react";
import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemDescription,
  QueueItemFile,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from "./queue";

const meta = {
  title: "AI Elements/Queue",
  component: Queue,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Queue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Queue className="w-100">
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel
            count={3}
            icon={<MailIcon className="size-4" />}
            label="messages"
          />
        </QueueSectionTrigger>
        <QueueSectionContent>
          <QueueList>
            <QueueItem>
              <div className="flex items-start gap-2">
                <QueueItemIndicator />
                <QueueItemContent>First message in queue</QueueItemContent>
              </div>
            </QueueItem>
            <QueueItem>
              <div className="flex items-start gap-2">
                <QueueItemIndicator completed />
                <QueueItemContent completed>Completed task</QueueItemContent>
              </div>
              <QueueItemDescription completed>
                This was finished yesterday
              </QueueItemDescription>
            </QueueItem>
            <QueueItem>
              <div className="flex items-start gap-2">
                <QueueItemIndicator />
                <QueueItemContent>Pending message</QueueItemContent>
              </div>
            </QueueItem>
          </QueueList>
        </QueueSectionContent>
      </QueueSection>
    </Queue>
  ),
};

export const WithFiles: Story = {
  render: () => (
    <Queue className="w-100">
      <QueueSection>
        <QueueSectionTrigger>
          <QueueSectionLabel count={2} label="attachments" />
        </QueueSectionTrigger>
        <QueueSectionContent>
          <QueueList>
            <QueueItem>
              <div className="flex items-start gap-2">
                <QueueItemIndicator />
                <QueueItemContent>Document with files</QueueItemContent>
              </div>
              <div className="mt-2 flex gap-2">
                <QueueItemFile>report.pdf</QueueItemFile>
                <QueueItemFile>data.xlsx</QueueItemFile>
              </div>
            </QueueItem>
          </QueueList>
        </QueueSectionContent>
      </QueueSection>
    </Queue>
  ),
};
