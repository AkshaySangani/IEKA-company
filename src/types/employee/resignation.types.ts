export interface ApplyResignationProps {
  show: boolean;
  handleOpenClose: () => void;
  resignationId?: string;
  refreshData?: () => void;
}

export interface IResignationForm {
  userId: string;
  reason: string;
}

export interface IResignationErrors {
  reason?: string;
  lastWorkingDate?: string;
}