import axios from "axios";
import React, { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleBlock = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: newStatus } : u
      )
    );

   
    axios
      .patch(`http://localhost:3001/users/${id}`, { status: newStatus })
      .catch((err) => console.error("Error updating user:", err));
  };


  let userss = users.filter((e) => e.role === "user");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {userss.map((u, i) => (
              <tr
                key={u.id}
                className={`${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-3 border-b">{u.id}</td>
                <td className="p-3 border-b font-medium">{u.name}</td>
                <td className="p-3 border-b text-gray-600">{u.email}</td>
                <td className="p-3 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => toggleBlock(u.id, u.status)}
                    className={`px-4 py-2 rounded-lg font-medium shadow-md transition ${
                      u.status === "active"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {u.status === "active" ? "Block" : "Unblock"}
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

export default Users;
