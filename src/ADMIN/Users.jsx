import React, { useState, useEffect } from "react";
import api from "../api";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, user: null });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users || res.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
      (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = async () => {
    if (!modal.user) return;
    
    try {
      const res = await api.patch(`/admin/users/${modal.user._id}/block`);
      
      const updatedUser = res.data.data;
      setUsers(users.map(u => (u._id === updatedUser._id ? updatedUser : u)));
      
      setModal({ show: false, user: null });
    } catch (err) {
      console.error("Block error:", err);
      alert("Failed to update user status");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Users...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Directory</h1>
            <p className="text-slate-500 text-sm">Manage access and monitor user status</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="p-4 font-bold text-xs uppercase tracking-wider">User</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Email</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-center">Status</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">ID: {u._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{u.email}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                        !u.isBlocked ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                      {!u.isBlocked ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setModal({ show: true, user: u })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${
                        !u.isBlocked 
                          ? "bg-white border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white" 
                          : "bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {!u.isBlocked ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-slate-400">No users found.</div>
          )}
        </div>
      </div>

      {modal.show && modal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl">
            <h3 className="text-center text-xl font-bold text-slate-800 mb-2">
              {!modal.user.isBlocked ? 'Block User?' : 'Unblock User?'}
            </h3>
            <p className="text-center text-slate-500 mb-8 text-sm">
              Are you sure you want to change access for <span className="font-bold text-slate-900">{modal.user.name}</span>?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleToggleBlock}
                className={`w-full py-3 rounded-xl text-white font-bold shadow-lg ${
                   !modal.user.isBlocked ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm
              </button>
              <button
                onClick={() => setModal({ show: false, user: null })}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;