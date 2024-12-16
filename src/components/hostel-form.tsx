"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface Capacity {
  available: number;
  cost: number;
}

interface CapacityTypes {
  singleBed: Capacity;
  doubleShare: Capacity;
  tripleShare: Capacity;
}

interface HostelFormData {
  _id?: string;
  name: string;
  images: string[];
  seatAvailability: boolean;
  capacity: CapacityTypes;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  description: string;
  adminId?: string;
}

interface HostelFormProps {
  onSubmit?: (hostel: HostelFormData) => void;
  onCancel: () => void;
  initialData?: HostelFormData;
}

export const HostelForm: React.FC<HostelFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const initialFormData: HostelFormData = {
    name: '',
    images: [],
    seatAvailability: false,
    capacity: {
      singleBed: { available: 0, cost: 0 },
      doubleShare: { available: 0, cost: 0 },
      tripleShare: { available: 0, cost: 0 }
    },
    phoneNumber: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    description: ''
  }

  const [formData, setFormData] = useState<HostelFormData>(initialData || initialFormData)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const sessionString = localStorage.getItem('session')
    if (!sessionString) {
      toast({
        title: "Unauthorized",
        description: "Please log in first",
        variant: "destructive"
      })
      router.push('/')
      return
    }

    const session = JSON.parse(sessionString)
    if (session.role !== 'admin') {
      toast({
        title: "Unauthorized",
        description: "You do not have permission to add/edit hostels",
        variant: "destructive"
      })
      router.push('/')
      return
    }
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCapacityChange = (type: keyof CapacityTypes, field: keyof Capacity, value: number) => {
    setFormData(prev => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [type]: { ...prev.capacity[type], [field]: value }
      }
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const totalImages = formData.images.length + files.length;
      if (totalImages > 5) {
        toast({
          title: "Error",
          description: "Maximum 5 images allowed",
          variant: "destructive"
        });
        return;
      }
  
      const validFiles: File[] = [];
      const uploadedImages: string[] = [];
  
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 1024 * 1024) {
          toast({
            title: "Error",
            description: `Image ${files[i].name} exceeds 1MB limit.`,
            variant: "destructive",
          });
          continue;
        }
        validFiles.push(files[i]);
      }
  
      // Set uploaded files for preview
      setUploadedFiles([...uploadedFiles, ...validFiles]);
  
      // Upload images to Cloudinary
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'hostelglobe_preset');
  
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
  
          if (data.secure_url) {
            console.log(`Uploaded image URL for ${file.name}:`, data.secure_url);
            uploadedImages.push(data.secure_url);
          } else {
            toast({
              title: "Error",
              description: `Failed to upload image ${file.name}`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Error",
            description: `Failed to upload image ${file.name}`,
            variant: "destructive",
          });
        }
      }
  
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
  
      console.log('Current images in form data:', [...formData.images, ...uploadedImages]);
    }
  }

  const removeImage = (imageToRemove: string) => {
    console.log('Removing image:', imageToRemove)

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }))

    setUploadedFiles(prev =>
      prev.filter(() =>
        !formData.images.some((image) => image === imageToRemove)
      )
    );

    console.log('Remaining images after removal:', formData.images.filter(image => image !== imageToRemove))
  }

  const clearImageUpload = () => {
    console.log('Clearing all images. Current images:', formData.images)

    setFormData(prev => ({ ...prev, images: [] }))
    setUploadedFiles([])

    const fileInput = document.getElementById('images') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }

    console.log('Images cleared. Remaining images:', [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    const sessionString = localStorage.getItem('session')
    if (!sessionString) {
      toast({
        title: "Unauthorized",
        description: "Please log in first",
        variant: "destructive"
      })
      return
    }
  
    const session = JSON.parse(sessionString)
  
    try {
      const endpoint = '/api/hostels'
      const method = formData._id ? 'PUT' : 'POST'
  
      console.log('Submitting images:', formData.images)
  
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`,
      }
  
      if (formData._id) {
        headers['X-Hostel-Id'] = formData._id
      }
  
      const response = await fetch(endpoint, {
        method: method,
        headers: headers,
        body: JSON.stringify({ 
          session: session,
          hostelData: {
            ...formData,
            adminId: session.id,
            images: formData.images.filter(image => image && image.trim() !== '')
          } 
        })
      })
  
      if (response.ok) {
        const data = await response.json()
  
        console.log('Server response:', data)
  
        toast({
          title: "Success",
          description: formData._id ? "Hostel updated successfully" : "Hostel added successfully",
        })
  
        console.log('Returned images from server:', data.images)
  
        if (onSubmit) {
          onSubmit(formData)
        } else {
          router.push('/admin-dashboard')
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit hostel')
      }
    } catch (error) {
      console.error('Error submitting hostel:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit hostel. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-12 mb-12 bg-background text-foreground dark:bg-gray-900 dark:text-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 max-w-4xl mx-auto p-6 overflow-y-auto max-h-screen"
      >
        <div>
          <Label htmlFor="name" className="dark:text-gray-200">Hostel Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div>
          <Label htmlFor="images" className="dark:text-gray-200">
            Images (max 5, each max 1MB) 
            {formData.images.length > 0 && ` - ${formData.images.length} uploaded`}
          </Label>
          <Input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            max={5}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
          
          {formData.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Hostel image ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.images.length > 0 && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={clearImageUpload}
                >
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="seatAvailability" className="dark:text-gray-200">Seat Availability</Label>
          <Switch
            id="seatAvailability"
            checked={formData.seatAvailability}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, seatAvailability: checked }))}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(formData.capacity) as Array<keyof CapacityTypes>).map((type) => {
            const formatType = type === 'singleBed' 
              ? 'Available Single Bed' 
              : type === 'doubleShare' 
              ? 'Available Double Share' 
              : 'Available Triple Share'

            return (
              <div key={type} className="space-y-2">
                <Label className="dark:text-gray-200">{formatType}</Label>
                <Input
                  type="number"
                  value={formData.capacity[type].available}
                  onChange={(e) => handleCapacityChange(type, 'available', parseInt(e.target.value) || 0)}
                  placeholder="Number of beds"
                  min="0"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
                <Label className="dark:text-gray-200">
                  {type === 'singleBed' 
                    ? 'Cost of Single Bed' 
                    : type === 'doubleShare' 
                    ? 'Cost for Double Share' 
                    : 'Cost for Triple Share'}
                </Label>
                <Input
                  type="number"
                  value={formData.capacity[type].cost}
                  onChange={(e) => handleCapacityChange(type, 'cost', parseInt(e.target.value) || 0)}
                  placeholder="Cost per night"
                  min="0"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
            )
          })}
        </div>
        
        <div>
          <Label htmlFor="phoneNumber" className="dark:text-gray-200">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="dark:text-gray-200">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <Label htmlFor="state" className="dark:text-gray-200">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country" className="dark:text-gray-200">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <Label htmlFor="zipcode" className="dark:text-gray-200">Zipcode</Label>
            <Input
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              required
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description" className="dark:text-gray-200">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="h-32 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>
        
        <div className="flex justify-end space-x-2 py-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
          >
            {formData._id ? 'Update Hostel' : 'Add Hostel'}
          </Button>
        </div>
      </form>
    </div>
  )
}