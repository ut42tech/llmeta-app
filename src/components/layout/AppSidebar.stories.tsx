import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronUp, Home, LogOut, Settings, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";

// Standalone component for Storybook (original uses hooks)
const AppSidebarPreview = ({
  pathname,
  displayName,
  activeItem,
}: {
  pathname: string;
  displayName: string;
  activeItem?: string;
}) => {
  const navigationItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="h-150 w-full border">
        <Sidebar collapsible="icon" className="h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Project LLMeta</span>
                    <span className="text-muted-foreground text-xs">
                      AI Metaverse
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={
                          activeItem
                            ? activeItem === item.title
                            : pathname === item.url
                        }
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted font-medium text-sm">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {displayName}
                        </span>
                      </div>
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                    align="start"
                  >
                    <DropdownMenuItem>
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="mr-2 size-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

const meta = {
  title: "Layout/AppSidebar",
  component: AppSidebarPreview,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    pathname: {
      control: "text",
      description: "Current URL path",
    },
    displayName: {
      control: "text",
      description: "User display name",
    },
    activeItem: {
      control: "radio",
      options: ["Home", "Settings"],
      description: "Force active state on item",
    },
  },
} satisfies Meta<typeof AppSidebarPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pathname: "/",
    displayName: "Takuya",
    activeItem: "Home",
  },
};

export const Guest: Story = {
  args: {
    pathname: "/",
    displayName: "Guest",
    activeItem: "Home",
  },
};

export const SettingsActive: Story = {
  args: {
    pathname: "/settings",
    displayName: "Alice",
    activeItem: "Settings",
  },
};
