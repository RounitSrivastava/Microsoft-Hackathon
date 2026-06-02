import { employees } from "@/data/employees";

export default function EmployeeTable() {
  return (
    <div className="grid grid-cols-3 gap-5">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="bg-slate-800 p-6 rounded-2xl"
        >
          <h3 className="text-white text-xl font-bold">
            {employee.name}
          </h3>

          <p className="text-slate-400 mt-2">
            Tasks: {employee.tasks}
          </p>

          <p className="text-red-400 mt-2">
            Workload: {employee.workload}%
          </p>
        </div>
      ))}
    </div>
  );
}