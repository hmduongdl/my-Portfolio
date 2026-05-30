const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ChatbotQA {
    id: number;
    question: string;
    answer: string;
    order_index: number;
}

const cache: Record<string, any> = {};
const pending: Record<string, Promise<any> | undefined> = {};

if (typeof window !== 'undefined') {
  window.addEventListener('chatbot-updated', () => {
    delete cache.chatbot;
    delete pending.chatbot;
  });
}

export const chatbotService = {
    async getQAList(): Promise<ChatbotQA[]> {
        const key = 'chatbot';
        if (cache[key]) return cache[key];
        if (pending[key]) return pending[key];

        pending[key] = fetch(`${API_BASE_URL.replace(/\/$/, '')}/chatbot`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch chatbot Q&As');
                const data = await res.json();
                cache[key] = data;
                return data;
            })
            .finally(() => {
                delete pending[key];
            });

        return pending[key];
    },

    getCachedQAList(): ChatbotQA[] | null {
        return cache['chatbot'] || null;
    }
};
