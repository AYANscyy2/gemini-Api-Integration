import { NextResponse } from "next/server";
import { db } from "@/utils/FirebaseConfig";
import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy
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
