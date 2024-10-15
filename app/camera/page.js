'use client';
import React,{useState,useRef} from 'react';
import {Camera} from 'react-camera-pro';
import {Box, Button, Container, Modal, Paper, Typography} from "@mui/material";
import {OpenAI} from 'openai';
import {collection, deleteDoc, doc, getDoc, getDocs, query, setDoc} from "firebase/firestore";
import {firestore} from "@/firebase";

export default function CameraPage(){
    const camera=useRef(null);
    const [image,setimage]=useState(null);
    const [sug,setsug]=useState('Nothing');
    const [open,setopen]=useState(false);
    const [inventory,setinventory]=useState([]);

    const updateInventory=async()=>{
        const snapshot=query(collection(firestore,'pantry'));
        const docs=await getDocs(snapshot);
        const inventorylist=[];
        docs.forEach((doc)=>{
            inventorylist.push({
                name: doc.id,
                ...doc.data(),
            });
        });
        setinventory(inventorylist);
    }

    const addItem=async(item)=>{
        const docref=doc(collection(firestore,'pantry'),item);
        const docsnap=await getDoc(docref);
        if(docsnap.exists()){
            const {quantity}=docsnap.data();
            await setDoc(docref,{quantity:quantity+1});
        }else{
            await setDoc(docref,{quantity:1})
        }
        await updateInventory();
    }

    const removeItem=async(item)=>{
        const docref=doc(collection(firestore,'pantry'),item);
        const docsnap=await getDoc(docref);
        if(docsnap.exists()){
            const {quantity}=docsnap.data();
            if(quantity===1){await deleteDoc(docref);}
            else{await setDoc(docref,{quantity:quantity-1});}
        }
        await updateInventory();
    }

    const handleopen=()=>setopen(true);
    const handleclose=()=>setopen(false);
    const addandclose=async ()=>{
        addItem(sug);
        handleclose();
    }

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

    const GenerateSugg=async ()=>{
        console.log('starting...');
        const openai=new OpenAI({
            apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            dangerouslyAllowBrowser:true,
        });
        const response=await openai.chat.completions.create({
            model:'gpt-4o',
            messages:[
                {
                    role:'user',
                    content:[
                        {
                            type:'text',
                            text:'Find the most prominent object in the image and say what it is in as few words as possible; just giving the name of whatever object it is',
                        },
                        {
                            type:'image_url',
                            image_url:{
                                url:image,
                                detail:'low',
                            },
                        },
                    ],
                }
            ]
        });
        console.log(response.choices[0].message.content);
        setsug(response.choices[0].message.content);
    }

    return (
        <Container maxWidth='50vw'>
            <Modal open={open} onClose={handleclose}>
                <Box sx={{p:4,bgcolor:'background.paper'}}>
                    <Typography variant='h4'>
                        Add {sug} to your inventory?
                    </Typography>
                    <Button variant='contained' onClick={addandclose}>
                        Yes
                    </Button>
                    <Button variant='contained' onClick={handleclose}>
                        Retake
                    </Button>
                </Box>
            </Modal>
            <Paper elevation={3} sx={{p:2,mt:2}}>
                <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                    <div style={styles.camcontainer}>
                        <Camera errorMessages={{noCameraAccessible:'No camera device'}} ref={camera} style={styles.camera}/>
                    </div>
                    <Box display='flex'>
                        <Button variant='contained' onClick={()=>setimage(camera.current.takePhoto())} sx={{m:2}}>Take Photo</Button>
                        <Button variant='contained' onClick={()=>{GenerateSugg();handleopen();}} sx={{m:2}}>Generate</Button>
                    </Box>
                    {image&&(
                        <Box sx={{mt:2,width:'100%',maxWidth:'300px'}}>
                            <img src={image} alt="Taken Photo" style={styles.capturedimage}/>
                        </Box>
                    )}
                </Box>
                <Typography variant='h3'>{sug}</Typography>
            </Paper>
        </Container>
    )
}

