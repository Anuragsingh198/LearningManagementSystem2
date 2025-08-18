import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { SkipPrevious as SkipPreviousIcon, SkipNext as SkipNextIcon } from "@mui/icons-material";
import NoContentPage from "./NoContentPage";


export const ArticlesContent = ({ articles = [], currentArticle = 0, setCurrentArticle, onArticleComplete }) => {
  // Use provided articles only (no defaults)
  const effectiveArticles = Array.isArray(articles) ? articles : [];

  const article = effectiveArticles[currentArticle] || effectiveArticles[0];

  // compute unique id for completion: use index for consistent matching with sidebar
  const currentId = `${currentArticle}`;

  const isPdf = (url) => typeof url === "string" && url.toLowerCase().includes(".pdf");

  // Fullscreen support for the PDF preview
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Request/exit fullscreen on the parent container of the iframe
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const container = document.getElementById("article-pdf-container");
        if (container && container.requestFullscreen) {
          await container.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (e) {
      console.warn("Fullscreen toggle failed:", e);
    }
  };

  // Keep local state aligned with ESC key/fullscreenchange
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Selected Article Preview */}
      {article ? (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" noWrap>
              {article?.title || article?.name || "Untitled Document"}
            </Typography>
            {isPdf(article?.url || article?.link) && (
              <Button size="small" variant="outlined" onClick={toggleFullscreen}>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            )}
          </Box>
        
          {/* PDF preview only */}
          <Box id="article-pdf-container" sx={{ height: 480, border: "1px solid #e0e0e0", borderRadius: 1, overflow: "hidden" }}>
            <iframe
              title={article?.title || "Article"}
              src={(article?.url || article?.link || '') + "#toolbar=1&navpanes=0"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              onLoad={() => {
                onArticleComplete && onArticleComplete(currentId);
              }}
            />
          </Box>
          <Box sx={{mt: 2, ml: 1}}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }} noWrap>
            Description
          </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
            {article?.description || ""}
          </Typography>
          </Box>


        </Paper>
      ) : (
        <NoContentPage title={'Articles'} description={'No Articles Found'} />
      )}

      {/* Navigation - only when there are articles */}
      {effectiveArticles.length > 0 && (
        <Box sx={{
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            onClick={() => setCurrentArticle && setCurrentArticle(Math.max(0, currentArticle - 1))}
            disabled={currentArticle === 0}
            startIcon={<SkipPreviousIcon />}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Previous Article
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              {`Article ${Math.min(currentArticle + 1, effectiveArticles.length)} of ${effectiveArticles.length}`}
            </Typography>
          </Box>

          <Button
            onClick={() => setCurrentArticle && setCurrentArticle(Math.min(effectiveArticles.length - 1, currentArticle + 1))}
            disabled={currentArticle === (effectiveArticles.length - 1)}
            endIcon={<SkipNextIcon />}
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Next Article
          </Button>
        </Box>
      )}

      {/* {articles && articles.length > 0 && (
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {articles.map((a, idx) => (
            <Grid item key={idx}>
              <Button
                variant={currentArticle === idx ? "contained" : "outlined"}
                onClick={() => setCurrentArticle && setCurrentArticle(idx)}
                sx={{ textTransform: "none" }}
              >
                {a?.title || a?.name || `Article ${idx + 1}`}
              </Button>
            </Grid>
          ))}
        </Grid>
      )} */}
    </Box>
  );
};

