'use client';

import React, { useEffect, useRef } from 'react';

export default function ViewerPrebuilt({ pdfPath }: { pdfPath: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const iframeWindow = iframe.contentWindow;
      const iframeDocument = iframe.contentDocument;

      if (!iframeWindow || !iframeDocument) return;

      // Create a tooltip element outside of the event listeners
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltipAnnotation';
      tooltip.style.background = 'white';
      tooltip.style.border = '2px solid black';
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '10000';
      tooltip.style.display = 'none'; // Initially hidden
      iframeDocument.body.appendChild(tooltip); // Append to body for positioning

      // Function to handle mouseover events
      const handleMouseOver = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'SPAN') {
          const textContent = target.textContent?.trim();
          if (textContent) {
            // Highlight the hovered text
            target.classList.add('highlight');

            // Calculate tooltip position based on mouse position
            const mouseX = event.clientX; // Mouse X coordinate
            const mouseY = event.clientY; // Mouse Y coordinate

            // Adjust tooltip position to be near the mouse cursor
            tooltip.style.left = `${mouseX}px`; // Offset from mouse cursor
            tooltip.style.top = `${mouseY - 40}px`; // Position above cursor
            tooltip.textContent = textContent;
            tooltip.style.display = 'block'; // Show the tooltip
          }
        }
      };

      // Function to handle mouseout events
      const handleMouseOut = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'SPAN') {
          target.classList.remove('highlight'); // Remove highlight
          tooltip.style.display = 'none'; // Hide the tooltip
        }
      };
      const addHoverListenersToTextLayer = (textLayer: HTMLDivElement) => {
        textLayer.addEventListener('mouseover', handleMouseOver);
        textLayer.addEventListener('mouseout', handleMouseOut);
      };

      // MutationObserver to detect when the text layer is added
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const textLayers = iframeDocument.querySelectorAll('.textLayer');

            textLayers.forEach((obj) => {
              const textLayer = obj as HTMLDivElement;
              if (textLayer) {
                addHoverListenersToTextLayer(textLayer);
              }
            });
          }
        });
      });

      observer.observe(iframeDocument.body, { childList: true, subtree: true });
      const checkForTextLayerExistence = () => {
        const textLayer = iframeDocument.querySelector(
          '.textLayer'
        ) as HTMLDivElement;
        if (textLayer) {
          addHoverListenersToTextLayer(textLayer); // Reapply listeners if necessary
        }
      };

      // Set an interval to check for new documents being loaded in the viewer
      const intervalId = setInterval(checkForTextLayerExistence, 1000);

      // Cleanup on unmount
      return () => {
        clearInterval(intervalId);
        observer.disconnect(); // Disconnect observer on component unmount
        tooltip.remove(); // Remove tooltip from DOM
        if (iframeDocument) {
          const textLayers = iframeDocument.querySelectorAll('.textLayer');

          textLayers.forEach((obj) => {
            const textLayer = obj as HTMLDivElement;
            if (textLayer) {
              textLayer.removeEventListener('mouseover', handleMouseOver);
              textLayer.removeEventListener('mouseout', handleMouseOut);
            }
          });
        }
      };
    };
    // Attach load event listener to the iframe
    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad); // Cleanup load listener on unmount
    };
  }, [pdfPath]);

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
