import { NextResponse } from "next/server";
import { db } from "@/utils/FirebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  //   orderBy,
  doc,
  updateDoc
} from "firebase/firestore";

type Message = {
  id?: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }
    const chatSessionsRef = collection(db, "chatSessions");
    const sessionQuery = query(chatSessionsRef, where("chatId", "==", chatId));
    const sessionSnapshot = await getDocs(sessionQuery);

    let title = "Chat";
    let sessionDocId = null;

    if (!sessionSnapshot.empty) {
      const sessionData = sessionSnapshot.docs[0];
      sessionDocId = sessionData.id;
      title = sessionData.data().title || "Chat";
    }

    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("chatId", "==", chatId)
      //   orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(messagesQuery);
    const messages: Message[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Message)
    }));
    return NextResponse.json(
      { messages, chatTitle: title, sessionDocId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { chatId, content, role } = await req.json();

    if (!chatId || !content || !role) {
      return NextResponse.json(
        { error: "Chat ID, content, and role are required" },
        { status: 400 }
      );
    }

    const messagesRef = collection(db, "messages");
    const messageData = {
      chatId,
      content,
      role,
      timestamp: new Date()
    };

    const docRef = await addDoc(messagesRef, messageData);

    if (role === "user") {
      const chatSessionsRef = collection(db, "chatSessions");
      const sessionQuery = query(
        chatSessionsRef,
        where("chatId", "==", chatId)
      );
      const sessionSnapshot = await getDocs(sessionQuery);

      if (!sessionSnapshot.empty) {
        const sessionDoc = sessionSnapshot.docs[0];

        const messagesQuery = query(
          collection(db, "messages"),
          where("chatId", "==", chatId),
          where("role", "==", "user")
          //   orderBy("timestamp", "asc")
        );

        const messagesSnapshot = await getDocs(messagesQuery);

        if (
          !messagesSnapshot.empty &&
          messagesSnapshot.docs[0].id === docRef.id
        ) {
          const title =
            content.length > 30 ? `${content.substring(0, 30)}...` : content;

          await updateDoc(doc(db, "chatSessions", sessionDoc.id), { title });
        }
      }
    }

    return NextResponse.json(
      { success: true, id: docRef.id, ...messageData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}
