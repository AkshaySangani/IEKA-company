const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex text-sm justify-between items-center gap-5 border-b border-gray-200 pb-2">
    <div className="text-grayText">{label}</div>

    <div className="font-normal text-right max-w-[300px] text-wrap truncate line-clamp-2">
      {value ? value : "-"}
    </div>
  </div>
);

export default DetailRow;