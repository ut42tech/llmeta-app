import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const WAVEFORM_BARS = Array.from({ length: 12 }, (_, index) => index);

// Waveform is complex (uses audio tracks), so we create a simple visualization mock
const WaveformMock = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center gap-0.5", className)}>
    {WAVEFORM_BARS.map((bar) => (
      <div
        key={`waveform-bar-${bar}`}
        className="w-0.5 animate-pulse rounded-full bg-current"
        style={{
          height: `${Math.random() * 60 + 20}%`,
          animationDelay: `${bar * 50}ms`,
        }}
      />
    ))}
  </div>
);

// Standalone component for Storybook (original uses hooks/stores)
const CaptionWindowPreview = ({
  text,
  error,
  waitingText,
  isListening,
}: {
  text?: string;
  error?: string;
  waitingText: string;
  isListening: boolean;
}) => {
  return (
    <div className="relative">
      <Badge
        variant="secondary"
        className={cn(
          "flex max-w-sm items-center gap-2 px-2.5 py-1.5",
          "border-white/20 bg-white/50 backdrop-blur-md",
          error && "border-red-500/30 bg-red-500/20 text-red-900",
        )}
      >
        <div className="h-4 w-16 shrink-0 overflow-hidden rounded-full bg-white/50">
          {isListening && (
            <WaveformMock className="h-full w-full text-primary" />
          )}
        </div>

        <p className={cn("text-xs", !text && !error && "italic opacity-50")}>
          {error ?? text ?? waitingText}
        </p>
      </Badge>
    </div>
  );
};

const meta = {
  title: "HUD/Caption/CaptionWindow",
  component: CaptionWindowPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Transcribed text to display",
    },
    error: {
      control: "text",
      description: "Error message if any",
    },
    waitingText: {
      control: "text",
      description: "Text shown when waiting for speech",
    },
    isListening: {
      control: "boolean",
      description: "Whether actively listening",
    },
  },
} satisfies Meta<typeof CaptionWindowPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingForSpeech: Story = {
  args: {
    text: undefined,
    error: undefined,
    waitingText: "Waiting for speech...",
    isListening: false,
  },
};

export const Listening: Story = {
  args: {
    text: undefined,
    error: undefined,
    waitingText: "Listening...",
    isListening: true,
  },
};

export const WithTranscription: Story = {
  args: {
    text: "Hello, welcome to the metaverse!",
    error: undefined,
    waitingText: "Waiting for speech...",
    isListening: true,
  },
};

export const LongTranscription: Story = {
  args: {
    text: "This is a longer transcription that shows how the component handles multiple lines of text from the speech recognition system.",
    error: undefined,
    waitingText: "Waiting for speech...",
    isListening: true,
  },
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    text: undefined,
    error: "Microphone permission denied",
    waitingText: "Waiting for speech...",
    isListening: false,
  },
};

export const Japanese: Story = {
  args: {
    text: "メタバースへようこそ！",
    error: undefined,
    waitingText: "音声を待っています...",
    isListening: true,
  },
};
