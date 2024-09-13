'use client';
import React,{useState,useRef} from 'react';
import {Camera} from 'react-camera-pro';
import {Box, Button, Container, Paper} from "@mui/material";
import GenerateSugg from '../utils/vision.js';

export default function CameraPage(){
    const camera=useRef(null);
    const [image,setimage]=useState(null);
    const styles={
        camcontainer:{
            width:'300px',
            height:'200px',
            overflow:'hidden',
            position:'relative',
        },
        camera:{
            position:'absolute',
            top:'50%',
            left:'50%',
            transform:'translate(-50%,-50%)',
            width:'100%',
            height:'100%',
            objectFit:'cover',
        },
        capturedimage:{
            width:'100%',
            height:'auto',
            maxWidth:'300px',
        },
    };
    return (
        <Container maxWidth='50vw'>
            <Paper elevation={3} sx={{p:2,mt:2}}>
                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                    <div style={styles.camcontainer}>
                        <Camera errorMessages={{noCameraAccessible:'No camera device'}} ref={camera} style={styles.camera}/>
                    </div>
                    <Box display='flex'>
                        <Button variant='contained' onClick={()=>setimage(camera.current.takePhoto())} sx={{m:2}}>Take Photo</Button>
                        <Button variant='contained' onClick={()=>GenerateSugg(image)} sx={{m:2}}>Generate</Button>
                    </Box>
                    {image&&(
                        <Box sx={{mt:2,width:'100%',maxWidth:'300px'}}>
                            <img src={image} alt="Taken Photo" style={styles.capturedimage}/>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    )
}

