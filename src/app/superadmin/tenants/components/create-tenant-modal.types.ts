export type CreateTenantModalProps = {
  onClose: () => void;
  onSuccess: (details: { admin_email: string; invite_token: string }) => void;
};