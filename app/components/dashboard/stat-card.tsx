export function StatCard({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
      <div className={`${color} rounded-full p-3 text-white mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
} 