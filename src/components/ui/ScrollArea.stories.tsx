import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Separator } from "./separator";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

interface Artwork {
  artist: string;
  art: string;
}

const works: Artwork[] = [
  { artist: "Ornella Binni", art: "Sunrise" },
  { artist: "Tom Byrom", art: "Mountain View" },
  { artist: "Vladimir Malyutin", art: "Autumn Forest" },
  { artist: "Pawel Czerwinski", art: "Abstract Flow" },
];

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {works.map((work) => (
          <div key={work.artist} className="w-[150px] shrink-0">
            <div className="overflow-hidden rounded-md bg-muted h-[150px]" />
            <p className="mt-2 text-sm font-medium">{work.art}</p>
            <p className="text-xs text-muted-foreground">{work.artist}</p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
