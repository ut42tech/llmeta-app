import type { Preview } from "@storybook/nextjs-vite";
import { Noto_Sans_JP, Roboto, Roboto_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import messages from "../src/i18n/messages/en.json";
import "../src/app/globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <div
          className={`${notoSans.variable} ${roboto.variable} ${robotoMono.variable}`}
        >
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
