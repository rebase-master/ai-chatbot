'use client'

import { useState, useEffect, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import {
  db,
  createChat,
  getChatMessages,
  saveMessage,
  updateChatTitle,
  deleteChat,
  getChat
} from "../lib/db";

import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks/src/useLiveQuery";
import { SendHorizonal, MinusCircle } from "lucide-react";
import ChatThread from "../components/ChatThread";
import '../styles/page.css'

export default function Chat() {
  const router = useRouter()
  const chatThreadRef = useRef(null)

  const [currentChatId, setCurrentChatId] = useState(null)

  const fetchedChats = useLiveQuery(
    () => db.chats.orderBy('createdAt').reverse().toArray()
  )

  const currentChat = useLiveQuery(
    () => db.chats.get(Number(currentChatId)),
    [currentChatId],
  )

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    status,
  } = useChat({
    onFinish: async (message) => {
      if (currentChatId && message.role === 'assistant') {
        await saveMessage(currentChatId, message.role, message.content)
      }
    }
  })

  // Updates the current route with the current chat id
  // and updates the state of currentChatId
  const navigateToChat = useCallback(
    (chatId) => {
      router.push(`/chatId=${chatId}`)
      setCurrentChatId(chatId)
    },
    [router]
  )

  const initializeNewChat = useCallback(async () => {
    const chatId = await createChat()
    navigateToChat(chatId)
  }, [navigateToChat])

  const setActiveChat = useCallback(
    async (requestChatId = null) => {
      if (fetchedChats && fetchedChats.length === 0) {
        return initializeNewChat()
      }

      if (requestChatId) navigateToChat(Number(requestChatId))
      else navigateToChat(fetchedChats?.[0].id)
    },
    [navigateToChat, initializeNewChat, fetchedChats]
  )
}
