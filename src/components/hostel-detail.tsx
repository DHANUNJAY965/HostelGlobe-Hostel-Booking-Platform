// // "use client"

// // import Image from 'next/image'
// // import { useState } from 'react'
// // import { useSession } from 'next-auth/react'
// // import { useToast } from '@/hooks/use-toast';
// // import { Button } from '@/components/ui/button'
// // import { Card, CardContent } from '@/components/ui/card'

// // interface HostelDetailProps {
// //   hostel: {
// //     _id: string
// //     name: string
// //     images: string[]
// //     description: string
// //     seatAvailability: boolean
// //     capacity: {
// //       singleBed?: { available: number; cost: number }
// //       doubleShare?: { available: number; cost: number }
// //       tripleShare?: { available: number; cost: number }
// //     }
// //     phoneNumber: string
// //     city: string
// //     state: string
// //     country: string
// //     zipcode: string
// //   }
// // }

// // export const HostelDetail: React.FC<HostelDetailProps> = ({ hostel }) => {
// //   const [currentImageIndex, setCurrentImageIndex] = useState(0)
// //   const { data: session } = useSession()
// //   const { toast } = useToast()

// //   const handleBook = () => {
// //     if (!session) {
// //       toast({
// //         title: "Please log in",
// //         description: "You need to be logged in to book a hostel.",
// //         variant: "destructive",
// //       })
// //     } else {
// //       toast({
// //         title: "Booking feature coming soon",
// //         description: "This feature will be implemented in the future. Please explore more hostels until then.",
// //       })
// //     }
// //   }

// //   return (
// //     <Card>
// //       <CardContent className="p-6">
// //         <div className="mb-6 relative">
// //           <Image
// //             src={hostel.images[currentImageIndex] || '/placeholder.jpg'}
// //             alt={hostel.name}
// //             width={800}
// //             height={600}
// //             className="w-full h-96 object-cover rounded-lg"
// //           />
// //           <div className="absolute bottom-4 right-4 space-x-2">
// //             {hostel.images.map((_, index) => (
// //               <Button
// //                 key={index}
// //                 variant={index === currentImageIndex ? "default" : "secondary"}
// //                 size="sm"
// //                 onClick={() => setCurrentImageIndex(index)}
// //               >
// //                 {index + 1}
// //               </Button>
// //             ))}
// //           </div>
// //         </div>
// //         <h1 className="text-3xl font-bold mb-4">{hostel.name}</h1>
// //         <p className="text-gray-600 mb-4">{hostel.description}</p>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //           <div>
// //             <h2 className="text-xl font-semibold mb-2">Availability</h2>
// //             <p>Seats available: {hostel.seatAvailability ? 'Yes' : 'No'}</p>
// //             {hostel.capacity.singleBed && (
// //               <p>Single bed: {hostel.capacity.singleBed.available} (₹{hostel.capacity.singleBed.cost}/night)</p>
// //             )}
// //             {hostel.capacity.doubleShare && (
// //               <p>Double share: {hostel.capacity.doubleShare.available} (₹{hostel.capacity.doubleShare.cost}/night)</p>
// //             )}
// //             {hostel.capacity.tripleShare && (
// //               <p>Triple share: {hostel.capacity.tripleShare.available} (₹{hostel.capacity.tripleShare.cost}/night)</p>
// //             )}
// //           </div>
// //           <div>
// //             <h2 className="text-xl font-semibold mb-2">Contact & Location</h2>
// //             <p>Phone: {hostel.phoneNumber}</p>
// //             <p>Address: {hostel.city}, {hostel.state}, {hostel.country} - {hostel.zipcode}</p>
// //           </div>
// //         </div>
// //         <Button onClick={handleBook} className="w-full">Book Now</Button>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// "use client"

// import Image from 'next/image'
// import { useState, useEffect } from 'react'
// import { useToast } from '@/hooks/use-toast'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'

// interface HostelDetailProps {
//   hostel: {
//     _id: string
//     name: string
//     images: string[]
//     description: string
//     seatAvailability: boolean
//     capacity: {
//       singleBed?: { available: number; cost: number }
//       doubleShare?: { available: number; cost: number }
//       tripleShare?: { available: number; cost: number }
//     }
//     phoneNumber: string
//     city: string
//     state: string
//     country: string
//     zipcode: string
//   }
// }

// export const HostelDetail: React.FC<HostelDetailProps> = ({ hostel }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const { toast } = useToast()

//   useEffect(() => {
//     console.log('Hostel Images:', hostel.images) // Debugging logs to verify image URLs
//     // Check if a session exists in localStorage
//     const session = localStorage.getItem('session')
//     if (session) {
//       setIsLoggedIn(true)
//     } else {
//       setIsLoggedIn(false)
//     }
//   }, [hostel.images])

//   const handleBook = () => {
//     if (!isLoggedIn) {
//       toast({
//         title: 'Please log in',
//         description: 'You need to be logged in to book a hostel.',
//         variant: 'destructive',
//       })
//     } else {
//       toast({
//         title: 'Booking feature coming soon',
//         description:
//           'This feature will be implemented in the future. Please explore more hostels until then.',
//       })
//     }
//   }

