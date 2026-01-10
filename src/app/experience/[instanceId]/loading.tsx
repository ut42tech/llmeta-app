import { Spinner } from "@/components/ui/spinner";

export default function ExperienceLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <Spinner className="size-8 text-white" />
    </div>
  );
}
