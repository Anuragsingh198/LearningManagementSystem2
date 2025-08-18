import React, { useRef, useEffect, useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, ChevronDown } from 'lucide-react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  useTheme,
  styled
} from '@mui/material';
import { getAllLanguageAction } from '../../context/Actions/AssignmentActions';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
// const judge0ServerUrl = 'http://172.19.13.158:2358';


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
  const { state: { codingLanguages }, dispatch } = useAssignmentContext();
  // const [languages, setLanguages] = useState(codingLanguages.languages);
  const [languages, setLanguages] = useState(codingLanguages.languages);

// useEffect(() => {
//   if (Array.isArray(codingLanguages.languages)) {
//     setLanguages(codingLanguages.languages);
//   }
// }, [codingLanguages.languages]);


// console.log('this is the  langiages  afwyehqgesahbster  extraction: ' ,languages )


  const mapJudge0ToMonaco = (langName = '') => {
    langName = langName.toLowerCase();
    if (langName.includes('python')) return 'python';
    if (langName.includes('c++')) return 'cpp';
    if (langName.includes('c#')) return 'csharp';
    if (langName.includes('java ')) return 'java';
    if (langName.startsWith('c ')) return 'c';
    if (langName.includes('javascript')) return 'javascript';
    return 'plaintext';
  };

  const getInitialCode = (monacoLang) => {
    switch (monacoLang) {
      case 'python': return '# Write your code here\n\n';
      case 'cpp': return '// Write your code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n';
      case 'c': return '/* Write your code here */\n#include <stdio.h>\n\nint main() {\n    return 0;\n}\n';
      case 'java': return '// Write your code here\npublic class Main {\n    public static void main(String[] args) {\n    }\n}\n';
      case 'javascript': return '// Write your code here\n\n';
      default: return '// Write your code here\n\n';
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // useEffect(() => {
  //   console.log("this is the coding languages  from the  codeEditor : ", codingLanguages)
  // }, [codingLanguages])

  const monacoLang = useMemo(() => {
    if (!languages || languages.length === 0) {
      return 'plaintext';
    }
    const langName = languages.find(l => l.id === language)?.name || '';
    return mapJudge0ToMonaco(langName);
  }, [language, languages]);

  useEffect(() => {
    if (!value?.trim()) {
      onChange(getInitialCode(monacoLang));
    }
  }, [monacoLang]);

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.grey[900]
    }}>

      <EditorHeader>
        <Typography variant="body1" sx={{ color: 'common.white', fontWeight: 'medium' }}>
          Code Editor
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

          <LanguageSelect
            value={languages.length > 0 ? language : ""}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={languages.length === 0}
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
            {languages.map(option => (
              <MenuItem
                key={option.id}
                value={option.id}
                sx={{
                  backgroundColor: theme.palette.grey[800],
                  '&:hover': { backgroundColor: theme.palette.grey[700] }
                }}
              >
                {option.name}
              </MenuItem>
            ))}
          </LanguageSelect>

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
          language={monacoLang}
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
            automaticLayout: true
          }}
        />
      </Box>
    </Box>
  );
};

export default CodeEditor;
