import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// Mock components that don't depend on hooks/stores
const JoinWorldDialogPreview = ({
  username,
  onJoin,
}: {
  username: string;
  onJoin?: () => void;
}) => {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="flex items-center gap-2 font-semibold text-lg">
          <svg
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Join world</title>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          Join World
        </h2>
        <p className="text-muted-foreground text-sm">
          Configure your identity before entering the virtual world.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-medium text-sm" htmlFor="username-input">
            Username
          </label>
          <input
            type="text"
            id="username-input"
            defaultValue={username}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            placeholder="Enter your username..."
            maxLength={20}
          />
        </div>

        <div>
          <p className="font-medium text-sm">Select Avatar</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border bg-muted hover:border-primary"
              >
                <span className="text-2xl">🧑</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
          <div className="flex items-start gap-2">
            <span className="text-amber-500">⚠️</span>
            <div>
              <p className="font-medium text-amber-500 text-sm">
                Privacy Notice
              </p>
              <p className="text-muted-foreground text-sm">
                This application sends data to external services.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-md bg-primary py-2 text-primary-foreground hover:bg-primary/90"
          onClick={onJoin}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const meta = {
  title: "World/JoinWorldDialog",
  component: JoinWorldDialogPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    username: {
      control: "text",
      description: "Initial username value",
    },
    onJoin: {
      action: "joined",
      description: "Called when user clicks continue",
    },
  },
} satisfies Meta<typeof JoinWorldDialogPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: "",
  },
};

export const WithUsername: Story = {
  args: {
    username: "Takuya",
  },
};

export const Japanese: Story = {
  args: {
    username: "たくや",
  },
};
