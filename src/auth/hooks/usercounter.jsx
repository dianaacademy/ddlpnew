import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

const useCountUsers = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const usersRef = firebase.database().ref('users');

    const countUsers = () => {
      usersRef.once('value')
        .then(snapshot => {
          setUserCount(snapshot.numChildren());
        })
        .catch(error => {
          console.error('Error counting users:', error);
        });
    };

    usersRef.on('value', countUsers);

    return () => {
      usersRef.off('value', countUsers);
    };
  }, []);

  return userCount;
};

export default useCountUsers;