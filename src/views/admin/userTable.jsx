import { useState, useEffect } from 'react';
import { getDatabase, ref,  get } from 'firebase/database';
import { auth } from '../../firebase.config';
// import AddTagsInput from '../Components/adminDashboard/components/addtag';

const UserTable = () => {
  const [users, setUsers] = useState([]);

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
      }
    };

    fetchUsers();
  }, []);

  return (
<>
    <div className="flex relative dark:bg-main-dark-bg">
        {/* Container for settings button */}
        <div className="fixed top-4 right-4 z-50">
          {/* Settings button content */}
        </div>

        <div className="m-10 flex-1 dark:bg-main-dark-bg bg-main-bg min-h-screen pl-4">
          {/* Here is main content */}
    <div className="container mx-auto py-8  ">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Existing Users</h2>
      <div className="flex justify-center items-start min-h-screen">
  <div className="backdrop-blur-sm bg-white/30 rounded-lg p-8">
    <div className="overflow-x-auto">
      <table className="w-full  rounded-lg shadow-md">
        <thead>
          <tr className="bg-indigo-400 text-black ">
            <th className="py-3 px-4 text-left ">Serial No.</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="hover:bg-black-100">
              <td className="py-3 px-4 border-b border-gray-300 text-white">
                {user.serialNo}
              </td>
              <td className="py-3 px-4 border-b border-gray-300 text-white">
                {user.name}
              </td>
              <td className="py-3 px-4 border-b border-gray-300 text-white">
                {user.role}
              </td>
              <td className="py-3 px-4 border-b border-gray-300 text-white">
                {user.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <AddTagsInput/> */}
    </div>
  </div>
</div>
    </div>
    </div>
    </div>
    </>
  );
};

export default UserTable;