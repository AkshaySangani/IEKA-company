interface DescriptionProps {
  value: React.ReactNode | string;
  className?: string;
}

const Description = ({
  value,
  className = "",
}: DescriptionProps) => {
  return (
    <div
      className={`line-clamp-2 text-sm text-gray-500 truncate overflow-hidden [overflow-wrap:anywhere] max-w-[200px] ${className}`}
    >
      {value}
    </div>
  );
};

export default Description;