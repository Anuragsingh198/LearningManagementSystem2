
import  React , { useState } from "react";
import { Box } from "@mui/material";
import CourseDetails from "../../components/CourseDetails/CourseDetailsMainPage";
import { useParams } from "react-router-dom";


export  const  ModuleDetails =()=>{
      
    const  {moduleId} = useParams();

    console.log("this is the  module id from ModuleDetails : " , moduleId);

    return (

            <Box sx={{display:'flex' , position:"absolute", width:' 100%' , height:'900px' , overflowY:'auto'}}>
            <CourseDetails moduleId= {moduleId}/>
        </Box>
    );
}