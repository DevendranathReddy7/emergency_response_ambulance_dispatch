import type { ChangeEvent } from "react";

export interface inputProps {
  type: string;
  placeholder: string;
  changeHandle: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  id: string;
  datatestid: string;
  errorMessage: string | undefined
}
