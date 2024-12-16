// import Link from 'next/link'
// import Image from 'next/image'
// import { Navbar } from '@/components/navbar'
// import { Button } from '@/components/ui/button'

// export default function Home() {
//   return (
//     <div className=" flex flex-col">
//     <Navbar />
//     <section className="relative h-[600px] flex items-center justify-center text-white">
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: 'url("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3")',
//         }}
//       >
//         <div className="absolute inset-0 bg-black/50" />
//       </div>
//       <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
//         <h1 className="text-5xl font-bold mb-6">
//           Find Your Perfect Hostel Worldwide
//         </h1>
//         <p className="text-xl mb-8">
//           Discover comfortable and affordable hostels across the globe. Your next
//           adventure starts here.
//         </p>
//         <Link href="/explore">
//         <Button size="lg" className="text-lg">
//           Explore Hostels
//         </Button>
//         </Link>
//       </div>
//     </section>
//   </div>

//   )
// }

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <section className="relative flex-grow flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3")',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Perfect Hostel Worldwide
          </h1>
          <p className="text-xl mb-8">
            Discover comfortable and affordable hostels across the globe. Your next
            adventure starts here.
          </p>
          <Link href="/explore">
            <Button size="lg" className="text-lg">
              Explore Hostels
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}






