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
  readOnly?: boolean
  //errorMessage: string | undefined
}

export interface dropDownProps {
  name: string;
  menuItems: string[];
  fieldName: string;
  error?: boolean,
  helperText?: string
  value: string
  selectHandle: (event: ChangeEvent<HTMLSelectElement>) => void;
  //(event: SelectChangeEvent)
}

export interface UIErrors {
  [key: string]: { error: boolean; message: string };
}

export interface buttonProps {
  variant: 'contained' | 'outlined' | 'text' | 'danger'
  btnType: 'submit' | 'button'
  children: React.ReactNode
  handleBtnClick?: (val: any) => void
  disable?: boolean
}

export interface AmbulanceData {
  _id: string;
  vehicleNumber: string;
  ambulanceType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserState {
  name: string;
  email: string;
  gender: string;
  mobile: string;
  address: string;
  role: string;
  age: string;
}

export interface LoginState {
  email: string;
  password: string
}


export interface ModalProps {
  isOpen: boolean
  handleModal: (status: boolean) => void
  confirmContent: {
    title: string,
    content: string,
    buttons: string[]
  }
  handleConfirmation: () => void
}

export interface PaginationProps {
  pagination: {
    totalResults: number,
    totalPages: number,
    pageSize: number,
    currentPage: number
  }
  updatePage: (val: number) => void
  prevNext: (val: number) => void

}

export interface TableProps {
  data: {
    'Patient name': string | undefined,
    'Emergency type': string,
    'Incident location': string | undefined,
    Status: string,
    Priority: string,
    'Ambulance assigned': string,
    Date: string,
    Actions: string[],
    id: string
  }[]
  updateDetails?: (val: string) => void
  deleteDetails?: (val: string) => void
}

export interface LoaderProps {
  size: number
  thickness: number
  fullScreen: boolean
  msg: string
}