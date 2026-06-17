import { useEffect, useState } from 'react';
import api from '../services/api';

const ConflictsPage = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConflicts = async () => {
      try {
        const response = await api.get('/conflicts');
        setConflicts(response.data);
      } catch (err) {
        console.error('Failed to fetch conflicts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConflicts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Conflicts Explorer</h1>
          <p className="text-muted-foreground">Browse and filter the global database of conflicts.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-secondary-foreground">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Region</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">GDP Loss</th>
                <th className="p-4 font-medium">Cost of War</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-muted-foreground">Loading conflicts...</td>
                </tr>
              ) : conflicts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-muted-foreground">No conflicts found.</td>
                </tr>
              ) : (
                conflicts.map((conflict) => (
                  <tr key={conflict._id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="p-4 font-medium text-foreground">{conflict.name}</td>
                    <td className="p-4 text-muted-foreground">{conflict.region}</td>
                    <td className="p-4 text-muted-foreground">{conflict.type}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        conflict.status === 'Ongoing' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {conflict.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{conflict.gdpLoss ? `${conflict.gdpLoss}%` : 'N/A'}</td>
                    <td className="p-4 text-muted-foreground">{conflict.costOfWar ? `$${conflict.costOfWar.toLocaleString()}` : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConflictsPage;
