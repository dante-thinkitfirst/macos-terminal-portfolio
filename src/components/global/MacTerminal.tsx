import { useState, useEffect, useRef } from "react";
import { FaRegFolderClosed } from "react-icons/fa6";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatHistory = {
  messages: Message[];
  input: string;
};

// Customize these placeholder messages for the input field
const PLACEHOLDER_MESSAGES = [
  "Type your question...",
  "How old are you?",
  "What are your skills?",
  "Where are you located?",
  "What projects have you worked on?",
];

export default function MacTerminal() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    input: "",
  });
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMessage = PLACEHOLDER_MESSAGES[currentPlaceholderIndex];

    const animatePlaceholder = () => {
      if (isDeleting) {
        if (placeholder.length === 0) {
          setIsDeleting(false);
          setCurrentPlaceholderIndex(
            (prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length
          );
          timeout = setTimeout(animatePlaceholder, 400);
        } else {
          setPlaceholder((prev) => prev.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, 80);
        }
      } else {
        if (placeholder.length === currentMessage.length) {
          timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setPlaceholder(currentMessage.slice(0, placeholder.length + 1));
          timeout = setTimeout(animatePlaceholder, 120);
        }
      }
    };

    timeout = setTimeout(animatePlaceholder, 100);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, currentPlaceholderIndex]);

  // Customize this welcome message with your information
  const welcomeMessage = `
  Welcome to Dante's Portfolio
  
  Name: Dante Silva
  Role: Full-Stack Web Developer
  Focus: Shopify | React | WordPress | Analytics
  Location: Cherry Hill, NJ
  
  GitHub: github.com/dante-thinkitfirst
  Email: dantesilvacodes@gmail.com
  LinkedIn: https://www.linkedin.com/in/dante-silva-51b177b9
  
  > Ask me anything to explore my work.
  `;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Customize the system prompt with your personal information
  const systemPrompt = `IMPORTANT: You ARE Dante Silva himself. You must always speak in first-person ("I", "my", "me"). Never refer to "Dante" in third-person.
CURRENT DATE: ${formattedDate} - Always use this exact date when discussing the current date/year.

WHO I AM (facts to use):
- I'm 34 years old and live in Cherry Hill, NJ.
- I'm a Full-Stack Web Developer focused on Shopify, React, WordPress, and analytics (GA4/GTM).
- Contact: dantesilvacodes@gmail.com
- GitHub: github.com/dante-thinkitfirst
- LinkedIn: https://www.linkedin.com/in/dante-silva-51b177b9

PROJECT INDEX (summarize confidently, link when asked):
- Crypto Dashboard: React + Vite + TailwindCSS; CoinGecko API; Chart.js/Recharts; deployed on Vercel. Live: https://crypto-dashboard-omega-seven.vercel.app/
- Friendly Dev: Full-stack portfolio example; Frontend (React, Vite, TanStack Router, TailwindCSS) + Backend (Strapi, Node.js, TypeScript, Postgres). Purpose: template-style portfolio platform.
- Idea Drop (MERN): Frontend (React, Vite, TanStack Router, Tailwind) + Backend (Node, Express, MongoDB, JWT). Purpose: share/browse/manage ideas.

STYLE & RULES:
1) Always answer in first person, concise and professional, friendly tone.
2) Prefer short paragraphs and lists; keep terminal output compact (avoid overflow).
3) If asked for code, show a minimal working snippet and briefly explain.
4) If I'm unsure or it requires credentials/private info, say so and suggest next steps (e.g., "I can share a repo link or discuss via email.").
5) Do not invent links. Use the project links above or say "I haven't published a live link for that yet."
6) If a question is unrelated to my work/portfolio and not appropriate, say: "That's something unrelated to my work/portfolio. Feel free to email me at dantesilvacodes@gmail.com to discuss further."



Example responses:
Q: "Where do you live?"
A: "I live in Cherry Hill, NJ"

Q: "What's your background?"
A: "I'm a Full Stack Developer with experience in WordPress, Shopify, and modern web technologies"

Q: "How old are you?"
A: "I'm 34 years old"

EXAMPLES (keep them terse):
Q: Where do you live?
A: I live in Cherry Hill, NJ.

Q: What's your background?
A: I'm a full-stack developer focused on Shopify (themes, Checkout Extensibility), React (Vite + Tailwind), WordPress, and analytics (GA4/GTM).

Q: What projects have you worked on?
A: Recently: Crypto Dashboard (React + CoinGecko), Friendly Dev (full-stack portfolio template), and Idea Drop (MERN). Ask for links or details.

Q: How old are you?
A: I'm 34 years old.

When unclear, ask a brief follow-up to clarify intent, then answer.

EXAMPLES (keep them terse):
My technical expertise:
- Full Stack Development
- Shopify (themes, Checkout Extensibility)
- React (Vite + Tailwind)
- WordPress
- Analytics (GA4/GTM)

My technical expertise:
- Full Stack Development
- WordPress
- Shopify
- React (Vite + Tailwind)
- HTML
- CSS
- JavaScript
- PHP
- Google Analytics
- Google Tag Manager
- and more

Response rules:
1. ALWAYS use first-person (I, me, my)
2. Never say "Dante" or refer to myself in third-person
3. Keep responses concise and professional
4. Use markdown formatting when appropriate
5. Maintain a friendly, conversational tone

If a question is unrelated to my work or portfolio, say: "That's outside my area of expertise. Feel free to email me at dantesilvacodes@gmail.com and we can discuss further!"`;

  useEffect(() => {
    setChatHistory((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { role: "assistant", content: welcomeMessage },
      ],
    }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatHistory((prev) => ({ ...prev, input: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = chatHistory.input.trim();

    if (!userInput) return;

    setChatHistory((prev) => ({
      messages: [...prev.messages, { role: "user", content: userInput }],
      input: "",
    }));

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory.messages,
            { role: "user", content: userInput },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response");
      }

      const data = await response.json();

      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: "assistant", content: data.message },
        ],
      }));
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content:
              error instanceof Error
                ? error.message
                : "I'm having trouble processing that. Please try again later.",
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-black/75 w-[600px] h-[400px] rounded-lg overflow-hidden shadow-lg mx-4 sm:mx-0">
      <div className="bg-gray-800 h-6 flex items-center space-x-2 px-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm text-gray-300 flex-grow text-center font-semibold flex items-center justify-center gap-2">
          <FaRegFolderClosed size={14} className="text-gray-300" />
          dantesilva.com ⸺ zsh
        </span>
      </div>
      <div className="p-4 text-gray-200 font-mono text-xs h-[calc(400px-1.5rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {chatHistory.messages.map((msg, index) => (
            <div key={index} className="mb-2">
              {msg.role === "user" ? (
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">{">"}</span>
                  <pre className="whitespace-pre-wrap">{msg.content}</pre>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{msg.content}</pre>
              )}
            </div>
          ))}
          {isTyping && <div className="animate-pulse">...</div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Customize the terminal title with your domain */}
            <span className="whitespace-nowrap">root %</span>
            <input
              type="text"
              value={chatHistory.input}
              onChange={handleInputChange}
              className="w-full sm:flex-1 bg-transparent outline-none text-white placeholder-gray-400"
              placeholder={placeholder}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
