
import  React , { useState } from "react";
import { Box } from "@mui/material";
import CourseDetails from "../../components/CourseDetails/CourseDetailsMainPage";




export  const  ModuleDetails =()=>{


    return (

            <Box sx={{display:'flex' , position:"absolute", width:' 100%' , height:'900px' , overflowY:'auto'}}>
            <CourseDetails/>
        </Box>
    );
}