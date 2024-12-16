"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HostelForm } from './hostel-form';
import { HostelList } from './hostel-list';

// Define interfaces for nested objects


interface Hostel {
  _id: string;
  name: string;
  images: string[];
  seatAvailability: boolean;
  
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  description: string;
  adminId: string;
}

export const AdminDashboard: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    const adminId = session?.id;

    if (adminId) {
      fetchHostels(adminId);
    } else {
      toast({
        title: "Error",
        description: "Session not found. Please log in again.",
        variant: "destructive",
      });
    }
  }, []);

  const fetchHostels = async (adminId: string | undefined) => {
    if (!adminId) {
      toast({
        title: "Error",
        description: "Invalid Admin ID.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/hostels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminId}`,
        },
      });

      if (response.ok) {
        const data: Hostel[] = await response.json();
        console.log("the data is : ", data);
        setHostels(data);
      } else {
        throw new Error('Failed to fetch hostels');
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hostels. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddHostel = (newHostel: Hostel) => {
    setHostels([...hostels, newHostel]);
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Hostel added successfully!",
    });
  };

  const handleEditHostel = (updatedHostel: Hostel) => {
    setHostels(
      hostels.map((hostel) =>
        hostel._id === updatedHostel._id ? updatedHostel : hostel
      )
    );
    setEditingHostel(null);
    toast({
      title: "Success",
      description: "Hostel updated successfully!",
    });
  };

  const handleDeleteHostel = async (hostelId: string) => {
    try {
      const response = await fetch('/api/hostels', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Hostel-Id': hostelId,
        },
      });

      if (response.ok) {
        setHostels(hostels.filter((hostel) => hostel._id !== hostelId));
        toast({
          title: "Success",
          description: "Hostel deleted successfully!",
        });
      } else {
        throw new Error('Failed to delete hostel');
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
      toast({
        title: "Error",
        description: "Failed to delete hostel. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Hostel</Button>
      </div>
      <HostelList
        hostels={hostels}
        // @ts-expect-error: Temporarily ignoring the type error due to known issue with the data structure
        onEdit={setEditingHostel}
        onDelete={handleDeleteHostel}
      />
      {(isFormOpen || editingHostel) && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CardContent className="mt-8 p-8 rounded-lg w-full max-w-2xl">
            <HostelForm
            // @ts-expect-error: Temporarily ignoring the type error due to known issue with the data structure
              onSubmit={editingHostel ? handleEditHostel : handleAddHostel}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingHostel(null);
              }}
              // @ts-expect-error: Temporarily ignoring the type error due to known issue with the data structure
              initialData={editingHostel}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
