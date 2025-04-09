export async function fetchPromptResponse(prompt: string, promptType?: string) {
  const query = new URLSearchParams({
    question: prompt,
    prompt_type: promptType ?? 'general',
  }).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/retrieve?${query}`
  );

  if (!res.ok) throw new Error(`Failed to retrieve: ${res.statusText}`);

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let streamData = '';
  let buffer = '';

  while (true) {
    const { done, value } = (await reader?.read()) || {};
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary = buffer.indexOf('\n');
    while (boundary !== -1) {
      const line = buffer.substring(0, boundary).trim();
      buffer = buffer.substring(boundary + 1);

      if (line) {
        try {
          const data = JSON.parse(line);
          if (data.answer) {
            streamData += data.answer;
          } else if (data.error) {
            throw new Error(data.error);
          }
        } catch (e) {
          console.error('Error parsing streamed data:', e);
          throw e;
        }
      }
      boundary = buffer.indexOf('\n');
    }
  }
  return streamData;
}
