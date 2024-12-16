// "use client"

// import { useState, useEffect } from 'react'
// import { useToast } from '@/hooks/use-toast';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Switch } from "@/components/ui/switch"

// export const SuperAdminDashboard: React.FC = () => {
//   const [users, setUsers] = useState([])
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('/api/users')
//       if (response.ok) {
//         const data = await response.json()
//         // Filter out superadmin users and only show user/admin roles
//         const filteredUsers = data.filter((user) => 
//           user.role !== 'superadmin'
//         );
//         setUsers(filteredUsers)

//         toast({
//           title: "Users Loaded",
//           description: `Successfully loaded ${filteredUsers.length} users`,
//         });
//       } else {
//         throw new Error('Failed to fetch users')
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch users. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleRoleToggle = async (userId: string, currentRole: string) => {
//     try {
//       const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
//       // Show a loading toast
//       const loadingToast = toast({
//         title: "Updating Role",
//         description: `Changing user role...`,
//       });

//       const response = await fetch('/api/users', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           userId: userId, 
//           currentRole: currentRole,
//           newRole: newRole 
//         }),
//       });

//       // Dismiss the loading toast
//       loadingToast.dismiss();

//       if (response.ok) {
//         // Update the local state to reflect the role change
//         const updatedUsers = users.map(user => 
//           user._id === userId ? { ...user, role: newRole } : user
//         );
//         setUsers(updatedUsers);

//         toast({
//           title: "Role Updated",
//           description: `User role successfully changed to ${newRole}`,
//           variant: "default",
//         });
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update user role');
//       }
//     } catch (error) {
//       console.error('Error updating user role:', error)
//       toast({
//         title: "Role Update Failed",
//         description: error.message || "Failed to update user role. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-8">Super Admin Dashboard</h1>
//       {users.length > 0 ? (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Username</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Change Role</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user.username}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.role}</TableCell>
//                 <TableCell>
//                   <Switch
//                     checked={user.role === 'admin'}
//                     onCheckedChange={() => handleRoleToggle(user._id, user.role)}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       ) : (
//         <div className="text-center text-gray-500">
//           <p className="text-2xl mb-4">No users are currently registered.</p>
//           <p>Users will appear here once they sign up.</p>
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

// Define a type for User with a strict role type
interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
}

// Define a type for raw user data from the API
interface RawUser {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export const SuperAdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data: RawUser[] = await response.json(); 

        // Filter and map users
        const filteredUsers = data
          .filter((user: RawUser) => user.role !== 'superadmin')
          .map((user: RawUser): User => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role as 'user' | 'admin' // Type assertion
          }));

        setUsers(filteredUsers)

        toast({
          title: "Users Loaded",
          description: `Successfully loaded ${filteredUsers.length} users`,
        });
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRoleToggle = async (userId: string, currentRole: 'user' | 'admin' | 'superadmin') => {
    try {
      // Explicitly type the new role
      const newRole: 'user' | 'admin' = currentRole === 'admin' ? 'user' : 'admin';
      
      const loadingToast = toast({
        title: "Updating Role",
        description: `Changing user role...`,
      });

      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: userId, 
          currentRole: currentRole,
          newRole: newRole 
        }),
      });

      loadingToast.dismiss();

      if (response.ok) {
        // Explicitly type the updated users
        const updatedUsers: User[] = users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        );
        
        setUsers(updatedUsers);

        toast({
          title: "Role Updated",
          description: `User role successfully changed to ${newRole}`,
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: "Role Update Failed",
        description: error instanceof Error ? error.message : "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Super Admin Dashboard</h1>
      {users.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.role === 'admin'}
                    onCheckedChange={() => handleRoleToggle(user._id, user.role)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-gray-500">
          <p className="text-2xl mb-4">No users are currently registered.</p>
          <p>Users will appear here once they sign up.</p>
        </div>
      )}
    </div>
  )
}

