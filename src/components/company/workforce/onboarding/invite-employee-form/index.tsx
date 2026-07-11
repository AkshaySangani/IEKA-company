import { useEffect, useRef, useState } from "react";
import DocumentDetails, { EmployeeDocument } from "./DocumentDetails";
import ExperienceDetails, { Experience } from "./ExperienceDetails";
import EducationDetails, { Education } from "./EducationDetails";
import ParentDetails from "./ParentDetails";
import PersonalDetails from "./PersonalDetails";
import AddressDetails from "./AddressDetails";
import BankDetails from "./BankDetails";
import Image from "../../../../common/image";
import Button from "../../../../common/button/Button";
import { getOnboardingCompanyInfo, inviteEmployee } from "../../../../../apis/workforce/onboardings.api";
import { useParams } from "react-router-dom";
import { regex } from "../../../../../constants/validation-regex";
import { documentValidationRules } from "../../../../../utils/document-validation-rules";
import { documentEnum, employeeDocuments } from "../../../../../types/common-types";
import PageLoader from "../../../../common/loader/PageLoader";

interface ICompanyInfo {
    _id: string;
    companyName: string;
    companyEmail: string;
    companyAddress: string;
    companyLogo: string;
}

const InviteEmployeeForm = () => {
  const params = useParams();
  const companyId = params?.id as string
  const formRef = useRef<HTMLFormElement>(null);

  const initialCompanyInfo: ICompanyInfo = {
    _id: "",
    companyName: "",
    companyEmail: "",
    companyAddress: "",
    companyLogo: "",
}
  const [companyInfo, setCompanyInfo] = useState<ICompanyInfo>(initialCompanyInfo)

  const [loading, setLoading] = useState<boolean>(false);
  // initial state
  const initialFormData = {
    companyId: companyId,

    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",

    gender: "",
    dob: "",
    bloodGroup: "",

    isMarried: "",
    isPhysicallyDisabled: "",

    address: "",
    permanentAddress: "",

    fatherName: "",
    fatherOccupation: "",
    fatherPhone: "",

    motherName: "",
    motherOccupation: "",
    motherPhone: "",

    accountHolderName: "",
    bankName: "",
    branchName: "",
    accountNo: "",
    confirmAccountNo: "",
    ifscCode: "",

    employeePhoto: null as File | null,
  };
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState<any>({});

  // dynamic states
  const initialEducations = [
    {
      organization: "",
      passingYear: "",
      marks: "",
      document: null,
    },
  ];
  const [educations, setEducations] = useState<Education[]>(initialEducations);

  const initialExperience = [
    {
      organization: "",
      designation: "",
      startDate: "",
      endDate: "",
      document: null,
    },
  ];
  const [experiences, setExperiences] =
    useState<Experience[]>(initialExperience);

  const initialDocuments = [
    {
      name: employeeDocuments.aadhaarCard,
      card: documentEnum.adhar,
      number: "",
      frontPhoto: null,
      backPhoto: null,
    },
    {
      name: employeeDocuments.panCard,
      card: documentEnum.pan,
      number: "",
      frontPhoto: null,
      backPhoto: null,
    },
    {
      name: employeeDocuments.drivingLicense,
      card: documentEnum.drivingId,
      number: "",
      frontPhoto: null,
      backPhoto: null,
    },
  ];
  const [documents, setDocuments] =
    useState<EmployeeDocument[]>(initialDocuments);

    useEffect(() => {
      if(companyId){
        fetchCompanyInfo()
      }
      // eslint-disable-next-line
    },[companyId]);

    const fetchCompanyInfo = async () => {
      const response = await getOnboardingCompanyInfo(companyId);
      if(response?.success){
        setCompanyInfo(response?.data)
      } else setCompanyInfo(initialCompanyInfo);
    }

  // handle change function
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    let fieldValue: any = value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // handle file change function
  const handleFileChange = (file: File | null, name: string) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };

  // add education
  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        organization: "",
        passingYear: "",
        marks: "",
        document: null,
      },
    ]);
  };

  // remove education
  const removeEducation = (index: number) => {
    setEducations((prev) => prev.filter((_, i) => i !== index));
  };

  // handle education change
  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string | File | null | number,
  ) => {
    const updated = [...educations];

    updated[index][field] = value as never;

    setEducations(updated);
  };

  // add experience
  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        organization: "",
        designation: "",
        startDate: "",
        endDate: "",
        document: null,
      },
    ]);
  };

  // remove experience
  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  // handle experience change
  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | File | null,
  ) => {
    const updated = [...experiences];

    updated[index][field] = value as never;

    setExperiences(updated);
  };

  // add document
  const addDocument = () => {
    // setDocuments((prev) => [
    //   ...prev,
    //   {
    //     card: "",
    //     number: "",
    //     file: null,
    //   },
    // ]);
  };

  // remove document
  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // handle document change
  const handleDocumentChange = (
    index: number,
    field: keyof EmployeeDocument,
    value: string | File | null,
  ) => {
    const updated = [...documents];

    updated[index][field] = value as never;

    setDocuments(updated);
  };

  // scroll to first error
  const scrollToFirstError = (errors: Record<string, any>) => {
    if (!formRef.current) return;

    const findFirstErrorKey = (
      obj: Record<string, any>,
      parentKey = "",
    ): string | null => {
      for (const key in obj) {
        const value = obj[key];
        const currentKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === "string" && value) {
          return currentKey;
        }

        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const nestedKey = findFirstErrorKey(value[i], `${currentKey}.${i}`);
            if (nestedKey) return nestedKey;
          }
        }

        if (value && typeof value === "object" && !Array.isArray(value)) {
          const nestedKey = findFirstErrorKey(value, currentKey);
          if (nestedKey) return nestedKey;
        }
      }

      return null;
    };

    const firstErrorKey = findFirstErrorKey(errors);

    if (!firstErrorKey) return;

    const field = formRef.current.querySelector(
      `[name="${firstErrorKey}"]`,
    ) as HTMLElement | null || formRef.current.querySelector(
    `[data-field="${firstErrorKey}"]`) as HTMLElement | null || document.getElementById(`field-${firstErrorKey}`) as HTMLElement | null;

    if (!field) return;

    field.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      field.focus();
    }, 300);
  };

  // validate personal details
  const validatePersonalDetails = () => {
    const newErrors: any = {};

    if (!formData.employeePhoto)
      newErrors.employeePhoto = "Employee Photo is required";

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";

    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!regex.email.test(formData.email)) {
      newErrors.email = "Invalid Email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!regex.phone.test(formData.phone)) {
      newErrors.phone = "Invalid Phone Number";
    }
    if (!formData.alternatePhone.trim()) {
      newErrors.alternatePhone = "Alternate Phone Number is required";
    } else if (formData.alternatePhone && !regex.phone.test(formData.alternatePhone)) {
      newErrors.alternatePhone = "Invalid Alternate Number";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.dob) newErrors.dob = "Date of Birth is required";

    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood Group is required";
    if (!formData.isMarried) newErrors.isMarried = "Marital Status is required";
    if (!formData.isPhysicallyDisabled) newErrors.isPhysicallyDisabled = "Physically Disabled is required";

    setErrors((prev: any) => ({
      ...prev,
      ...newErrors,
    }));

    return newErrors;
  };

  // validate address details
  const validateAddressDetails = () => {
    const newErrors: any = {};

    if (!formData.address.trim())
      newErrors.address = "Current Address is required";

    if (!formData.permanentAddress.trim())
      newErrors.permanentAddress = "Permanent Address is required";

    setErrors((prev: any) => ({
      ...prev,
      ...newErrors,
    }));

    return newErrors;
  };

  // validate document details

  const validateDocuments = () => {
    const errors: any[] = [];

    documents.forEach((doc, index) => {
      const currentError: any = {};

      const rule = documentValidationRules[doc.card];

      // Aadhaar required validation
      if (doc.card === "Aadhaar Card") {
        if (!doc.number.trim()) {
          currentError.number = "Aadhaar number is required";
        }

        if (!doc.frontPhoto) {
          currentError.frontPhoto = "Front photo is required";
        }

        if (!doc.backPhoto) {
          currentError.backPhoto = "Back photo is required";
        }
      }

      // Validate number format only if user entered something
      if (doc.number && rule && !rule.pattern.test(doc.number)) {
        currentError.number = rule.message;
      }

      errors[index] = currentError;
    });
    setErrors((prev: any) => ({
      ...prev,
      documents: errors,
    }));
    return errors;
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const personalErrors = validatePersonalDetails();
    const addressErrors = validateAddressDetails();
    const documentErrors = validateDocuments();
    const docErrors = documentErrors?.filter(ele => ele?.number || ele?.frontPhoto || ele?.backPhoto);
    const allErrors = {
        ...personalErrors,
        ...addressErrors,
        ...docErrors[0]
    };

    const hasErrors =
      Object.keys(personalErrors).length > 0 ||
      Object.keys(addressErrors).length > 0 ||
      Object.keys(docErrors[0]??{}).length > 0;

    if (hasErrors) {
      scrollToFirstError(allErrors);
      return;
    }

    setLoading(true);
    const payload = new FormData();

    // ===========================
    // Company
    // ===========================

    payload.append("companyId", formData.companyId);

    // ===========================
    // Personal Details
    // ===========================

    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("alternatePhone", formData.alternatePhone);
    payload.append("gender", formData.gender);
    payload.append("dob", formData.dob);
    payload.append("bloodGroup", formData.bloodGroup);
    payload.append("address", formData.address);
    payload.append("permanentAddress", formData.permanentAddress);

    payload.append("isMarried", formData.isMarried === "single" ? "true" : "false");

    payload.append(
      "isPhysicallyDisabled",
      formData.isPhysicallyDisabled === "yes" ? "true" : "false",
    );

    // ===========================
    // Parent
    // ===========================

    payload.append("fatherName", formData.fatherName);
    payload.append("fatherOccupation", formData.fatherOccupation);
    payload.append("fatherPhone", formData.fatherPhone);

    payload.append("motherName", formData.motherName);
    payload.append("motherOccupation", formData.motherOccupation);
    payload.append("motherPhone", formData.motherPhone);

    // ===========================
    // Bank
    // ===========================

    payload.append("accountNo", formData.accountNo);
    payload.append("ifscCode", formData.ifscCode);

    // ===========================
    // Employee Photo
    // ===========================

    if (formData.employeePhoto) {
      payload.append("profileImage", formData.employeePhoto);
    }

    // ===========================
    // Education
    // ===========================

    payload.append(
      "educations",
      JSON.stringify(
        educations.map((item) => ({
          organization: item.organization,
          passingYear: Number(item.passingYear),
          marks: Number(item.marks),
        })),
      ),
    );

    educations.forEach((item, index) => {
      if (item.document) {
        payload.append(`educations[${index}][document]`, item.document);
      }
    });

    // ===========================
    // Experience
    // ===========================

    payload.append(
      "experiences",
      JSON.stringify(
        experiences.map((item) => ({
          organization: item.organization,
          designation: item.designation,
          startDate: item.startDate,
          endDate: item.endDate,
        })),
      ),
    );

    experiences.forEach((item, index) => {
      if (item.document) {
        payload.append(`experiences[${index}][document]`, item.document);
      }
    });

    // ===========================
    // Documents
    // ===========================
    const employeeDocs = documents.filter((ele) => ele?.number);
    payload.append(
      "documents",
      JSON.stringify(
        employeeDocs?.map((ele) => ({
          card: ele?.card,
          cardNumber: ele?.number,
        })),
      ),
    );

    employeeDocs.forEach((item, index) => {
      if (item.frontPhoto) {
        payload.append(`documents[${index}][front]`, item.frontPhoto);
      }
      if (item.backPhoto) {
        payload.append(`documents[${index}][back]`, item.backPhoto);
      }
    });

    // ===========================
    // API
    // ===========================

    const response = await inviteEmployee(payload);

    if (response?.success) {
      handleResetForm()
    }
    setLoading(false);
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
      setDocuments(initialDocuments);
      setEducations(initialEducations);
      setExperiences(initialExperience);
      window.location.reload();
  }
  return (
    <div className="bg-[#ededed]">
      <div className="mx-[10%] content-card">
        <div className="flex flex-col justify-center items-center p-4 gap-3 bg-white">
          <div>
            <Image src={companyInfo?.companyLogo ? companyInfo?.companyLogo : undefined} width={100} height={100} />
          </div>
          <span>
            {companyInfo.companyAddress}
          </span>
        </div>
        <form
          ref={formRef}
          className="flex flex-col gap-3 bg-formBg p-3 relative"
          onSubmit={handleSubmit}
        >
            <PageLoader loading={loading}/>
          {/* Form fields would go here */}
          {/* Personal Details */}
          <PersonalDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
          />
          {/* Parent Details */}
          <ParentDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          {/* Address Details */}
          <AddressDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          {/* Bank Details */}
          <BankDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          {/* Education Details */}
          <EducationDetails
            educations={educations}
            errors={errors}
            handleEducationChange={handleEducationChange}
            addEducation={addEducation}
            removeEducation={removeEducation}
          />
          {/* Experience Details */}
          <ExperienceDetails
            experiences={experiences}
            errors={errors}
            handleExperienceChange={handleExperienceChange}
            addExperience={addExperience}
            removeExperience={removeExperience}
          />
          {/* Document Details */}
          <DocumentDetails
            documents={documents}
            errors={errors}
            handleDocumentChange={handleDocumentChange}
            addDocument={addDocument}
            removeDocument={removeDocument}
          />
          <div className="bg-transparent p-4">
            <div className="flex border-t p-4 justify-center gap-2">
              <Button name="Save" type="submit" size="sm" />
              <Button
                name="Cancel"
                variant="secondary"
                size="sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteEmployeeForm;
