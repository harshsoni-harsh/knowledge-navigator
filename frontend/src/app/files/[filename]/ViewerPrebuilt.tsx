'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { fetchPromptResponse } from '@/app/actions';

export default function ViewerPrebuilt({ pdfPath }: { pdfPath: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Fetch selected text meaning
  const fetchDefinition = async (word: string) => {
    try {
      return await fetchPromptResponse(
        `${encodeURIComponent(word)}`
      );
    } catch (error) {
      if (error) return 'Definition not found';
    }
  };

  // Handle text selection inside the iframe
  const handleTextSelection = useCallback(async () => {
    const iframe = iframeRef.current;
    const tooltip = tooltipRef.current;
    if (!tooltip || !iframe?.contentWindow) return;
    const selection = iframe.contentWindow.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (selectedText.length > 0) {
        const definition = await fetchDefinition(selectedText);
        tooltip.textContent = `${definition}`;

        // Use the iframe's scroll offsets instead of the parent window's
        tooltip.style.left = `${rect.left + iframe.contentWindow.scrollX}px`;
        tooltip.style.top = `${rect.top + iframe.contentWindow.scrollY - 40}px`;
        tooltip.style.display = 'block';
      }
    } else {
      tooltip.style.display = 'none';
    }
  }, []);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    const iframeWindow = iframe?.contentWindow;
    const iframeDocument = iframe?.contentDocument;
    if (!iframeWindow || !iframeDocument) return;

    // Create tooltip element (only once)
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'tooltipAnnotation';
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.background = 'white';
    tooltipElement.style.border = '2px solid black';
    tooltipElement.style.padding = '5px';
    tooltipElement.style.zIndex = '10000';
    tooltipElement.style.display = 'none';
    iframeDocument.body.appendChild(tooltipElement);
    tooltipRef.current = tooltipElement;

    // Add event listener for text selection
    iframeDocument.addEventListener('mouseup', handleTextSelection);
  }, [handleTextSelection]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.addEventListener('load', handleLoad);
    return () => {
      const tooltip = tooltipRef.current;
      if (tooltip) tooltip.remove(); // Clean up tooltip from the DOM
      iframe.removeEventListener('load', handleLoad);
    };
  }, [pdfPath, handleLoad]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        ref={iframeRef}
        className="h-full"
        src={`/pdfjs/web/viewer.html?file=${pdfPath}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}
