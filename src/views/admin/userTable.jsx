import { useState, useEffect } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { auth } from '../../firebase.config';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button  } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const database = getDatabase();
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      const usersData = snapshot.val();

      if (usersData) {
        const usersList = Object.entries(usersData).map(([uid, userData], index) => ({
          serialNo: index + 1,
          name: userData.name,
          role: userData.role,
          email: userData.email || auth.currentUser.email,
          uid,
        }));
        setUsers(usersList);
        setFilteredUsers(usersList);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchTerm, users]);

  const handleDelete = async (uid) => {
    const database = getDatabase();
    const userRef = ref(database, `users/${uid}`);
    await remove(userRef);
    setUsers(users.filter(user => user.uid !== uid));
    setConfirmDelete(null);
  };

  const handleEdit = (uid) => {
    navigate(`/edit-user/${uid}`);
  };

  return (
    <>
      <Card>
    <CardContent>
    <div className='flex mt-4 justify-between'>
    <CardTitle className="px-2 py-2">Existing Users</CardTitle>
          <div className="mb-4 text-black">
            <Input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-[400px] my-2 border rounded mr-2"
            />
          </div>
    </div>
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg shadow-md">
              <thead>
                <tr className="text-black">
                  <th className="py-3 px-4 text-left">Serial No.</th>
                  <th className="py-3 px-4 text-left">User ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b border-gray-300">{user.serialNo}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{user.uid}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{user.name}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{user.role}</td>
                    <td className="py-3 px-4 border-b border-gray-300">{user.email}</td>
                    <td className="border-b border-gray-300">
                      <Button className="ml-2" variant="outline" onClick={() => handleEdit(user.uid)}>Edit</Button>
                      <Button className="ml-2" variant="outline" onClick={() => setConfirmDelete(user.uid)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded">
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="outline" onClick={() => handleDelete(confirmDelete)}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserTable;
