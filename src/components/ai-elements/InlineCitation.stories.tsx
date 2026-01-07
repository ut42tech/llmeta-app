import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "./inline-citation";

const meta = {
  title: "AI Elements/InlineCitation",
  component: InlineCitation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InlineCitation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <p className="max-w-prose text-sm">
      This is some text with an{" "}
      <InlineCitation>
        <InlineCitationText>inline citation</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={["https://example.com"]} />
          <InlineCitationCardBody>
            <InlineCitationCarousel>
              <InlineCitationCarouselHeader>
                <InlineCitationCarouselPrev />
                <InlineCitationCarouselIndex />
                <InlineCitationCarouselNext />
              </InlineCitationCarouselHeader>
              <InlineCitationCarouselContent>
                <InlineCitationCarouselItem>
                  <InlineCitationSource
                    description="This is a description of the source"
                    title="Example Source"
                    url="https://example.com"
                  />
                  <InlineCitationQuote>
                    This is a quote from the source material.
                  </InlineCitationQuote>
                </InlineCitationCarouselItem>
              </InlineCitationCarouselContent>
            </InlineCitationCarousel>
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>{" "}
      that shows more details on hover.
    </p>
  ),
};

export const MultipleSources: Story = {
  render: () => (
    <p className="max-w-prose text-sm">
      According to multiple{" "}
      <InlineCitation>
        <InlineCitationText>research papers</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger
            sources={[
              "https://arxiv.org/paper1",
              "https://nature.com/paper2",
              "https://science.org/paper3",
            ]}
          />
          <InlineCitationCardBody>
            <InlineCitationCarousel>
              <InlineCitationCarouselHeader>
                <InlineCitationCarouselPrev />
                <InlineCitationCarouselIndex />
                <InlineCitationCarouselNext />
              </InlineCitationCarouselHeader>
              <InlineCitationCarouselContent>
                <InlineCitationCarouselItem>
                  <InlineCitationSource
                    title="First Paper"
                    url="https://arxiv.org/paper1"
                  />
                </InlineCitationCarouselItem>
                <InlineCitationCarouselItem>
                  <InlineCitationSource
                    title="Second Paper"
                    url="https://nature.com/paper2"
                  />
                </InlineCitationCarouselItem>
              </InlineCitationCarouselContent>
            </InlineCitationCarousel>
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      , this is true.
    </p>
  ),
};
