import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "./confirmation";

const meta = {
  title: "AI Elements/Confirmation",
  component: Confirmation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Confirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Requested: Story = {
  args: {
    approval: { id: "1" },
    state: "approval-requested",
  },
  render: (args) => (
    <Confirmation {...args} className="w-100">
      <ConfirmationRequest>
        <ConfirmationTitle>
          Do you want to allow this action to run?
        </ConfirmationTitle>
        <ConfirmationActions>
          <ConfirmationAction variant="outline">Deny</ConfirmationAction>
          <ConfirmationAction>Approve</ConfirmationAction>
        </ConfirmationActions>
      </ConfirmationRequest>
    </Confirmation>
  ),
};

export const Accepted: Story = {
  args: {
    approval: { id: "1", approved: true },
    state: "approval-responded",
  },
  render: (args) => (
    <Confirmation {...args} className="w-100">
      <ConfirmationAccepted>
        <ConfirmationTitle>Action approved</ConfirmationTitle>
      </ConfirmationAccepted>
    </Confirmation>
  ),
};

export const Rejected: Story = {
  args: {
    approval: { id: "1", approved: false, reason: "User denied" },
    state: "approval-responded",
  },
  render: (args) => (
    <Confirmation {...args} className="w-100">
      <ConfirmationRejected>
        <ConfirmationTitle>Action denied by user</ConfirmationTitle>
      </ConfirmationRejected>
    </Confirmation>
  ),
};
