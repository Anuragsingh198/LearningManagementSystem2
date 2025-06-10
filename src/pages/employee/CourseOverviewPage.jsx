// OverviewPage.jsx
import React, { useState } from 'react';
import { OverviewContent } from '../../components/CourseDetails/OverviewContent';
import { Box } from '@mui/material';
// import { dummyChapters } from './dummyChapters';

const chapters = [
    {
        id: '1',
        title: 'Python Basics',
        videos: 9,
        articles: 9,
        problems: 2,
        mcqs: 15,
        completed: true,
        duration: '2h 30m'
    },
    {
        id: '2',
        title: 'Python Data Types',
        videos: 9,
        articles: 9,
        problems: 10,
        mcqs: 15,
        completed: false,
        duration: '3h 15m'
    },
    {
        id: '3',
        title: 'Input and Output in Python',
        videos: 2,
        articles: 2,
        problems: 4,
        mcqs: 15,
        completed: false,
        duration: '1h 45m'
    },
    {
        id: '4',
        title: 'Control Structures',
        videos: 12,
        articles: 8,
        problems: 15,
        mcqs: 20,
        completed: false,
        duration: '4h 20m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    }
];

const OverviewPage = () => {

    const completedChapters = chapters.filter(c => c.completed).length;
    const totalChapters = chapters.length;
    const progressPercentage = (completedChapters / totalChapters) * 100;
    const [selectedChapter, setSelectedChapter] = useState(null);

  return (
    <>
    <Box sx={{display:'flex' , position:"absolute", width:' 90%' , left:'5%', height:'1000px' , overflowY:'auto'}}>
      <OverviewContent
        chapters={chapters}
        completedChapters={completedChapters}
        totalChapters={totalChapters}
        progressPercentage={progressPercentage}
        setSelectedChapter={setSelectedChapter}
      />
      {selectedChapter && <p style={{ marginTop: 20 }}>Selected Chapter ID: {selectedChapter}</p>}
    </Box>
    </>
  );
};

export default OverviewPage;
