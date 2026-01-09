import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Standalone component for Storybook (original uses hooks/supabase)
const DynamicBreadcrumbPreview = ({
  segments,
}: {
  segments: Array<{ label: string; href?: string; isCurrentPage: boolean }>;
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <Fragment key={`${segment.label}-${segment.href ?? "current"}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {segment.isCurrentPage ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const meta = {
  title: "Layout/DynamicBreadcrumb",
  component: DynamicBreadcrumbPreview,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    segments: {
      control: "object",
      description: "Breadcrumb segments",
    },
  },
} satisfies Meta<typeof DynamicBreadcrumbPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    segments: [{ label: "Home", href: "/", isCurrentPage: true }],
  },
};

export const WorldDetail: Story = {
  args: {
    segments: [
      { label: "Home", href: "/", isCurrentPage: false },
      { label: "World", href: "/world", isCurrentPage: false },
      { label: "Nagasaki University", href: undefined, isCurrentPage: true },
    ],
  },
};

export const InstanceLobby: Story = {
  args: {
    segments: [
      { label: "Home", href: "/", isCurrentPage: false },
      { label: "Instance", href: "/instance", isCurrentPage: false },
      { label: "Student Lounge", href: undefined, isCurrentPage: true },
    ],
  },
};

export const Settings: Story = {
  args: {
    segments: [
      { label: "Home", href: "/", isCurrentPage: false },
      { label: "Settings", href: undefined, isCurrentPage: true },
    ],
  },
};
