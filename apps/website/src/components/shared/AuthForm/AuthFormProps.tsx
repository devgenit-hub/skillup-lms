import { FormInputProps } from './FormInputProps';

export interface AuthFormProps {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  inputs?: FormInputProps[];
  isForgotPassword?: boolean;
  submitButtonText?: string;
  isTermsChecked?: boolean;
  bottomSubText?: string;
  bottomLinkText?: string;
  bottomLinkTo?: string;
}
