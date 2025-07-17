import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, ChevronDown } from 'lucide-react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  IconButton,
  useTheme,
  styled
} from '@mui/material';

const EditorHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[800],
  borderBottom: `1px solid ${theme.palette.grey[700]}`
}));

const LanguageSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.grey[700],
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[600]}`,
  '& .MuiSelect-select': {
    padding: theme.spacing(0.5, 3, 0.5, 1.5)
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '&:hover': {
    borderColor: theme.palette.primary.main
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main
  }
}));

const RunButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.success.dark
  },
  '&:disabled': {
    backgroundColor: theme.palette.success.light
  }
}));

const CodeEditor = ({
  language,
  value,
  onChange,
  onLanguageChange,
  onCompileAndRun,
  isCompiling
}) => {
  const editorRef = useRef(null);
  const theme = useTheme();

  const languageOptions = [
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' }
  ];

  const getInitialCode = (lang) => {
    switch (lang) {
      case 'python':
        return '# Write your code here\n\n';
      case 'cpp':
        return '// Write your code here\n#include <iostream>\nusing namespace std;\n\n';
      default:
        return '# Write your code here\n\n';
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (!value || value.trim() === '') {
      onChange(getInitialCode(language));
    }
  }, [language]);

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: theme.palette.grey[900] 
    }}>
      {/* Editor Header */}
      <EditorHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: 'common.white', fontWeight: 'medium' }}>
            Code Editor
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language Selector */}
          <LanguageSelect
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            IconComponent={() => (
              <ChevronDown 
                style={{ 
                  width: 16, 
                  height: 16, 
                  color: theme.palette.grey[400],
                  position: 'absolute',
                  right: 8,
                  pointerEvents: 'none'
                }} 
              />
            )}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme.palette.grey[800],
                  color: theme.palette.common.white
                }
              }
            }}
          >
            {languageOptions.map(option => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{
                  backgroundColor: theme.palette.grey[800],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[700]
                  }
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </LanguageSelect>
          
          {/* Compile & Run Button */}
          <RunButton
            onClick={onCompileAndRun}
            disabled={isCompiling}
            variant="contained"
            startIcon={
              isCompiling ? (
                <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
              ) : (
                <Play style={{ width: 16, height: 16 }} />
              )
            }
            sx={{
              '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' }
              }
            }}
          >
            {isCompiling ? 'Running...' : 'Run Code'}
          </RunButton>
        </Box>
      </EditorHeader>

      {/* Monaco Editor */}
      <Box sx={{ flex: 1 }}>
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : 'python'}
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
          }}
        />
      </Box>
    </Box>
  );
};

export default CodeEditor;