'use client'
import { Link } from '@chakra-ui/next-js' 
import AtmNavbar from './components/AtmNavbar'
import MapTitle from './components/MapTitle'
import AtmMap from './components/Map'


export default function Page() {
  return (
    <>
      <AtmNavbar/>
      <MapTitle/>
      <AtmMap/>
    </>
  )
}