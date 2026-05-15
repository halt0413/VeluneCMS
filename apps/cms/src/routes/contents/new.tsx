import { useNavigate } from "@tanstack/react-router";
import { useCreateContentMutation } from "../../features/contentCreate/hooks/useCreateContentMutation";
import { NewContentPage } from "../../features/contentCreate/ui/NewContentPage/NewContentPage";

export function NewContentRoute() {
  const navigate = useNavigate();
  const createMutation = useCreateContentMutation();

  return (
    <NewContentPage
      isSubmitting={createMutation.isPending}
      onSubmit={async (payload) => {
        const created = await createMutation.mutateAsync(payload);
        await navigate({ to: "/contents/$id", params: { id: created.id } });
      }}
    />
  );
}
