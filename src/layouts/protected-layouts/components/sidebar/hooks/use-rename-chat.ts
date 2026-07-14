import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { updateChatTitle } from "@/services/chat/chat-history";

export const useRenameChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, title }: { chatId: string; title: string }) =>
      updateChatTitle(chatId, title),

    onMutate: async ({ chatId, title }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.CHAT_HISTORY] });
      const previous = queryClient.getQueryData([QUERY_KEYS.CHAT_HISTORY]);

      if (previous) {
        queryClient.setQueryData([QUERY_KEYS.CHAT_HISTORY], (old: unknown) => {
          const data = old as { pages: { data: { id: string; title: string }[] }[] } | undefined;
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              data: page.data.map((c) =>
                c.id === chatId ? { ...c, title } : c,
              ),
            })),
          };
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.CHAT_HISTORY], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_HISTORY] });
    },
  });
};
