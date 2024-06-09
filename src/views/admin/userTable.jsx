import { useState, useEffect } from 'react';
import { getDatabase, ref,  get } from 'firebase/database';
import { auth } from '../../firebase.config';
import { Card,
  CardFooter,
  CardTitle,
  CardContent,



 } from '@/components/ui/card';

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

<Card>


  <CardTitle className="px-2 py-2">
Existing Users

  </CardTitle>

  <CardContent>
  <div className="overflow-x-auto">
      <table className="w-full  rounded-lg shadow-md">
        <thead>
          <tr className=" text-black ">
            <th className="py-3 px-4 text-left ">Serial No.</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="hover:bg-black-100">
              <td className="py-3 px-4 border-b border-gray-300 ">
                {user.serialNo}
              </td>
              <td className="py-3 px-4 border-b border-gray-300">
                {user.name}
              </td>
              <td className="py-3 px-4 border-b border-gray-300 ">
                {user.role}
              </td>
              <td className="py-3 px-4 border-b border-gray-300 ">
                {user.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <AddTagsInput/> */}
    </div>


  </CardContent>

</Card>
    </>
  );
};

export default UserTable;