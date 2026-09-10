import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { deleteChat } from "@/services/chat/chat-history";

export const useDeleteChat = (onDeleted?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => deleteChat(chatId),

    onMutate: async (chatId: string) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.CHAT_HISTORY] });
      const previous = queryClient.getQueryData([QUERY_KEYS.CHAT_HISTORY]);

      if (previous) {
        queryClient.setQueryData([QUERY_KEYS.CHAT_HISTORY], (old: unknown) => {
          const data = old as { pages: { data: { id: string }[] }[] } | undefined;
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              data: page.data.filter((c) => c.id !== chatId),
            })),
          };
        });
      }

      return { previous };
    },

    onError: (_err, _chatId, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.CHAT_HISTORY], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_HISTORY] });
    },

    onSuccess: () => {
      onDeleted?.();
    },
  });
};
