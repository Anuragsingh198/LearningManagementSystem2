
import React, { useState } from "react";
import { Box } from "@mui/material";
import CourseDetails from "../../components/CourseDetails/CourseDetailsMainPage";
import { useParams } from "react-router-dom";


export const ModuleDetails = () => {

    const { moduleId } = useParams();

    console.log("this is the  module id from ModuleDetails : ", moduleId);

    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                borderRadius: 10,
                minHeight: '100vh', // Ensure it takes full screen height
                border: '1px solid',
                 borderColor: 'grey.300', // You can adjust this to grey.100 or grey.200 for even lighter
                // backgroundColor: 'black',
                overflowY: 'hidden',
                '&::-webkit-scrollbar': {
                    display: 'none', // Hide scrollbar on Chrome/Safari
                },
                scrollbarWidth: 'none', // Hide scrollbar on Firefox
            }}
        >
            <CourseDetails moduleId={moduleId} />
        </Box>

    );
}