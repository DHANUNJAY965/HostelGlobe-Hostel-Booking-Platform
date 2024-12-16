import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HostelCardProps {
  hostel: {
    _id: string
    name: string
    images: string[]
    description: string
  }
}

export const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
  return (
    <Card className="overflow-hidden">
      <Link href={`/hostel/${hostel._id}`}>
      <Image
        src={hostel.images[0] || '/placeholder.jpg'}
        alt={hostel.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">{hostel.name}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{hostel.description}</p>
      </CardContent>
      <CardFooter>
          <Button>View Details</Button>
        
      </CardFooter>
      </Link>
    </Card>
  )
}

