import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

// PanchKarma therapy descriptions
const therapyDescriptions = {
  'Vamana Therapy': 'Therapeutic emesis for Kapha-related disorders and respiratory issues',
  'Virechana Therapy': 'Medicated purgation for Pitta disorders and liver detoxification', 
  'Basti Therapy': 'Medicated enemas for Vata disorders and neurological conditions',
  'Nasya Therapy': 'Nasal administration of medicines for head and neck disorders',
  'Raktamokshana Therapy': 'Bloodletting therapy for blood-related and skin disorders',
  'Complete PanchKarma': 'Full detoxification program combining all five therapies'
};

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
        <h1 className='text-3xl font-medium'>Choose Your PanchKarma Therapy</h1>
        <p className='sm:w-1/3 text-center text-sm'>Experience authentic detoxification and healing through the traditional PanchKarma therapies and complete wellness programs, each designed for holistic transformation.</p>
        {/* Mobile - Horizontal Scroll */}
        <div className='flex sm:hidden gap-4 pt-5 w-full overflow-x-auto pb-2 px-4'>
            {specialityData.map((item, index)=>(
                <Link 
                    onClick={()=>scrollTo(0,0)} 
                    className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 bg-white rounded-lg p-3 shadow-sm hover:shadow-md border border-gray-100 min-w-[180px]' 
                    key={index} 
                    to={`/doctors/${item.speciality}`}
                >
                    <img className='w-12 mb-2 p-2 bg-primary/10 rounded-full' src={item.image} alt={item.speciality} />
                    <h3 className='font-semibold text-xs mb-1 text-gray-800 text-center'>{item.speciality}</h3>
                    <p className='text-xs text-gray-600 text-center leading-tight'>
                        {therapyDescriptions[item.speciality]}
                    </p>
                </Link>
            ))}
        </div>

        {/* Desktop - Grid Layout */}
        <div className='hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 pt-5 w-full max-w-7xl px-4'>
            {specialityData.map((item, index)=>(
                <Link 
                    onClick={()=>scrollTo(0,0)} 
                    className='flex flex-col items-center text-xs cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white rounded-lg p-4 shadow-sm hover:shadow-md border border-gray-100 min-h-[220px]' 
                    key={index} 
                    to={`/doctors/${item.speciality}`}
                >
                    <img className='w-16 mb-3 p-2 bg-primary/10 rounded-full' src={item.image} alt={item.speciality} />
                    <h3 className='font-semibold text-sm mb-2 text-gray-800 text-center'>{item.speciality}</h3>
                    <p className='text-xs text-gray-600 text-center leading-tight flex-grow'>
                        {therapyDescriptions[item.speciality]}
                    </p>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default SpecialityMenu
