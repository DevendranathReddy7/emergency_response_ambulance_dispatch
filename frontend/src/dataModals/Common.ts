import type { ChangeEvent } from "react";

export interface inputProps {
  //type: string;
  // placeholder: string;
  changeHandle: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  label: string
  id: string;
  datatestid: string;
  error?: boolean;
  helperText?: string
  //errorMessage: string | undefined
}

export interface dropDownProps {
  name: string;
  menuItems: string[];
  fieldName: string;
  error?: boolean,
  helperText?: string
  selectHandle: (e: ChangeEvent<HTMLSelectElement>) => void
}

export interface UIErrors {
  [key: string]: { error: boolean; message: string };
}

export interface buttonProps {
  variant: 'contained' | 'outlined' | 'text'
  btnType: 'submit' | 'button'
  children: React.ReactNode
  handleBtnClick: () => void
}