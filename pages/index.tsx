import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

import axios from 'axios'
import ImageUploadingComponent from '../components/imageuploading'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
//definition of useState Array. What our API looks like
interface fakestore {
  id: string
  name: string
  image: string
  description: string
}

const Home: NextPage = () => {
  const [fetchedData, setFetchedData] = useState<Array<fakestore>>([])
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [images, setImages] = useState<any[]>([])
  //Axios GET, function to fetch data to my client
  function AxiosGet() {
    axios({
      method: 'get',
      url: 'https://62b1f368c7e53744afc4e8d5.mockapi.io/users',
      headers: { "Access-Control-Allow-Origin": "*" }
    }).then(response => {
      return (response)
    }).then(res => {
      setFetchedData(res.data)
    })
  }

  //Axios DELETE, function to delete data in my api
  function AxiosDelete(id: string) {
    axios({
      method: 'delete',
      url: 'https://62b1f368c7e53744afc4e8d5.mockapi.io/users/' + id,
      headers: { "Access-Control-Allow-Origin": "*" }
    }).then(() => {
      AxiosGet()//refreshes my client with new info
    })
  }
  //Axios Post, function to get data from my useStates create a body to post to my api
  function handleSubmit(event: any) {
    event.preventDefault()
    axios({
      method: 'post',
      url: 'https://62b1f368c7e53744afc4e8d5.mockapi.io/users',
      headers: { "Access-Control-Allow-Origin": "*" },
      data: {
        name: name,
        description: description,
        image: (images.length === 0) ? "" : images[0]?.data_url
      }
    }).then(() => {
      AxiosGet()//refreshes my client with new info
    })
    setName(''), setDescription(''), setImages([])//resets my state to clear my form
  }

  return (
    <div className='home'>
      <Head>
        <title>Blue Vet Challenge</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h3 className='header'>Blue Vet Challenge</h3>
      <Button onClick={() => AxiosGet()} variant='contained' sx={{ margin: '0 auto', display: 'block' }}>Grab Data</Button>
      {/* Display for my data in the form of a list of cards ------------------------------------------------------------------------- */}
      <Box className="flexbox">
        <Box className="card-display">
          {
            fetchedData.map((item) => {
              return (
                <Card key={item.id} sx={{ marginBottom: "24px" }}>
                  <CardMedia
                    component="img"
                    image={(item.image !== "") ? item.image : "https://t4.ftcdn.net/jpg/04/00/24/31/360_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg"} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(item.description !== "") ? item.description : "No description given"}
                    </Typography>
                  </CardContent>
                  <Button onClick={() => AxiosDelete(item.id)} variant='contained' sx={{ marginBottom: '12px', marginLeft: '12px' }} disabled={(item.id === "1") ? true : false}>Delete Me</Button>
                </Card>
              )
            })
          }
        </Box>
        {/* Display for my data in the form of a list of cards ------------------------------------------------------------------------- */}

        {/* Form to post to my API ------------------------------------------------------------------------------------------------------ */}
        <Card className='paper'>
          <CardContent>
            <Box className="form" component="form" onSubmit={(event: any) => handleSubmit(event)}>
              <h2 className="header">Form</h2>
              <TextField label="Name" className="name" value={name} name='name' onChange={(event) => setName(event.target.value as string)} required />
              <TextField label="Description" className="description" value={description} name='description' onChange={(event) => setDescription(event.target.value as string)} multiline rows={4} />
              <ImageUploadingComponent imageState={images} setImageState={setImages} />
              <Button variant="contained" className="submit" type='submit'>Submit</Button>
            </Box>
          </CardContent>
        </Card>
        {/* Form to post to my API ------------------------------------------------------------------------------------------------------ */}
      </Box>
    </div>
  )
}

export default Home
