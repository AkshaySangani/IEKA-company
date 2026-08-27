export interface ApplyResignationProps {
  show: boolean;
  handleOpenClose: () => void;
  resignationId?: string;
}

export interface IResignationForm {
  userId: string;
  lastWorkingDate: string;
  reason: string;
}

export interface IResignationErrors {
  reason?: string;
  lastWorkingDate?: string;
}