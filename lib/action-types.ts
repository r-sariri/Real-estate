export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export const emptyFormState: FormState = {};

export type AuthState = FormState;
