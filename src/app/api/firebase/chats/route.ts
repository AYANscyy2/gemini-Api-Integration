import { NextResponse } from "next/server";
import { db } from "@/utils/FirebaseConfig";
import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  deleteDoc,
  where,
  doc,
  writeBatch,
  getDoc
} from "firebase/firestore";

export async function GET() {
  try {
    const chatSessionsRef = collection(db, "chatSessions");
    const q = query(chatSessionsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const sessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { chatId, title } = await req.json();

    const chatSessionsRef = collection(db, "chatSessions");

    const docRef = await addDoc(chatSessionsRef, {
      chatId,
      createdAt: new Date(),
      title: title
    });

    return NextResponse.json(
      {
        success: true,
        chatId,
        docId: docRef.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const chatId = url.searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    console.log("Full URL:", request.url);
    console.log("Extracted chatId:", chatId);

    const chatSessionRef = doc(db, "chatSessions", chatId);
    console.log("Document path:", chatSessionRef.path);

    // Verify document existence
    const chatSnapshot = await getDoc(chatSessionRef);
    console.log("Document exists:", chatSnapshot.exists());
    console.log("Document data:", chatSnapshot.data());

    if (!chatSnapshot.exists()) {
      return NextResponse.json(
        { error: "Chat session not found" },
        { status: 404 }
      );
    }
    // Delete chat session first
    await deleteDoc(chatSessionRef);
    console.log("Chat session deleted:", chatId);

    // Delete associated messages in batch
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(messagesRef, where("chatId", "==", chatId));
    const querySnapshot = await getDocs(messagesQuery);

    if (!querySnapshot.empty) {
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit the batch
      await batch.commit();
      console.log(`Deleted ${querySnapshot.size} messages for chat ${chatId}`);
    } else {
      console.log("No messages found for chat:", chatId);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Chat session and ${querySnapshot.size} messages deleted successfully`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE operation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
