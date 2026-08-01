interface IBranchDepartmentInfoProps {
  branch: {
    name: string;
  };
  shift: {
    name: string;
    startTime: string;
    endTime: string;
  };
  department: {
    name: string;
  };
}
export default function BranchDepartmentInfo({
  branch,
  shift,
  department,
}: IBranchDepartmentInfoProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-2 h-2 w-2 rounded-full bg-gray-700" />

      <div className="flex-1">
        <span className="text-sm font-medium text-primary">{branch?.name}</span>

        <p className="text-xs text-gray-500">
          {shift?.name} ({shift?.startTime} to {shift?.endTime})
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <span
            key={department.name}
            className="rounded bg-pendingLight px-3 py-1 text-xs text-gray-600"
          >
            {department.name}
          </span>
        </div>
      </div>
    </div>
  );
}
