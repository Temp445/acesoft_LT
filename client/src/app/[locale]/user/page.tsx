'use client';

import Header from '@/components/Header';
import { useEffect, useState, ChangeEvent } from 'react';
import AdminProtectedRoute from '@/components/ProtectedRoute';
// import { env } from "@/lib/env"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | string;
}

export default function UserDetailsDisplay() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${apiUrl}/api/users`);
        if (!res.ok) throw new Error('Failed to fetch users');

        const json = await res.json();
        setUsers(Array.isArray(json) ? json : json?.data || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Role update failed');

      const result = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: result.user.role } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <AdminProtectedRoute>
      <div>
        <Header />
        <div className="p-6 container mx-auto 2xl:mt-5 2xl:h-[400px] 2xl:px-10">
          <h1 className="text-2xl font-bold mb-4">Users List</h1>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="hidden md:flex px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>
                user && user.role ? (
                  <tr key={user._id} className="border-t">
                    <td className="hidden md:flex px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={user.role}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
                        aria-label="Role"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
