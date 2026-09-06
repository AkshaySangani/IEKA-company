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
      className={`line-clamp-2 text-sm text-gray-500 truncate overflow-hidden text-wrap max-w-[200px] ${className}`}
    >
      {value ? value : '-'}
    </div>
  );
};

export default Description;