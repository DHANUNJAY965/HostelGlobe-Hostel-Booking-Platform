import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Hostel {
  _id: string
  name: string
  city: string
  country: string
}

interface HostelListProps {
  hostels: Hostel[] | undefined // It might be undefined
  onEdit: (hostel: Hostel) => void
  onDelete: (id: string) => void
}

export const HostelList: React.FC<HostelListProps> = ({ hostels = [], onEdit, onDelete }) => {
  
  const safeHostels = Array.isArray(hostels) ? hostels : [];

  return (
    <div>
      {safeHostels.length === 0 ? (
        <div className="text-center py-4">
          <p>No hostels are available. Add some hostels.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeHostels.map((hostel) => (
              <TableRow key={hostel._id}>
                <TableCell>{hostel.name}</TableCell>
                <TableCell>{hostel.city}</TableCell>
                <TableCell>{hostel.country}</TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(hostel)} className="mr-2">Edit</Button>
                  <Button onClick={() => onDelete(hostel._id)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
