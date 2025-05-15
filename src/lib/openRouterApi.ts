import { Message } from "./types";

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const API_KEYS = [
  "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",
  "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",
  "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"
];

let currentKeyIndex = 0;

function getNextApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

export async function callOpenRouterAPI(
  model: string, 
  messages: Message[],
  streamEnabled: boolean = false
): Promise<string> {
  try {
    // Convert our Message type to OpenRouter's message format
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getNextApiKey()}`,
        'HTTP-Referer': 'https://lynk.id/toolsmicrostock/s/ObgXNW4',
        'X-Title': 'AIndonesia by Info Tools Microstock'
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        stream: streamEnabled
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    if (streamEnabled) {
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let responseText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and append it
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;
            
            try {
              const json = JSON.parse(jsonStr);
              const content = json.choices[0]?.delta?.content;
              if (content) {
                responseText += content;
              }
            } catch (e) {
              console.error('Error parsing streaming response:', e);
            }
          }
        }
      }
      return responseText;
    } else {
      // Handle regular response
      const data: OpenRouterResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response from the model.';
    }
  } catch (error: any) {
    console.error('OpenRouter API error:', error);
    throw new Error(error.message || 'An error occurred while fetching the response.');
  }
}
