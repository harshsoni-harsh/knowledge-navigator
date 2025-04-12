'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { fetchPromptResponse } from '@/lib/retrieval';
import { createPopper, Instance as PopperInstance } from '@popperjs/core';

export default function ViewerPrebuilt({ pdfPath, searchOnSelect }: { pdfPath: string, searchOnSelect: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const popperInstanceRef = useRef<PopperInstance | null>(null);
  const referenceElRef = useRef<HTMLDivElement | null>(null);

  // Fetch selected text meaning
  const fetchDefinition = useCallback(async (word: string) => {
    const definition = await (async (word: string) => {
      try {
        const definition = await fetchPromptResponse(
          `${encodeURIComponent(word)}`
        );
        return definition
      } catch (error) {
        if (error) return error instanceof Error ? error.message : error as string;
      }
    })(word);

    return (definition ?? '')
      .replaceAll("&nbsp;", " ")
      .split(/<br\s*\/?>/)
      .map((line: string) =>
        line.replace(
          /(https?:\/\/[^\s)]+)/g,
          `<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>`
        )
      )
      .join("<p></p>");
  }, []);

  const onScroll = useCallback(() => {
    popperInstanceRef.current?.update();
    if (tooltipRef.current) {
      tooltipRef.current.style.display = "none";
      tooltipRef.current.innerHTML = '';
    }
  }, [popperInstanceRef, tooltipRef]);

  // Handle text selection inside the iframe
  const handleTextSelection = useCallback(async () => {
    const iframe = iframeRef.current;
    const tooltip = tooltipRef.current;
    if (!tooltip || !iframe?.contentWindow || !iframe.contentDocument) return;
    const selection = iframe.contentWindow.getSelection();
    if (selection && selection.toString().trim() && searchOnSelect) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (selectedText.length > 0) {
        // Set tooltip content
        tooltip.innerHTML = 'Loading...'
        tooltip.style.display = 'block';
        tooltip.innerHTML = await fetchDefinition(selectedText) ?? '';

        let referenceEl = referenceElRef.current;
        if (!referenceEl) {
          referenceEl = iframe.contentDocument.createElement('div');
          referenceEl.style.position = 'absolute';
          referenceEl.style.width = '0px';
          referenceEl.style.height = '0px';
          iframe.contentDocument.body.appendChild(referenceEl);
          referenceElRef.current = referenceEl;
        }

        referenceEl.style.left = `${rect.left + iframe.contentWindow.scrollX}px`;
        referenceEl.style.top = `${rect.top + iframe.contentWindow.scrollY}px`;

        if (popperInstanceRef.current) {
          popperInstanceRef.current.destroy();
        }

        popperInstanceRef.current = createPopper(referenceEl, tooltip, {
          placement: 'auto',
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top', 'bottom', 'right', 'left'],
              },
            },
            {
              name: 'offset',
              options: {
                offset: [10, 30],
              },
            },
          ],
        });
        iframe.contentWindow.addEventListener('scroll', onScroll);
      }
    } else if (tooltip) {
      tooltip.style.display = 'none';
      tooltip.innerHTML = '';
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;
      }
      if (referenceElRef.current) {
        referenceElRef.current.remove();
        referenceElRef.current = null;
      }
    }
  }, [iframeRef, tooltipRef, searchOnSelect, fetchDefinition, onScroll]);

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    const iframeWindow = iframe?.contentWindow;
    const iframeDocument = iframe?.contentDocument;
    if (!iframeWindow || !iframeDocument) return

    // Add event listener for text selection
    iframeDocument.addEventListener('mouseup', handleTextSelection);
  }, [handleTextSelection]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (iframe.contentDocument?.readyState === 'complete') {
      handleLoad();
    } else {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [pdfPath, handleLoad]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        ref={iframeRef}
        onLoad={handleLoad}
        className="h-full relative"
        src={`/pdfjs/web/viewer.html?file=${pdfPath}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        content=''
      >
      </iframe>
      <div
        ref={tooltipRef}
        style={{ display: 'none' }}
        className='absolute top-0 left-0 bg-zinc-300 border-2 p-2 border-zinc-600 rounded-md max-w-96 max-h-96 overflow-auto text-black'
      />
    </div>
  );
}
