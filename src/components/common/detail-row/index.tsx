const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex text-sm justify-between items-center gap-5 border-b border-gray-200 pb-3">
    <div className="text-gray-700">{label}</div>

    <div className="font-normal text-right max-w-[300px] line-clamp-2 break-words">
      {value}
    </div>
  </div>
);

export default DetailRow;