//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="mb-6 relative">
//           {hostel.images.length > 0 ? ( // Conditional rendering to ensure images array is populated
//             <Image
//               src={hostel.images[currentImageIndex]}
//               alt={hostel.name}
//               width={800} // Adjust this width as needed
//               height={600} // Adjust this height as needed
//               className="w-full h-96 object-cover rounded-lg"
//               style={{ objectFit: 'cover', width: '100%', height: '100%' }} // Make sure the image covers the container area
//             />
//           ) : (
//             <p className="text-gray-500">Loading images...</p>
//           )}
//           <div className="absolute bottom-4 right-4 space-x-2">
//             {hostel.images.map((_, index) => (
//               <Button
//                 key={index}
//                 variant={index === currentImageIndex ? 'default' : 'secondary'}
//                 size="sm"
//                 onClick={() => setCurrentImageIndex(index)}
//               >
//                 {index + 1}
//               </Button>
//             ))}
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold mb-4">{hostel.name}</h1>
//         <p className="text-gray-600 mb-4">{hostel.description}</p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Availability</h2>
//             <p>Seats available: {hostel.seatAvailability ? 'Yes' : 'No'}</p>
//             {hostel.capacity.singleBed && (
//               <p>
//                 Single bed: {hostel.capacity.singleBed.available} (
//                 ₹{hostel.capacity.singleBed.cost}/night)
//               </p>
//             )}
//             {hostel.capacity.doubleShare && (
//               <p>
//                 Double share: {hostel.capacity.doubleShare.available} (
//                 ₹{hostel.capacity.doubleShare.cost}/night)
//               </p>
//             )}
//             {hostel.capacity.tripleShare && (
//               <p>
//                 Triple share: {hostel.capacity.tripleShare.available} (
//                 ₹{hostel.capacity.tripleShare.cost}/night)
//               </p>
//             )}
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Contact & Location</h2>
//             <p>Phone: {hostel.phoneNumber}</p>
//             <p>
//               Address: {hostel.city}, {hostel.state}, {hostel.country} -{' '}
//               {hostel.zipcode}
//             </p>
//           </div>
//         </div>
//         <Button onClick={handleBook} className="w-full">
//           Book Now
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

interface HostelDetailProps {
  hostel: {
    _id: string
    name: string
    images: string[]
    description: string
    seatAvailability: boolean
    capacity: {
      singleBed?: { available: number; cost: number }
      doubleShare?: { available: number; cost: number }
      tripleShare?: { available: number; cost: number }
    }
    phoneNumber: string
    city: string
    state: string
    country: string
    zipcode: string
  }
}

export const HostelDetail: React.FC<HostelDetailProps> = ({ hostel }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const session = localStorage.getItem('session')
    if (session) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const handleBook = () => {
    if (!isLoggedIn) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to book a hostel.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Booking feature coming soon',
        description:
          'This feature will be implemented in the future. Please explore more hostels until then.',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Image Gallery */}
        <div className="lg:w-1/2">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {hostel.images.length > 0 ? (
              <Image
                src={hostel.images[currentImageIndex]}
                alt={hostel.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">Loading images...</p>
              </div>
            )}
          </div>
          {/* Thumbnail Gallery */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {hostel.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                  currentImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${hostel.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Details */}
        <div className="lg:w-1/2">
          <div className="space-y-6">
            {/* Header Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {hostel.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {hostel.city}, {hostel.state}
              </p>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">{hostel.description}</p>
            </div>

            {/* Pricing & Availability */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Room Options
              </h2>
              <div className="space-y-3">
                {hostel.capacity.singleBed && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-gray-100">Single Bed Room</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        ₹{hostel.capacity.singleBed.cost}/night
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {hostel.capacity.singleBed.available} rooms left
                      </div>
                    </div>
                  </div>
                )}
                {hostel.capacity.doubleShare && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-gray-100">Double Share Room</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        ₹{hostel.capacity.doubleShare.cost}/night
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {hostel.capacity.doubleShare.available} rooms left
                      </div>
                    </div>
                  </div>
                )}
                {hostel.capacity.tripleShare && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-900 dark:text-gray-100">Triple Share Room</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        ₹{hostel.capacity.tripleShare.cost}/night
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {hostel.capacity.tripleShare.available} rooms left
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Contact Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <span className="font-medium">Phone:</span> {hostel.phoneNumber}
                </p>
                <p className="flex items-center gap-2 mt-2 text-gray-900 dark:text-gray-100">
                  <span className="font-medium">Address:</span> 
                  {hostel.city}, {hostel.state}, {hostel.country} - {hostel.zipcode}
                </p>
              </div>
            </div>

            {/* Booking Button */}
            <div className="pt-4">
              <Button 
                onClick={handleBook} 
                className="w-full py-6 text-lg"
                disabled={!hostel.seatAvailability}
                variant="default"
              >
                {hostel.seatAvailability ? 'Book Now' : 'No Rooms Available'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}