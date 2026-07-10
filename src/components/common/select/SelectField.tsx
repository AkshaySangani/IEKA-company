import Select, {
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  value: any;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  isDisabled?: boolean;
  isMulti?: boolean;
  required?: boolean;
  onChange: (value: any) => void;
}

const SelectField = ({
  label,
  value,
  name,
  options,
  placeholder = "Select an option",
  error,
  isDisabled,
  isMulti,
  required,
  onChange,
}: SelectFieldProps) => {
  const customStyles: StylesConfig<SelectOption, boolean> = {
    control: (base, state) => ({
      ...base,
      minHeight: "20px",
      border: `1px solid ${state.isFocused ? "#5897fb" : "#aaa"}`,
      borderRadius: 0,
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: state.isFocused ? "#5897fb" : "#aaa",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "15px",
    }),

    placeholder: (base, state) => ({
  ...base,
  fontSize: "var(--font-sm)",
  fontWeight: 400,
  transition: "all 0.2s ease",
  transform: state.isFocused ? "translateX(8px)" : "translateX(0)",
  opacity: state.isFocused ? 0.7 : 1,
}),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),

    menu: (base) => ({
      ...base,
      marginTop: 0,
      borderRadius: 0,
      border: "1px solid #c8c8c8",
      boxShadow: "none",
      overflow: "hidden",
      zIndex: 9999,
    }),

    menuList: (base) => ({
      ...base,
      padding: 0,
    }),

    option: (base, state) => ({
      ...base,
      fontSize: "var(--font-sm)",
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#5897fb"
        : state.isFocused
        ? "#f5f9ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "inherit",
      "&:active": {
        backgroundColor: "#5897fb",
      },
      "&:hover": {
        color: "#fff",
        backgroundColor: "#5897fb",
      },
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#8a8a8a",
      "&:hover": {
        color: "#8a8a8a",
      },
    }),

    clearIndicator: (base) => ({
      ...base,
      cursor: "pointer",
    }),
  };

  return (
    <div id={`field-${name}`}>
       {label && (
        <label className="mb-2 block text-sm font-medium leading-4 text-inputLabel">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      <Select
        options={options}
        value={value}
        placeholder={placeholder}
        isSearchable
        isClearable
        isDisabled={isDisabled}
        isMulti={isMulti}
        styles={customStyles}
        onChange={(
          option: SingleValue<SelectOption> | MultiValue<SelectOption>
        ) => onChange(option || "")}
      />

      {error && (
        <div className="mt-1 text-xs text-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default SelectField;