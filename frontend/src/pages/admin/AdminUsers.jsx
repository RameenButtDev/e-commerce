import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (u) => {
    try {
      await api.put(`/admin/users/${u._id}`, { isActive: !u.isActive });
      toast.success(u.isActive ? "User disabled" : "User enabled");
      load();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "customer" : "admin";
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      await api.put(`/admin/users/${u._id}`, { role: newRole });
      toast.success("Role updated");
      load();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="font-display font-700 text-xl mb-6">Users</h2>
      <div className="bg-white rounded-xl shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleRole(u)} className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(u)} className={`text-xs px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.isActive ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteUser(u._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
