import ImageUpload from "../../../../common/image-upload";
import TextField from "../../../../common/text-field/TextField";
import { employeeDocuments } from "../../../../../types/common-types";

export interface EmployeeDocument {
  name: string;
  card: string;
  number: string;
  frontPhoto: File | null;
  backPhoto: File | null;
}

interface Props {
  documents: EmployeeDocument[];
  errors: any;
  addDocument: () => void;
  removeDocument: (index: number) => void;
  handleDocumentChange: (
    index: number,
    field: keyof EmployeeDocument,
    value: string | File | null,
  ) => void;
}

const DocumentDetails = ({
  documents,
  errors,
  addDocument,
  removeDocument,
  handleDocumentChange,
}: Props) => {
  return (
    <div className="bg-transparent p-4">
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        <h2 className="text-xl text-white font-semibold">Document Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4">
        {documents.map((ele: EmployeeDocument, index: number) => {
            const required = ele?.name === employeeDocuments.aadhaarCard;
            return (
          <>
            <TextField
              label={`${ele?.name} No.`}
              value={ele?.number}
              type={ele?.name === employeeDocuments.aadhaarCard ? "number":""}
              name="number"
              onChange={(e) =>
                handleDocumentChange(index, "number", e.target.value)
              }
              error={errors.documents?.[index]?.number}
              placeholder={`Enter ${ele?.name} No.`}
              required={required}
            />
            <ImageUpload
              name="frontPhoto"
              value={ele?.frontPhoto}
              onChange={(e) => handleDocumentChange(index, "frontPhoto", e)}
              error={errors.documents?.[index]?.frontPhoto}
              label={`${ele?.name} Photo (Front)`}
              required={required}
            />

            <ImageUpload
              name="backPhoto"
              value={ele?.backPhoto}
              onChange={(e) => handleDocumentChange(index, "backPhoto", e)}
              error={errors.documents?.[index]?.backPhoto}
              label={`${ele?.name} Photo (Back)`}
              required={required}
            />
          </>
        )})}
      </div>
    </div>
  );
};

export default DocumentDetails;
